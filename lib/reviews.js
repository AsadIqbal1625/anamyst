import Review from "../models/Review";
import Product from "../models/Product";

/* Average and count of a product's APPROVED reviews only */
export async function getReviewStats(productId) {

  const [stats] = await Review.aggregate([
    { $match: { productId: String(productId), status: "approved" } },
    {
      $group: {
        _id: null,
        average: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    average: stats ? Math.round(stats.average * 10) / 10 : 0,
    count: stats ? stats.count : 0,
  };

}

/* Copies the real numbers onto the product, which is what the shop
   cards and the top of the product page display. Run after any
   review is approved, hidden or deleted. */
export async function syncProductRating(productId) {

  const { average, count } = await getReviewStats(productId);

  await Product.updateOne(
    { _id: productId },
    { rating: average, reviews: count }
  );

}
