"use server";

import { createCart, getCart } from "@/lib/db/cart";
import primsaBase from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function incrementProductQuantity(productId: string) {
  const cart = (await getCart()) ?? (await createCart());

  const articleInCart = cart.items.find((item) => item.productId === productId);

  if (articleInCart) {
    await primsaBase.cart.update({
      where: { id: cart.id },
      data: {
        items: {
          update: {
            where: { id: articleInCart.id },
            data: { quantity: { increment: 1 } },
          },
        },
      },
    });
  } else {
    await primsaBase.cart.update({
      where: { id: cart.id },
      data: {
        items: {
          create: {
            productId,
            quantity: 1,
          },
        },
      },
    });
  }
  revalidatePath("/products/[id]");
}
