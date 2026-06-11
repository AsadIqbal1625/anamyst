import { connectDB } from "../../../lib/mongodb";
import Product from "../../../models/Product";
import CategoryClient from "./CategoryClient";

export async function generateMetadata({ params }) {
  const { category } = await params;

  const categoryName = decodeURIComponent(category)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    title: `${categoryName} | ANAMYST Luxury Fragrances`,
    description: `Explore the ${categoryName} collection by ANAMYST. Discover premium luxury fragrances crafted for elegance and sophistication.`,
    alternates: {
      canonical: `https://anamyst.com/shop/${category}`,
    },
  };
}

export default async function CategoryPage({ params }) {
  const { category } = await params;

  await connectDB();

  const products = await Product.find({}).lean();

  const filteredProducts = products
    .filter(
      (product) =>
        product.category
          ?.toLowerCase()
          .replace(/\s+/g, "-") ===
        decodeURIComponent(category).toLowerCase()
    )
    .map((product) => ({
      ...product,
      _id: product._id.toString(),
    }));

  return (
    <CategoryClient
      category={category}
      initialProducts={filteredProducts}
    />
  );
}