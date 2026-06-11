import { connectDB } from "../../lib/mongodb";
import Product from "../../models/Product";
import ShopClient from "./ShopClient";

export const metadata = {
  title: "Shop Luxury Perfumes | ANAMYST",
  description:
    "Browse ANAMYST luxury perfumes, attars, fresheners, premium gifts, and fragrance collections.",
};

export default async function ShopPage() {
  await connectDB();

  const products = await Product.find({})
    .sort({ createdAt: -1 })
    .lean();

  // Convert MongoDB objects into plain serializable objects
  const serializedProducts = products.map((product) => ({
    ...product,
    _id: product._id.toString(),
  }));

  return (
    <ShopClient
      initialProducts={serializedProducts}
    />
  );
}