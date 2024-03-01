"use server";
import primsaBase from "@/lib/db/prisma";
import { createCart, getCart } from "@/lib/db/cart";
import { revalidatePath } from "next/cache";

export async function setProductQuantity(productId: string, quantity: number) {
  const cart = (await getCart()) ?? (await createCart());

  const articleInCart = cart.items.find((item) => item.productId === productId);

  if (quantity === 0) {
    if (articleInCart) {
      await primsaBase.cart.update({
        where: { id: cart.id },
        data: {
          items: {
            delete: { id: articleInCart.id },
          },
        },
      });
    }
  } else {
    if (articleInCart) {
      await primsaBase.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          items: {
            update: {
              where: { id: articleInCart.id },
              data: { quantity },
            },
          },
        },
      });
    } else {
      await primsaBase.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          items: {
            create: {
              productId,
              quantity,
            },
          },
        },
      });
    }
  }
  revalidatePath("/cart");
}
