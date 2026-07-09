import ExcelJS from "exceljs";
import { connectDB } from "../../../../lib/mongodb";
import Product from "../../../../models/Product";
import Order from "../../../../models/Order";

function startOfMonthUTC(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function endOfMonthUTC(date) {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      0,
      23,
      59,
      59,
      999
    )
  );
}

/* Parse "YYYY-MM-DD" as UTC midnight, avoiding local-timezone drift */
function parseDateInputUTC(value, endOfDay = false) {
  const [year, month, day] = value.split("-").map(Number);

  return endOfDay
    ? new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999))
    : new Date(Date.UTC(year, month - 1, day));
}

function toDateStamp(date) {
  return date.toISOString().slice(0, 10);
}

/* DOWNLOAD INVENTORY + SALES/PROFIT REPORT AS EXCEL
   (admin only, gated by proxy.js)
   Query params: ?from=YYYY-MM-DD&to=YYYY-MM-DD (defaults to current month) */
export async function GET(req) {

  try {

    await connectDB();

    const { searchParams } = new URL(req.url);

    const now = new Date();

    const from =
      searchParams.get("from")
        ? parseDateInputUTC(searchParams.get("from"))
        : startOfMonthUTC(now);

    const to =
      searchParams.get("to")
        ? parseDateInputUTC(searchParams.get("to"), true)
        : endOfMonthUTC(now);

    const products =
      await Product.find().sort({ category: 1, name: 1 }).lean();

    const orders =
      await Order.find({
        paymentStatus: "Paid",
        orderStatus: { $ne: "Cancelled" },
        createdAt: { $gte: from, $lte: to },
      }).lean();

    /* AGGREGATE UNITS/REVENUE PER PRODUCT
       (older orders don't have productId, so fall back to matching by name) */
    const salesById = new Map();
    const salesByName = new Map();

    for (const order of orders) {

      for (const line of order.products || []) {

        const qty = Number(line.quantity) || 0;
        const revenue = qty * (Number(line.price) || 0);

        if (line.productId) {

          const key = String(line.productId);
          const existing = salesById.get(key) || { qty: 0, revenue: 0 };
          existing.qty += qty;
          existing.revenue += revenue;
          salesById.set(key, existing);

        } else if (line.name) {

          const existing = salesByName.get(line.name) || { qty: 0, revenue: 0 };
          existing.qty += qty;
          existing.revenue += revenue;
          salesByName.set(line.name, existing);

        }

      }

    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "ANAMYST Admin";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Inventory");

    sheet.columns = [
      { header: "Name", key: "name", width: 32 },
      { header: "Category", key: "category", width: 16 },
      { header: "Gender Category", key: "genderCategory", width: 16 },
      { header: "Price (₹)", key: "price", width: 12 },
      { header: "Cost Price (₹)", key: "costPrice", width: 14 },
      { header: "Stock", key: "stock", width: 10 },
      { header: `Units Sold (${toDateStamp(from)} to ${toDateStamp(to)})`, key: "unitsSold", width: 24 },
      { header: "Revenue (₹)", key: "revenue", width: 16 },
      { header: "Cost of Goods Sold (₹)", key: "cogs", width: 20 },
      { header: "Profit / Loss (₹)", key: "profit", width: 18 },
      { header: "Rating", key: "rating", width: 10 },
      { header: "Reviews", key: "reviews", width: 10 },
      { header: "Badge", key: "badge", width: 14 },
      { header: "Tag", key: "tag", width: 14 },
      { header: "Added On", key: "createdAt", width: 18 },
    ];

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD4AF37" },
    };

    let totalUnits = 0;
    let totalRevenue = 0;
    let totalCogs = 0;

    for (const product of products) {

      const sale =
        salesById.get(String(product._id)) ||
        salesByName.get(product.name) ||
        { qty: 0, revenue: 0 };

      const hasCost = Boolean(product.costPrice);
      const cogs = hasCost ? product.costPrice * sale.qty : null;
      const profit = hasCost ? sale.revenue - cogs : null;

      totalUnits += sale.qty;
      totalRevenue += sale.revenue;
      totalCogs += cogs || 0;

      const row = sheet.addRow({

        name: product.name,
        category: product.category || "",
        genderCategory: product.genderCategory || "",
        price: product.price,
        costPrice: product.costPrice || "",
        stock: product.stock,
        unitsSold: sale.qty,
        revenue: sale.revenue,
        cogs: cogs ?? "N/A",
        profit: profit ?? "N/A",
        rating: product.rating,
        reviews: product.reviews,
        badge: product.badge || "",
        tag: product.tag || "",
        createdAt: product.createdAt
          ? new Date(product.createdAt).toLocaleDateString("en-IN")
          : "",

      });

      const stockCell = row.getCell("stock");

      if (typeof stockCell.value === "number" && stockCell.value <= 5) {

        stockCell.font = { color: { argb: "FFDC2626" }, bold: true };

      }

      if (hasCost) {

        row.getCell("profit").font = {
          bold: true,
          color: { argb: profit < 0 ? "FFDC2626" : "FF16A34A" },
        };

      }

    }

    // TOTALS ROW
    const totalRow = sheet.addRow({
      name: "TOTAL",
      unitsSold: totalUnits,
      revenue: totalRevenue,
      cogs: totalCogs,
      profit: totalRevenue - totalCogs,
    });

    totalRow.font = { bold: true };
    totalRow.getCell("profit").font = {
      bold: true,
      color: {
        argb: totalRevenue - totalCogs < 0 ? "FFDC2626" : "FF16A34A",
      },
    };

    const buffer = await workbook.xlsx.writeBuffer();

    const filename =
      `anamyst-inventory-${toDateStamp(from)}_to_${toDateStamp(to)}.xlsx`;

    return new Response(buffer, {

      status: 200,

      headers: {

        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        "Content-Disposition":
          `attachment; filename="${filename}"`,

      },

    });

  } catch (error) {

    return Response.json({
      success: false,
      error: error.message,
    });

  }

}
