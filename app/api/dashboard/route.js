import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Order from "../../../models/Order";
import Product from "../../../models/Product";
import Customer from "../../../models/Customer";

export async function GET() {
  try {
    await connectDB();

    const [orders, products, customers] = await Promise.all([
      Order.find().sort({ createdAt: -1 }).lean(),
      Product.find({}, "name stock").lean(),
      Customer.countDocuments(),
    ]);

    const activeOrders = orders.filter(
      (o) => o.orderStatus !== "Cancelled"
    );

    const revenue = activeOrders.reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0
    );

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthRevenue = activeOrders
      .filter((o) => new Date(o.createdAt) >= monthStart)
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const recentOrders = orders.slice(0, 6).map((o) => ({
      _id: o._id,
      orderId: o.orderId,
      customerName: o.customerName,
      totalAmount: o.totalAmount,
      orderStatus: o.orderStatus,
      createdAt: o.createdAt,
    }));

    const lowStock = products
      .filter((p) => (p.stock ?? 0) <= 5)
      .map((p) => ({ _id: p._id, name: p.name, stock: p.stock ?? 0 }));

    return NextResponse.json({
      success: true,
      stats: {
        revenue,
        monthRevenue,
        orders: orders.length,
        pending: orders.filter((o) => o.orderStatus === "Pending").length,
        delivered: orders.filter((o) => o.orderStatus === "Delivered").length,
        cancelled: orders.filter((o) => o.orderStatus === "Cancelled").length,
        customers,
        products: products.length,
      },
      recentOrders,
      lowStock,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
