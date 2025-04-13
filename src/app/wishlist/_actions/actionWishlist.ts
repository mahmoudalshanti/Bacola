"use server";

import getUser from "@/app/_components/getUser";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ======================== Add to wishlist ========================

/**
 * add product to whishlist to spacific user
 * @param prodId -  product id param
 * @throws Error if the operation fails
 */
export const actionAddToWishlist = async (prodId: string) => {
  try {
    const user = await getUser();
    if (!user) return;

    const findProduct = await prisma.product
      .findUnique({
        where: { id: prodId },
      })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    if (!findProduct) throw new Error("No product found");

    let userWithWishlist = await prisma.user
      .findUnique({
        where: { id: user.id },
        include: { Wishlist: { include: { items: true } } },
      })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    if (!userWithWishlist) throw new Error("User not found");

    if (!userWithWishlist.Wishlist) {
      userWithWishlist = await prisma.user
        .update({
          where: { id: user.id },
          data: {
            Wishlist: {
              create: {},
            },
          },
          include: { Wishlist: { include: { items: true } } },
        })
        .catch((err) => {
          throw new Error("Server not responding");
        });
    }

    const wishlist = userWithWishlist.Wishlist;
    if (!wishlist) throw new Error("Wishlist not found");

    const existingWishlistItem = wishlist.items.find(
      (item) => item.productId === prodId
    );

    if (existingWishlistItem)
      throw new Error("Product already exists in wishlist");
    else {
      await prisma.wishlistItem
        .create({
          data: {
            wishlistId: wishlist.id,
            productId: findProduct.id,
          },
        })
        .catch((err) => {
          throw new Error("Server not responding");
        });
    }

    revalidatePath("/");
    return { success: true, message: "Product added to wishlist" };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong!";
    return { errMsg: message };
  }
};

// ======================== Delete product to wishlist ========================

/**
 * delete product to whishlist to spacific user
 * @param prodId -  product id param
 * @throws Error if the operation fails
 */
export const actionDeleteFromWishlist = async (prodId: string) => {
  try {
    const user = await getUser();
    if (!user) return;

    const wishlist = await prisma.wishlist
      .findFirst({
        where: { userId: user.id },
        include: { items: true },
      })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    if (!wishlist) throw new Error("Wishlist not found");

    const existingWishlistItem = wishlist.items.find(
      (item) => item.productId === prodId
    );

    if (!existingWishlistItem) throw new Error("Product not found in wishlist");

    await prisma.wishlistItem
      .delete({
        where: { id: existingWishlistItem.id },
      })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    revalidatePath("/");
    return { success: true, message: "Product removed from wishlist" };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong!";
    return { errMsg: message };
  }
};

// ======================== Get products to wishlist ========================

/**
 * @throws Error if the operation fails
 */
export const actionGetWishlist = async () => {
  try {
    const user = await getUser();

    // Fetch the user's wishlist
    const wishlist = await prisma.wishlist
      .findFirst({
        where: { userId: user?.id || "" },
        include: { items: { include: { product: true } } },
      })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    if (!wishlist) {
      return []; // Return empty array if wishlist doesn't exist.
    }

    // Fetch the user's cart
    const cartUser = await prisma.cart
      .findMany({
        where: { userId: user?.id || "" },
        include: { items: true },
      })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    // Extract product IDs and quantities from the user's cart
    const cartProducts = cartUser.flatMap((cart) =>
      cart.items.map((item) => ({
        id: item.productId,
        quantity: item.quantity,
      }))
    );

    // Fetch all products included in the wishlist and add inCart and inWishlist properties
    const productsWithInCartAndWishlist = wishlist.items.map((item) => {
      const product = item.product;
      const cartItem = cartProducts.find(
        (cartItem) => cartItem.id === product.id
      );
      return {
        ...product,
        inWishlist: true,
        inCart: !!cartItem,
        quantity: cartItem?.quantity || 0,
      };
    });

    return productsWithInCartAndWishlist;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong!";
    return { errMsg: message };
  }
};

// ======================== Add many porducts to wishlist ========================

/**
 * save many products to wishlist
 * @param productIds - array of product ids
 * @throws Error if the operation fails
 */

export const actionAddManyToCartFromWishlist = async (productIds: string[]) => {
  try {
    const user = await getUser();
    if (!user) return;

    const cart = await prisma.cart
      .findFirst({
        where: { userId: user.id },
        include: { items: true },
      })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    if (cart) {
      for (const prodId of productIds) {
        const product = await prisma.product
          .findUnique({
            where: { id: prodId },
          })
          .catch((err) => {
            throw new Error("Server not responding");
          });

        if (!product) throw new Error(`Product with ID ${prodId} not found`);

        const existingCartItem = cart.items.find(
          (item) => item.productId === prodId
        );

        if (existingCartItem) {
          await prisma.cartItem
            .update({
              where: { id: existingCartItem.id },
              data: { quantity: existingCartItem.quantity + 1 },
            })
            .catch((err) => {
              throw new Error("Server not responding");
            });
        } else {
          await prisma.cartItem
            .create({
              data: {
                cartId: cart.id,
                productId: product.id,
                quantity: 1,
                totalPrice: product.offer ? product.offer : product.price,
              },
            })
            .catch((err) => {
              throw new Error("Server not responding");
            });
        }
      }

      revalidatePath("/");
      return { success: true, message: "Products added to cart" };
    } else {
      const newCart = await prisma.cart.create({
        data: {
          userId: user.id,
        },
        include: { items: true },
      });

      for (const prodId of productIds) {
        const product = await prisma.product
          .findUnique({
            where: { id: prodId },
          })
          .catch((err) => {
            throw new Error("Server not responding");
          });

        if (!product) throw new Error(`Product with ID ${prodId} not found`);

        const existingCartItem = newCart.items.find(
          (item) => item.productId === prodId
        );

        if (existingCartItem) {
          await prisma.cartItem
            .update({
              where: { id: existingCartItem.id },
              data: { quantity: existingCartItem.quantity + 1 },
            })
            .catch((err) => {
              throw new Error("Server not responding");
            });
        } else {
          await prisma.cartItem
            .create({
              data: {
                cartId: newCart.id,
                productId: product.id,
                quantity: 1,
                totalPrice: product.offer ? product.offer : product.price,
              },
            })
            .catch((err) => {
              throw new Error("Server not responding");
            });
        }
      }

      revalidatePath("/");
      return { success: true, message: "Products added to cart" };
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong!";
    return { errMsg: message };
  }
};
