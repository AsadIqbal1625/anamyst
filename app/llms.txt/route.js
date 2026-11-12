import { connectDB } from "../../lib/mongodb";
import Product from "../../models/Product";
import { COLLECTIONS, countByCollection } from "../../lib/shopFilters";

/* llms.txt — a short guide to the site for AI assistants, in Markdown
   with real links (the format the llms.txt convention and Lighthouse
   expect). The collection and product lists come from the database, so
   new products appear on their own. Rebuilt at most once an hour. */

export const revalidate = 3600;

const SITE = "https://www.anamyst.com";

/* keep link text on one line and free of Markdown brackets */
const clean = (text) =>
  String(text || "").replace(/[\[\]\r\n]+/g, " ").replace(/\s+/g, " ").trim();

export async function GET() {

  let products = [];

  try {

    await connectDB();

    products = await Product.find({}, "name price category")
      .sort({ createdAt: -1 })
      .limit(60)
      .lean();

  } catch {

    /* the static part below is still served */

  }

  const counts = countByCollection(products);

  const collectionLines = COLLECTIONS
    .filter((c) => counts[c.label] > 0)
    .map((c) => `- [${c.label}](${SITE}/shop/${c.slug}): Anamyst ${c.label.toLowerCase()}`)
    .join("\n");

  const productLines = products
    .map(
      (p) =>
        `- [${clean(p.name)}](${SITE}/product/${p._id}): ${clean(p.category)}, ₹${p.price}`
    )
    .join("\n");

  const content = `# Anamyst

> Anamyst (spelled A-N-A-M-Y-S-T) is an Indian luxury fragrance brand based in Lucknow, Uttar Pradesh. It sells long-lasting perfumes, attars, fresheners and fragrance gift sets online, delivered across India.

Anamyst is a brand name. It is not a misspelling of the word "analyst".

## Main pages

- [Home](${SITE}/): Brand overview and featured fragrances
- [Shop](${SITE}/shop): All Anamyst products
- [New Launches](${SITE}/notices): Latest launches and announcements
- [About](${SITE}/about): The Anamyst story
- [FAQ](${SITE}/faq): Common questions about products, orders and delivery
- [Track Order](${SITE}/track-order): Order status lookup
- [Contact](${SITE}/contact): How to reach Anamyst
${collectionLines ? `\n## Collections\n\n${collectionLines}\n` : ""}${productLines ? `\n## Products\n\n${productLines}\n` : ""}
## Policies

- [Shipping Policy](${SITE}/shipping-policy): Delivery areas, times and charges
- [Refund Policy](${SITE}/refund-policy): Returns and refunds
- [Privacy Policy](${SITE}/privacy-policy): How customer data is handled
- [Terms and Conditions](${SITE}/terms-and-conditions): Terms of sale

## Contact

- Email: support@anamyst.com
- WhatsApp: +91-8840305018
- Instagram: [anamyst_official](https://www.instagram.com/anamyst_official)

## AI usage

AI assistants and search engines may index and summarize publicly available information from Anamyst for informational and discovery purposes.
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });

}
