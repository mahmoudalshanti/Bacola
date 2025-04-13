"use server";

import getUser from "@/app/_components/getUser";
import { FormData } from "../_components/Checkout";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

// ======================== Create session of checkout  ========================

/**
 * make checkout bt Stripe or Cash on delivery
 * @param formData that contain data of user for info of own order
 * @couponCode Coupon code to got discount
 * @throws Error if the operation fails
 */

export const actionCreateCheckoutSession = async (
  formData: FormData,
  couponCode: string
) => {
  try {
    const user = await getUser();
    const cart = await prisma.cart
      .findUnique({
        where: { userId: user?.id },
        include: { items: { include: { product: true } } },
      })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    // check if user send products is array and not empty
    if (!Array.isArray(cart?.items) || cart.items.length === 0)
      throw new Error("Invalid type or no products");

    let totalAmount = 0;

    // declare lineItems array to store the products for stripe line items {price_data :{currency , product_data :{name , images} , unit_amount}, quantity}
    const lineItems = cart.items.map((item) => {
      totalAmount +=
        parseFloat(
          (
            item.quantity *
            (item?.product?.offer ? item?.product?.offer : item?.product?.price)
          ).toFixed(2)
        ) || 1;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name, // show product name in stripe checkout page
            images:
              Array.isArray(item?.product?.images) &&
              (item.product.images[0] as { image: string })?.image
                ? [(item.product.images[0] as { image: string }).image]
                : [], // show product image in stripe checkout page
          },
          unit_amount: item?.product?.offer
            ? Math.round(item?.product?.offer * 100)
            : Math.round(item?.product?.price * 100),
        },
        quantity: item.quantity || 1,
      };
    });
    let coupon = null;
    if (couponCode) {
      coupon = await prisma.coupon
        .findUnique({
          where: {
            code: couponCode,
            isActive: true,
            userId: user?.id,
            expirationDate: { gt: new Date() },
          },
        })
        .catch((err) => {
          throw new Error("Server not responding");
        });

      if (coupon) {
        totalAmount -= parseFloat(
          (totalAmount * (coupon.discountPercentage / 100)).toFixed(2)
        );

        // here not deactivate coupon because we need to check if user paid or not
      }
    }

    const headerList = headers();
    const origin =
      (await headerList).get("origin") ||
      (await headerList).get("referer") ||
      "";

    switch (formData.payment) {
      case "stripe": {
        const session = await stripe.checkout.sessions
          .create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${origin}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/purchase-cancel`,
            discounts: coupon // add coupon  in discount stripe to show in stripe checkout page and dashboard features
              ? [
                  {
                    coupon: await createStripeCoupon(coupon.discountPercentage),
                  },
                ]
              : [],

            metadata: {
              // we use metadata in order
              userId: user?.id ?? "",
              comment: formData.orderNotes,
              couponCode: couponCode,
              formData: JSON.stringify(formData),
              products: JSON.stringify(
                cart.items.map((item) => ({
                  id: item.product.id,
                  quantity: item.quantity,
                  price: item.totalPrice,
                  name: item.product.name,
                }))
              ),
            },
          })
          .catch((err) => {
            throw new Error("Server not responding");
          });

        return { id: session.id, totalAmount: totalAmount / 100 };
      }

      case "cash": {
        const sessionId = generateOrderNumber();
        const session = `/purchase-success?session_id_cash=${sessionId}`;

        const newOrder = await prisma.order
          .create({
            data: {
              userId: user ? user?.id : "", // Ensure userId is a valid string
              totalAmount: totalAmount ?? 0,
              comment: formData.orderNotes,
              sessionId: sessionId,
              method: "cash",
              city: formData.city,
              country: formData.country,
              street: formData.street,
              zipCode: formData.zipCode,
              track: generateOrderNumber(), // Ensure this function is defined
              status: "PENDING",
              items: {
                create: cart.items.map((item) => ({
                  productId: item?.product.id,
                  quantity: item.quantity,
                  price: item.totalPrice,
                })),
              },
            },
          })
          .catch((err) => {
            throw new Error("Server not responding");
          });

        if (coupon?.code)
          await prisma.coupon
            .update({
              where: {
                userId: user?.id,
                code: coupon?.code,
              },
              data: {
                isActive: false,
              },
            })
            .catch((err) => {
              throw new Error("Server not responding");
            })
            .catch((err) => {
              throw new Error("Server not responding");
            });

        await prisma.cart
          .delete({ where: { userId: user?.id } })
          .catch((err) => {
            throw new Error("Server not responding");
          })
          .catch((err) => {
            throw new Error("Server not responding");
          });

        return {
          success: true,
          redirect: session,
          totalAmount: totalAmount / 100,
          userId: user?.id ?? "",
          street: newOrder.street,
          zipCode: newOrder.zipCode,
          country: newOrder.country,
          city: newOrder.city,
          products: JSON.stringify(
            cart.items.map((item) => ({
              id: item.product.id,
              quantity: item.quantity,
              price: item.totalPrice,
              name: item.product.name,
            }))
          ),
        };
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return { errMsg: message };
  }
};

// ======================== Create checkout Success  ========================

/**
 * revalidate to success page if session paid done
 * @throws Error if the operation fails
 */
export const actionCheckoutSuccess = async () => {
  try {
    const headersList = await headers();
    const url = headersList.get("referer");

    if (!url) {
      throw new Error("Referer header not found.");
    }

    const urlObj = new URL(url);
    const sessionId = urlObj.searchParams.get("session_id");
    const sessionId_cash = urlObj.searchParams.get("session_id_cash");
    if (!sessionId && !sessionId_cash) {
      throw new Error("Session ID is required.");
    }

    const user = await getUser();

    if (sessionId) {
      const session = await stripe.checkout.sessions
        .retrieve(sessionId)
        .catch((err) => {
          throw new Error("Server not responding");
        });

      const userId = session.metadata?.userId;
      if (!userId) {
        throw new Error("User ID is required.");
      }

      if (user?.id !== userId) throw new Error("Forbbiden, invalid user");
      // Parse products metadata
      let products = [];
      try {
        products = JSON.parse(session.metadata?.products ?? "[]");
      } catch (err) {
        throw new Error("Invalid product metadata");
      }

      // Check if the order already exists based on stripeSessionId
      const existingOrder = await prisma.order
        .findUnique({
          where: { sessionId: sessionId, userId: user.id },
        })
        .catch((err) => {
          throw new Error("Server not responding");
        });

      const formData = JSON.parse(
        session?.metadata?.formData as string
      ) as FormData;

      if (existingOrder) {
        return {
          success: true,
          message:
            "Payment successful, order created, and coupon deactivated if used.",
          orderId: existingOrder.id,
          track: existingOrder.track,
          createdAt: existingOrder.createdAt,
          email: user?.email,
          city: existingOrder.city,
          country: existingOrder.country,
          street: existingOrder.street,
          zipCode: existingOrder.zipCode,
          total: existingOrder.totalAmount,
          items: products.map(
            (product: {
              id: string;
              quantity: number;
              price: number;
              name: string;
            }) => ({
              productId: product.id,
              quantity: product.quantity,
              price: product.price,
              name: product.name,
            })
          ),
        };
      }

      // Ensure userId is defined

      const newOrder = await prisma.order
        .create({
          data: {
            userId: userId, // Ensure userId is a valid string
            totalAmount: (session.amount_total ?? 0) / 100,
            sessionId: sessionId,
            method: "stripe",
            comment: session?.metadata?.comment as string,
            track: generateOrderNumber(), // Ensure this function is defined
            status: "PENDING",
            city: formData.city,
            country: formData.country,
            street: formData.street,
            zipCode: formData.zipCode,
            items: {
              create: products.map(
                (product: { id: string; quantity: number; price: number }) => ({
                  productId: product.id,
                  quantity: product.quantity,
                  price: product.price,
                })
              ),
            },
          },
        })
        .catch((err) => {
          throw new Error("Server not responding");
        });

      if (session?.metadata?.couponCode)
        await prisma.coupon
          .update({
            where: {
              userId: user.id,
              code: session?.metadata?.couponCode,
            },
            data: {
              isActive: false,
            },
          })
          .catch((err) => {
            throw new Error("Server not responding");
          });

      await prisma.cart.delete({ where: { userId: user?.id } }).catch((err) => {
        throw new Error("Server not responding");
      });

      return {
        success: true,
        message:
          "Payment successful, order created, and coupon deactivated if used.",
        orderId: newOrder.id,
        track: newOrder.track,
        createdAt: newOrder.createdAt,
        email: user?.email,
        street: newOrder.street,
        zipCode: newOrder.zipCode,
        country: newOrder.country,
        city: newOrder.city,
        total: newOrder.totalAmount,
        items: products.map(
          (product: {
            id: string;
            quantity: number;
            price: number;
            name: string;
          }) => ({
            productId: product.id,
            quantity: product.quantity,
            price: product.price,
            name: product.name,
          })
        ),
      };
    }

    if (sessionId_cash) {
      const findOrder = await prisma.order
        .findUnique({
          where: { sessionId: sessionId_cash, userId: user?.id },
          include: { items: { include: { product: true } } },
        })
        .catch((err) => {
          throw new Error("Server not responding");
        });
      if (!findOrder) throw new Error("No order found");

      return {
        success: true,
        message:
          "Payment successful, order created, and coupon deactivated if used.",
        orderId: findOrder?.id,
        track: findOrder?.track,
        createdAt: findOrder?.createdAt,
        street: findOrder?.street,
        zipCode: findOrder?.zipCode,
        country: findOrder?.country,
        city: findOrder?.city,
        email: user?.email,
        total: findOrder?.totalAmount,
        items: findOrder?.items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.price,
          name: item.product.name,
        })),
      };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return { errMsg: message };
  }
};

function generateOrderNumber() {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${randomNum}`;
}

async function createStripeCoupon(discountPercentage: number) {
  const coupon = await stripe.coupons
    .create({
      percent_off: discountPercentage,
      duration: "once",
    })
    .catch((err) => {
      throw new Error("Server not responding");
    });

  return coupon.id;
}
