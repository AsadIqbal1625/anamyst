export function getCart() {

  if (typeof window === "undefined") {
    return [];
  }

  return JSON.parse(
    localStorage.getItem("cart") || "[]"
  );
}

export function saveCart(cart) {

  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );
}

export function addToCart(product) {

  const cart = getCart();

  const existing = cart.find(
    (item) => item.id === product.id
  );

  if (existing) {

    existing.qty += 1;

  } else {

    cart.push({
      ...product,
      qty: 1,
    });

  }

  saveCart(cart);
}

export function updateQty(id, change) {

  let cart = getCart();

  cart = cart.map((item) => {

    if (item.id === id) {

      return {
        ...item,
        qty: item.qty + change,
      };

    }

    return item;
  });

  cart = cart.filter((item) => item.qty > 0);

  saveCart(cart);
}

export function removeItem(id) {

  let cart = getCart();

  cart = cart.filter(
    (item) => item.id !== id
  );

  saveCart(cart);
}