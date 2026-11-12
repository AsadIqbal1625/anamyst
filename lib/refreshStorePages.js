import { revalidatePath } from "next/cache";

/* Store pages are kept ready for up to 60 seconds instead of being
   rebuilt for every visitor. After the owner changes a product or a
   review, refresh the affected pages so the change shows on the next
   visit rather than up to a minute later. */

export function refreshStorePages(productId) {

  try {

    revalidatePath("/");
    revalidatePath("/shop", "layout");

    if (productId) revalidatePath(`/product/${productId}`);
    else revalidatePath("/product/[id]", "page");

  } catch (error) {

    /* never fail the admin action because a refresh could not be queued */
    console.error("page refresh failed:", error);

  }

}
