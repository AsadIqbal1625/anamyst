import { connectDB } from "../../../lib/mongodb";
import Product from "../../../models/Product";
import ProductClient from "./ProductClient";
import mongoose from "mongoose";

export async function generateMetadata({ params }) {
  const { id } = await params;

  await connectDB();

  const product = await Product.findById(id).lean();

  if (!product) {
    return {
      title: "Product Not Found | ANAMYST",
      description: "Luxury fragrances by ANAMYST.",
    };
  }

  return {
    title: `${product.name} | Luxury Perfume | ANAMYST`,
    description:
      product.description?.substring(0, 160) ||
      "Discover premium luxury fragrances by ANAMYST.",
    openGraph: {
      title: `${product.name} | ANAMYST`,
      description:
        product.description?.substring(0, 160) ||
        "Luxury fragrance collection.",
      images: [
        {
          url: product.image,
        },
      ],
    },
    alternates: {
      canonical: `https://anamyst.com/product/${id}`,
    },
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;

  await connectDB();


if (!mongoose.Types.ObjectId.isValid(id)) {
  return {
    title: "Product Not Found | ANAMYST",
    description: "Luxury fragrances by ANAMYST.",
  };
}
  const product = await Product.findById(id).lean();

  if (!product) {
    return <ProductClient productId={id} />;
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [product.image],
    description: product.description,
    brand: {
      "@type": "Brand",
      name: "ANAMYST",
    },
    offers: {
      "@type": "Offer",
      url: `https://anamyst.com/product/${id}`,
      priceCurrency: "INR",
      price: String(product.price),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
  const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://anamyst.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Shop",
      item: "https://anamyst.com/shop",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: product.category || "Products",
      item: `https://anamyst.com/shop/${(product.category || "").toLowerCase().replace(/\s+/g, "-")}`,
    },
    {
      "@type": "ListItem",
      position: 4,
      name: product.name,
      item: `https://anamyst.com/product/${id}`,
    },
  ],
};
  return (
    <>
      <script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
          <script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbSchema),
      }}
    />
      <ProductClient productId={id} />
    </>
  );
}