import { connectDB } from "../../../lib/mongodb";
import Product from "../../../models/Product";
import ProductClient from "./ProductClient";
import mongoose from "mongoose";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return {
      title: "Product Not Found | ANAMYST",
      description: "Luxury fragrances by ANAMYST.",
    };
  }

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

/* Server-side related products:
   same category / gender first, exclude current, randomized, max 8 */
async function getRelatedProducts(product) {
  const related = await Product.find({
    _id: { $ne: product._id },
    $or: [
      { category: product.category },
      { genderCategory: product.genderCategory },
    ],
  }).lean();

  if (related.length < 8) {
    const extra = await Product.find({
      _id: {
        $nin: [product._id, ...related.map((p) => p._id)],
      },
    })
      .limit(8 - related.length)
      .lean();

    related.push(...extra);
  }

  // Fisher–Yates shuffle
  for (let i = related.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [related[i], related[j]] = [related[j], related[i]];
  }

  return related.slice(0, 8);
}

export default async function ProductPage({ params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  await connectDB();

  const product = await Product.findById(id).lean();

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product);

  // Serialize ObjectIds / Dates for the client component
  const productData = JSON.parse(JSON.stringify(product));
  const relatedData = JSON.parse(JSON.stringify(relatedProducts));

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
      <ProductClient
        productId={id}
        initialProduct={productData}
        initialRelated={relatedData}
      />
    </>
  );
}
