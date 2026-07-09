import ExcelJS from "exceljs";
import { connectDB } from "../../../../lib/mongodb";
import Customer from "../../../../models/Customer";

/* DOWNLOAD CUSTOMERS AS EXCEL (admin only, gated by proxy.js) */
export async function GET() {

  try {

    await connectDB();

    const customers =
      await Customer.find().sort({ createdAt: -1 }).lean();

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "ANAMYST Admin";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Customers");

    sheet.columns = [
      { header: "Customer ID", key: "customerId", width: 16 },
      { header: "Name", key: "name", width: 24 },
      { header: "Mobile", key: "mobile", width: 16 },
      { header: "Email", key: "email", width: 26 },
      { header: "City", key: "city", width: 16 },
      { header: "State", key: "state", width: 16 },
      { header: "Address", key: "address", width: 30 },
      { header: "Total Orders", key: "totalOrders", width: 14 },
      { header: "Total Spent (₹)", key: "totalSpent", width: 16 },
      { header: "Last Order", key: "lastOrderDate", width: 18 },
    ];

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD4AF37" },
    };

    for (const customer of customers) {

      sheet.addRow({

        customerId: customer.customerId || "-",
        name: customer.name,
        mobile: customer.mobile,
        email: customer.email || "",
        city: customer.city || "",
        state: customer.state || "",
        address: customer.address || "",
        totalOrders: customer.totalOrders || 0,
        totalSpent: customer.totalSpent || 0,
        lastOrderDate: customer.lastOrderDate
          ? new Date(customer.lastOrderDate).toLocaleDateString("en-IN")
          : "",

      });

    }

    const buffer = await workbook.xlsx.writeBuffer();

    const filename =
      `anamyst-customers-${new Date().toISOString().slice(0, 10)}.xlsx`;

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
