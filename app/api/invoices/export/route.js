import ExcelJS from "exceljs";
import { connectDB } from "../../../../lib/mongodb";
import Order from "../../../../models/Order";

/* DOWNLOAD INVOICES AS EXCEL (admin only, gated by proxy.js) */
export async function GET() {

  try {

    await connectDB();

    const orders =
      await Order.find().sort({ createdAt: -1 }).lean();

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "ANAMYST Admin";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Invoices");

    sheet.columns = [
      { header: "Invoice ID", key: "invoiceId", width: 16 },
      { header: "Order ID", key: "orderId", width: 16 },
      { header: "Customer", key: "customerName", width: 24 },
      { header: "Date", key: "date", width: 18 },
      { header: "Amount (₹)", key: "totalAmount", width: 14 },
      { header: "Payment Method", key: "paymentMethod", width: 16 },
      { header: "Payment Status", key: "paymentStatus", width: 16 },
      { header: "Order Status", key: "orderStatus", width: 14 },
    ];

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD4AF37" },
    };

    let totalBilled = 0;

    for (const order of orders) {

      totalBilled += order.totalAmount || 0;

      const row = sheet.addRow({

        invoiceId: order.invoiceId || "-",
        orderId: order.orderId || "-",
        customerName: order.customerName,
        date: order.createdAt
          ? new Date(order.createdAt).toLocaleDateString("en-IN")
          : "",
        totalAmount: order.totalAmount || 0,
        paymentMethod: order.paymentMethod || "COD",
        paymentStatus: order.paymentStatus || "Pending",
        orderStatus: order.orderStatus || "Pending",

      });

      if (order.paymentStatus === "Paid") {
        row.getCell("paymentStatus").font = { color: { argb: "FF16A34A" } };
      } else {
        row.getCell("paymentStatus").font = { color: { argb: "FFEAB308" } };
      }

    }

    const totalRow = sheet.addRow({
      invoiceId: "TOTAL",
      totalAmount: totalBilled,
    });
    totalRow.font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();

    const filename =
      `anamyst-invoices-${new Date().toISOString().slice(0, 10)}.xlsx`;

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
