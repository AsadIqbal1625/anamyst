export function getCart() {

  if (typeof window === "undefined")
    return [];

  const cart =
    localStorage.getItem("cart");

  return cart
    ? JSON.parse(cart)
    : [];

}

/* SAVE CART */
export function saveCart(cart) {

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  /* UPDATE NAVBAR */
  window.dispatchEvent(
    new Event("cartUpdated")
  );

}

/* ADD TO CART */
export function addToCart(product) {

  const cart = getCart();

  const existing =
    cart.find(
      (item) =>
        item._id === product._id
    );

  if (existing) {

    existing.quantity += 1;

  } else {

    cart.push({
      ...product,
      quantity: 1,
    });

  }

  saveCart(cart);

}

/* REMOVE ITEM */
export function removeFromCart(id) {

  const cart = getCart();

  const updated =
    cart.filter(
      (item) => item._id !== id
    );

  saveCart(updated);

}

/* UPDATE QUANTITY */
export function updateQuantity(
  id,
  type
) {

  const cart = getCart();

  const updated =
    cart.map((item) => {

      if (item._id === id) {

        if (type === "increase") {

          item.quantity += 1;

        }

        if (
          type === "decrease" &&
          item.quantity > 1
        ) {

          item.quantity -= 1;

        }

      }

      return item;

    });

  saveCart(updated);

}

/* CLEAR CART */
export function clearCart() {

  localStorage.removeItem(
    "cart"
  );

  /* UPDATE NAVBAR */
  window.dispatchEvent(
    new Event("cartUpdated")
  );

}