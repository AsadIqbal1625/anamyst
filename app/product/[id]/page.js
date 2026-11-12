import { cache } from "react";
import { connectDB } from "../../../lib/mongodb";
import Product from "../../../models/Product";
import ProductClient from "./ProductClient";
import ProductReviews from "./ProductReviews";
import Review from "../../../models/Review";
import { getReviewStats } from "../../../lib/reviews";
import mongoose from "mongoose";
import { notFound } from "next/navigation";

/* Built on a visitor's first request, then kept ready for up to 60
   seconds (and refreshed straight away when admin edits the product or
   approves a review), instead of being rebuilt for every visitor. */
export const revalidate = 60;

export function generateStaticParams() {
  return [];
}

/* the metadata and the page both need the product: fetch it once */
const getProduct = cache(async (id) => {
  await connectDB();
  return Product.findById(id).lean();
});

export async function generateMetadata({ params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return {
      title: "Product Not Found | ANAMYST",
      description: "Luxury fragrances by ANAMYST.",
    };
  }

  const product = await getProduct(id);

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
      canonical: `https://www.anamyst.com/product/${id}`,
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

  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const [relatedProducts, reviewStats, approvedReviews] = await Promise.all([
    getRelatedProducts(product),
    getReviewStats(id),
    Review.find(
      { productId: id, status: "approved" },
      "name rating text createdAt"
    )
      .sort({ createdAt: -1 })
      .limit(30)
      .lean(),
  ]);

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
      url: `https://www.anamyst.com/product/${id}`,
      priceCurrency: "INR",
      price: String(product.price),
      /* tell Google the truth, so sold-out items aren't shown as buyable */
      availability:
        typeof product.stock === "number" && product.stock <= 0
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
  /* stars in Google results, only ever from real, approved reviews */
  if (reviewStats.count > 0) {

    productSchema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: reviewStats.average,
      reviewCount: reviewStats.count,
      bestRating: 5,
      worstRating: 1,
    };

    productSchema.review = approvedReviews.slice(0, 5).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      datePublished: new Date(r.createdAt).toISOString().slice(0, 10),
      reviewBody: r.text,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
    }));

  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.anamyst.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: "https://www.anamyst.com/shop",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category || "Products",
        item: `https://www.anamyst.com/shop/${(product.category || "").toLowerCase().replace(/\s+/g, "-")}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `https://www.anamyst.com/product/${id}`,
      },
    ],
  };
  return (
    <>
      <script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />
      <ProductClient
        productId={id}
        initialProduct={productData}
        initialRelated={relatedData}
        reviewsSection={
          <ProductReviews
            reviews={JSON.parse(JSON.stringify(approvedReviews))}
            stats={reviewStats}
          />
        }
      />
    </>
  );
}
