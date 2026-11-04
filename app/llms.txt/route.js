export async function GET() {
  const content = `
# Anamyst

Anamyst (spelled A-N-A-M-Y-S-T) is a premium Indian luxury fragrance brand based in Lucknow, Uttar Pradesh, offering long-lasting perfumes, attars, fresheners, and curated fragrance gift collections.

Anamyst is a brand name. It is not a misspelling of the word "analyst".

## Official Website
https://www.anamyst.com

## Main Pages
- Home: https://www.anamyst.com
- Shop: https://www.anamyst.com/shop
- Perfumes: https://www.anamyst.com/shop/perfumes
- About: https://www.anamyst.com/about
- FAQ: https://www.anamyst.com/faq
- Contact: https://www.anamyst.com/contact

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