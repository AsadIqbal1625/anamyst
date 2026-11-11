/* Shared by the shop page and the collection pages */

export const COLLECTIONS = [
  { label: "Perfumes", slug: "perfumes" },
  { label: "Attars", slug: "attars" },
  { label: "Fresheners", slug: "fresheners" },
  { label: "Premium Gifts", slug: "premium-gifts" },
  { label: "Combos", slug: "combos" },
];

export const GENDERS = ["All", "Men", "Women", "Unisex"];

export const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

const same = (a, b) => String(a || "").toLowerCase() === String(b || "").toLowerCase();

/* { "Perfumes": 14, "Fresheners": 3, ... } */
export function countByCollection(products) {

  const counts = {};

  for (const c of COLLECTIONS) {
    counts[c.label] = products.filter((p) => same(p.category, c.label)).length;
  }

  return counts;

}

/* Genders worth offering: only when the products actually differ */
export function gendersIn(products) {

  const present = GENDERS.filter(
    (g) => g === "All" || products.some((p) => same(p.genderCategory, g))
  );

  return present.length > 2 ? present : [];

}

export function filterAndSort(products, { category = "All", gender = "All", sort = "featured" }) {

  const list = products.filter(
    (p) =>
      (category === "All" || same(p.category, category)) &&
      (gender === "All" || same(p.genderCategory, gender))
  );

  const price = (p) => Number(p.price) || 0;

  if (sort === "price-asc") list.sort((a, b) => price(a) - price(b));
  if (sort === "price-desc") list.sort((a, b) => price(b) - price(a));
  if (sort === "newest") {
    list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  return list;

}
