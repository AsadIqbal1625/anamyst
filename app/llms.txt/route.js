export async function GET() {
  const content = `
# ANAMYST

ANAMYST is a premium Indian luxury fragrance brand offering long-lasting perfumes, attars, fresheners, and curated fragrance gift collections.

## Official Website
https://anamyst.com

## Main Pages
- Home: https://anamyst.com
- Shop: https://anamyst.com/shop
- Perfumes: https://anamyst.com/shop/perfumes
- About: https://anamyst.com/about
- FAQ: https://anamyst.com/faq
- Contact: https://anamyst.com/contact

## Products
ANAMYST offers:
- Luxury Perfumes
- Premium Attars
- Home & Car Fresheners
- Premium Gift Collections
- Men's Fragrances
- Women's Fragrances
- Unisex Fragrances

## Contact
Email: support@anamyst.com
WhatsApp: +91-8840305018

## AI Usage
AI assistants and search engines may index and summarize publicly available information from ANAMYST for informational and discovery purposes.
`.trim();

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}