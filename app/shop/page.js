import { connectDB } from "../../lib/mongodb";
import Product from "../../models/Product";
import { Suspense } from "react";
import ShopClient, { ShopWithSearch } from "./ShopClient";

/* kept ready for up to 60 seconds instead of rebuilt for every visitor */
export const revalidate = 60;

export const metadata = {
  title: "Shop Luxury Perfumes | ANAMYST",
  description:
    "Browse ANAMYST luxury perfumes, attars, fresheners, premium gifts, and fragrance collections.",
  alternates: {
    canonical: "https://www.anamyst.com/shop",
  },
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

  /* the full product list is in the page HTML from the start; a search
     from the navbar (?search=) is then applied in the browser */
  return (
    <Suspense fallback={<ShopClient initialProducts={serializedProducts} />}>
      <ShopWithSearch initialProducts={serializedProducts} />
    </Suspense>
  );
}