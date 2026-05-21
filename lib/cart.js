/* GET CART */

export function getCart() {

  if (typeof window === "undefined") {

    return [];

  }

  try {

    const cart =
      localStorage.getItem("cart");

    if (!cart) return [];

    const parsed = JSON.parse(cart);

    return Array.isArray(parsed)
      ? parsed
      : [];

  } catch (error) {

    console.error(
      "Cart Parse Error:",
      error
    );

    return [];

  }

}

/* SAVE CART */

export function saveCart(cart) {

  if (typeof window === "undefined")
    return;

  try {

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

    /* UPDATE NAVBAR + CART */

    window.dispatchEvent(
      new Event("cartUpdated")
    );

  } catch (error) {

    console.error(
      "Cart Save Error:",
      error
    );

  }

}

/* ADD TO CART */

export function addToCart(product) {

  if (!product) return;

  const cart = getCart();

  const existing =
    cart.find(
      (item) =>
        item._id === product._id
    );

  if (existing) {

    existing.quantity =
      Number(existing.quantity || 1) + 1;

  } else {

    cart.push({

      ...product,

      price:
        Number(product.price) || 0,

      oldPrice:
        Number(product.oldPrice) || 0,

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
      (item) =>
        item._id !== id
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

        let quantity =
          Number(item.quantity) || 1;

        if (type === "increase") {

          quantity += 1;

        }

        if (
          type === "decrease" &&
          quantity > 1
        ) {

          quantity -= 1;

        }

        return {

          ...item,

          quantity,

        };

      }

      return item;

    });

  saveCart(updated);

}

/* CLEAR CART */

export function clearCart() {

  if (typeof window === "undefined")
    return;

  localStorage.removeItem("cart");

  /* UPDATE NAVBAR */

  window.dispatchEvent(
    new Event("cartUpdated")
  );

}

/* GET TOTAL */

export function getCartTotal() {

  const cart = getCart();

  return cart.reduce(
    (total, item) => {

      const price =
        Number(item.price) || 0;

      const quantity =
        Number(item.quantity) || 1;

      return (
        total +
        price * quantity
      );

    },
    0
  );

}