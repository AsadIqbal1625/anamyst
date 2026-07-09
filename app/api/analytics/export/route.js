import ExcelJS from "exceljs";
import { getAnalyticsData } from "../../../../lib/getAnalyticsData";

function styleHeader(sheet) {
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFD4AF37" },
  };
}

/* DOWNLOAD ANALYTICS AS A MULTI-SHEET EXCEL WORKBOOK
   (admin only, gated by proxy.js) */
export async function GET() {

  try {

    const data = await getAnalyticsData();

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "ANAMYST Admin";
    workbook.created = new Date();

    /* SUMMARY */
    const summarySheet = workbook.addWorksheet("Summary");
    summarySheet.columns = [
      { header: "Metric", key: "metric", width: 28 },
      { header: "Value", key: "value", width: 20 },
    ];
    styleHeader(summarySheet);
    summarySheet.addRows([
      { metric: "Total Revenue (₹)", value: data.summary.totalRevenue },
      { metric: "Total Orders", value: data.summary.totalOrders },
      { metric: "Avg Order Value (₹)", value: data.summary.avgOrderValue },
      { metric: "Visitors (30 days)", value: data.funnel.visitors },
      { metric: "Conversion Rate (%)", value: Number(data.conversionRate) },
      { metric: "Abandoned Carts", value: data.abandoned.carts },
      { metric: "Cart Abandon Rate (%)", value: data.abandoned.rate },
      { metric: "Abandoned Checkouts", value: data.abandoned.checkouts },
    ]);

    /* DAILY REVENUE — LAST 30 DAYS */
    const dailySheet = workbook.addWorksheet("Daily Revenue");
    dailySheet.columns = [
      { header: "Date", key: "date", width: 14 },
      { header: "Revenue (₹)", key: "revenue", width: 14 },
      { header: "Orders", key: "orders", width: 12 },
      { header: "Visitors", key: "visitors", width: 12 },
    ];
    styleHeader(dailySheet);
    const visitorsByDate = Object.fromEntries(
      data.dailyVisitors.map((v) => [v.date, v.visitors])
    );
    data.daily.forEach((d) => {
      dailySheet.addRow({
        date: d.date,
        revenue: d.revenue,
        orders: d.orders,
        visitors: visitorsByDate[d.date] || 0,
      });
    });

    /* TOP PRODUCTS */
    const productsSheet = workbook.addWorksheet("Top Products");
    productsSheet.columns = [
      { header: "Product", key: "name", width: 32 },
      { header: "Units Sold", key: "units", width: 14 },
      { header: "Revenue (₹)", key: "revenue", width: 14 },
    ];
    styleHeader(productsSheet);
    data.topProducts.forEach((p) => productsSheet.addRow(p));

    /* ORDER STATUS BREAKDOWN */
    const statusSheet = workbook.addWorksheet("Order Status");
    statusSheet.columns = [
      { header: "Status", key: "status", width: 18 },
      { header: "Count", key: "count", width: 12 },
    ];
    styleHeader(statusSheet);
    Object.entries(data.statusBreakdown).forEach(([status, count]) =>
      statusSheet.addRow({ status, count })
    );

    /* VISITOR FUNNEL */
    const funnelSheet = workbook.addWorksheet("Funnel");
    funnelSheet.columns = [
      { header: "Stage", key: "stage", width: 24 },
      { header: "Count", key: "count", width: 12 },
    ];
    styleHeader(funnelSheet);
    funnelSheet.addRows([
      { stage: "Visitors", count: data.funnel.visitors },
      { stage: "Viewed a Product", count: data.funnel.productViewers },
      { stage: "Added to Cart", count: data.funnel.cartAdders },
      { stage: "Started Checkout", count: data.funnel.checkoutStarters },
      { stage: "Purchased", count: data.funnel.purchased },
    ]);

    /* DEVICES */
    const devicesSheet = workbook.addWorksheet("Devices");
    devicesSheet.columns = [
      { header: "Device", key: "name", width: 18 },
      { header: "Visitors", key: "visitors", width: 12 },
    ];
    styleHeader(devicesSheet);
    data.devices.forEach((d) => devicesSheet.addRow(d));

    /* LOCATIONS */
    const locationsSheet = workbook.addWorksheet("Locations");
    locationsSheet.columns = [
      { header: "Location", key: "name", width: 26 },
      { header: "Visitors", key: "visitors", width: 12 },
    ];
    styleHeader(locationsSheet);
    data.locations.forEach((l) => locationsSheet.addRow(l));

    const buffer = await workbook.xlsx.writeBuffer();

    const filename =
      `anamyst-analytics-${new Date().toISOString().slice(0, 10)}.xlsx`;

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
