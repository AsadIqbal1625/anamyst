This is actually a very good audit, and I'd say 90% of it is correct. The good news is that most of the issues are not difficult to fix because you're already using Next.js.

My assessment
Issue	Severity	Agree?	Priority
Products rendered client-side only	🔴 Critical	✅ Yes	#1
Same title/meta on every page	🔴 Critical	✅ Yes	#2
Empty robots.txt / sitemap.xml	🔴 Critical	✅ Yes	#3
Missing Product JSON-LD	🟠 High	✅ Yes	#4
Missing Open Graph tags	🟠 High	✅ Yes	#5
No llms.txt	🟡 Medium	✅ Yes	#6
Duplicate H1	🟡 Medium	✅ Yes	Later
Hero MP4 optimization	🟡 Medium	✅ Yes	Later
meta keywords obsolete	🟢 Low	✅ Yes	Ignore for now
Two different phone numbers	🟠 High	✅ Fix immediately if accidental	Quick fix
The BIG problem: Products invisible to AI crawlers

This is exactly what I've been trying to steer ANAMYST toward.

Your current product page starts with:

"use client";

and fetches data using:

useEffect(() => {
  fetch(`/api/products/${params.id}`)
}, []);

That means the initial HTML contains essentially:

<div>Loading...</div>

GPTBot, ClaudeBot, PerplexityBot, and many SEO crawlers never execute your JavaScript. They simply read the HTML and leave.

So they see:

No product name.
No price.
No fragrance notes.
No description.
No availability.

From an AI perspective, your shop is almost empty.

What should ANAMYST do first?
Phase 1 (This week)
1. Add proper metadata (Easy)

Use Next.js Metadata API.

Every product page should have:

Title:
Royal Oud | Luxury Perfume for Men | ANAMYST

Description:
Discover Royal Oud by ANAMYST. Premium long-lasting oud fragrance with citrus top notes, woody heart, and luxury presentation.

This is about 1-2 hours of work.

2. Create robots.txt

Allow:

Googlebot
GPTBot
ClaudeBot
Claude-Web
PerplexityBot
Google-Extended

and point to sitemap.

30 minutes.

3. Create sitemap.xml

Automatically include:

Home
About
Shop
Collections
Product pages

1 hour.

4. Create llms.txt

Simple markdown-style file describing:

ANAMYST brand
Collections
Product categories
Main URLs

30 minutes.

5. Add Product JSON-LD

Every product page should expose:

Name
Image
Description
Price
Availability
Brand
SKU (optional)

This is huge for Google and LLMs.

Phase 2 (Most Important)
Convert Product Pages to Server Rendering

Right now you have:

Client Component
    ↓
Loading...
    ↓
Fetch API
    ↓
Render product

You want:

Server Component
    ↓
Fetch product on server
    ↓
Send fully rendered HTML
    ↓
Hydrate buttons only

This is probably the single highest ROI upgrade you can make for ANAMYST.

It will improve:

Google SEO.
LLM SEO.
Social previews.
Page speed.
Core Web Vitals.
About the hero video

The audit is right.

Use:

<video
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
  poster="/images/hero-poster.jpg"
>

preload="metadata" prevents downloading the whole MP4 before page interaction.

Duplicate H1

If your mobile menu contains:

<h1>ANAMYST</h1>

change it to:

<div className="text-2xl font-bold">
  ANAMYST
</div>

Only one <h1> per page.

Phone numbers

This is actually more important than people realize.

You mentioned:

Footer: 8957851141
WhatsApp: 8840305018

If one of these is old, update it immediately. Google Business Profile, website, schema, WhatsApp, Instagram, and footer should all match.

My priority roadmap for ANAMYST
🔥 Week 1
Robots.txt
Sitemap.xml
llms.txt
Fix metadata
Fix phone number consistency
🔥 Week 2
Product JSON-LD
Organization JSON-LD
Open Graph tags
🚀 Week 3
Convert product pages to SSR.
Convert /shop and /shop/perfumes to server-rendered pages.
One important correction

The audit says:

"No sitemap.xml and no robots.txt."

I would verify this manually because sometimes Next.js App Router generates them dynamically, and certain crawlers fail to detect them correctly. But if yours are actually empty, then yes, they should be fixed immediately.

My recommendation

Do not redesign the UI anymore for now.

Your product page is already good enough to sell. The audit identified a much bigger problem: AI and search engines cannot actually see your products.

If you fix only one thing this month, make it:

Server-rendered product and collection pages with proper metadata and JSON-LD.

That single architectural change will have a bigger impact on ANAMYST's future growth than another week of adjusting image sizes or spacing.