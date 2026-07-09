import ExcelJS from "exceljs";
import { connectDB } from "../../../../lib/mongodb";
import Order from "../../../../models/Order";

/* DOWNLOAD ORDERS AS EXCEL (admin only, gated by proxy.js) */
export async function GET() {

  try {

    await connectDB();

    const orders =
      await Order.find().sort({ createdAt: -1 }).lean();

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "ANAMYST Admin";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Orders");

    sheet.columns = [
      { header: "Order ID", key: "orderId", width: 16 },
      { header: "Date", key: "date", width: 18 },
      { header: "Customer", key: "customerName", width: 24 },
      { header: "Email", key: "email", width: 26 },
      { header: "Phone", key: "phone", width: 16 },
      { header: "City", key: "city", width: 16 },
      { header: "State", key: "state", width: 16 },
      { header: "Products", key: "products", width: 40 },
      { header: "Payment Method", key: "paymentMethod", width: 16 },
      { header: "Payment Status", key: "paymentStatus", width: 16 },
      { header: "Order Status", key: "orderStatus", width: 14 },
      { header: "Total (₹)", key: "totalAmount", width: 14 },
    ];

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD4AF37" },
    };

    let totalRevenue = 0;

    for (const order of orders) {

      const productsSummary = (order.products || [])
        .map((p) => `${p.name} x${p.quantity}`)
        .join(", ");

      if (order.orderStatus !== "Cancelled") {
        totalRevenue += order.totalAmount || 0;
      }

      const row = sheet.addRow({

        orderId: order.orderId || "-",
        date: order.createdAt
          ? new Date(order.createdAt).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })
          : "",
        customerName: order.customerName,
        email: order.email,
        phone: order.phone,
        city: order.city || "",
        state: order.state || "",
        products: productsSummary,
        paymentMethod: order.paymentMethod || "COD",
        paymentStatus: order.paymentStatus || "Pending",
        orderStatus: order.orderStatus || "Pending",
        totalAmount: order.totalAmount || 0,

      });

      if (order.orderStatus === "Cancelled") {
        row.getCell("orderStatus").font = { color: { argb: "FFDC2626" } };
      } else if (order.orderStatus === "Delivered") {
        row.getCell("orderStatus").font = { color: { argb: "FF16A34A" } };
      } else {
        row.getCell("orderStatus").font = { color: { argb: "FFEAB308" } };
      }

    }

    const totalRow = sheet.addRow({
      orderId: "TOTAL",
      totalAmount: totalRevenue,
    });
    totalRow.font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();

    const filename =
      `anamyst-orders-${new Date().toISOString().slice(0, 10)}.xlsx`;

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
