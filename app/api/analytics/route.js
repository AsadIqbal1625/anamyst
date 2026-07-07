import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Order from "../../../models/Order";
import Event from "../../../models/Event";

export async function GET() {
  try {
    await connectDB();

    const since = new Date();
    since.setDate(since.getDate() - 30);

    const [orders, events] = await Promise.all([
      Order.find().lean(),
      Event.find({ createdAt: { $gte: since } }).lean(),
    ]);
    const active = orders.filter((o) => o.orderStatus !== "Cancelled");

    /* DAILY REVENUE — LAST 30 DAYS */
    const days = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ date: key, revenue: 0, orders: 0 });
    }
    const dayMap = Object.fromEntries(days.map((d) => [d.date, d]));

    active.forEach((o) => {
      const key = new Date(o.createdAt).toISOString().slice(0, 10);
      if (dayMap[key]) {
        dayMap[key].revenue += o.totalAmount || 0;
        dayMap[key].orders += 1;
      }
    });

    /* TOP PRODUCTS */
    const productMap = {};
    active.forEach((o) => {
      (o.products || []).forEach((p) => {
        if (!productMap[p.name]) {
          productMap[p.name] = { name: p.name, units: 0, revenue: 0 };
        }
        productMap[p.name].units += p.quantity || 0;
        productMap[p.name].revenue += (p.price || 0) * (p.quantity || 0);
      });
    });
    const topProducts = Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);

    /* STATUS BREAKDOWN */
    const statusBreakdown = {
      Pending: orders.filter((o) => o.orderStatus === "Pending").length,
      Delivered: orders.filter((o) => o.orderStatus === "Delivered").length,
      Cancelled: orders.filter((o) => o.orderStatus === "Cancelled").length,
    };

    /* SUMMARY */
    const totalRevenue = active.reduce(
      (s, o) => s + (o.totalAmount || 0),
      0
    );
    const avgOrderValue = active.length
      ? Math.round(totalRevenue / active.length)
      : 0;

    /* VISITOR FUNNEL — LAST 30 DAYS */
    const uniqueSessions = (type) =>
      new Set(
        events.filter((e) => e.type === type).map((e) => e.sessionId)
      );

    const allVisitors = new Set(events.map((e) => e.sessionId));
    const productViewers = uniqueSessions("product_view");
    const cartAdders = uniqueSessions("add_to_cart");
    const checkoutStarters = uniqueSessions("checkout_started");

    const ordersLast30 = active.filter(
      (o) => new Date(o.createdAt) >= since
    ).length;

    const funnel = {
      visitors: allVisitors.size,
      productViewers: productViewers.size,
      cartAdders: cartAdders.size,
      checkoutStarters: checkoutStarters.size,
      purchased: ordersLast30,
    };

    const conversionRate = funnel.visitors
      ? ((funnel.purchased / funnel.visitors) * 100).toFixed(1)
      : "0.0";

    /* DAILY UNIQUE VISITORS (last 30 days) */
    const dailyVisitorMap = {};
    days.forEach((d) => {
      dailyVisitorMap[d.date] = new Set();
    });
    events.forEach((e) => {
      const key = new Date(e.createdAt).toISOString().slice(0, 10);
      if (dailyVisitorMap[key]) dailyVisitorMap[key].add(e.sessionId);
    });
    const dailyVisitors = days.map((d) => ({
      date: d.date,
      visitors: dailyVisitorMap[d.date].size,
    }));

    /* DEVICE BREAKDOWN (unique sessions) */
    const deviceMap = {};
    events.forEach((e) => {
      const dev = e.device || "Unknown";
      if (!deviceMap[dev]) deviceMap[dev] = new Set();
      deviceMap[dev].add(e.sessionId);
    });
    const devices = Object.entries(deviceMap).map(([name, set]) => ({
      name,
      visitors: set.size,
    }));

    /* TOP LOCATIONS (unique sessions) */
    const locationMap = {};
    events.forEach((e) => {
      const loc =
        e.city && e.country
          ? `${e.city}, ${e.country}`
          : e.country || "Unknown";
      if (!locationMap[loc]) locationMap[loc] = new Set();
      locationMap[loc].add(e.sessionId);
    });
    const locations = Object.entries(locationMap)
      .map(([name, set]) => ({ name, visitors: set.size }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 6);

    /* ABANDONED CARTS & CHECKOUTS */
    const purchasedSessions = uniqueSessions("purchase");

    const abandonedCarts = [...cartAdders].filter(
      (s) => !purchasedSessions.has(s)
    ).length;

    const abandonedCheckouts = [...checkoutStarters].filter(
      (s) => !purchasedSessions.has(s)
    ).length;

    const cartAbandonRate = cartAdders.size
      ? Math.round((abandonedCarts / cartAdders.size) * 100)
      : 0;

    return NextResponse.json({
      success: true,
      daily: days,
      topProducts,
      statusBreakdown,
      funnel,
      conversionRate,
      dailyVisitors,
      devices,
      locations,
      abandoned: {
        carts: abandonedCarts,
        checkouts: abandonedCheckouts,
        rate: cartAbandonRate,
      },
      summary: {
        totalRevenue,
        totalOrders: orders.length,
        avgOrderValue,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
