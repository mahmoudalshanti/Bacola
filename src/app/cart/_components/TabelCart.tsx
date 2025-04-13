"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Minus, Plus, X } from "lucide-react";
import React, { useState, useCallback, useEffect } from "react";
import { capitalizeIfAmpersand } from "@/lib/utils";
import {
  actionDecrementQu,
  actionDeleteFromCart,
  actionIncrementQu,
} from "../_actions/actionCart";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TabelCart = ({ cart }: { cart: Cart }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [localCart, setLocalCart] = useState<Cart>(cart); // Local state for real-time updates
  // Debounce function to delay API calls
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Update local cart state when the cart prop changes
  useEffect(() => {
    setLocalCart(cart);
  }, [cart]);

  // Function to update quantity locally
  const updateLocalQuantity = (productId: string, delta: number) => {
    setLocalCart((prevCart: Cart) => {
      const updatedItems = prevCart.items.map((item: CartItem) => {
        if (item?.product?.id === productId) {
          if (item.quantity + delta <= 0)
            return { ...item, quantity: item.quantity };
          return { ...item, quantity: item.quantity + delta };
        }
        return item;
      });

      return { ...prevCart, items: updatedItems };
    });
  };

  // Debounced handlers
  const handelDeleteProduct = useCallback(
    debounce(async (id: string) => {
      try {
        setLoading(true);

        await actionDeleteFromCart(id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 500), // 500ms delay
    []
  );

  const handelIncQu = useCallback(
    debounce(async (id: string, quantity: number) => {
      try {
        setLoading(true);
        const data = await actionIncrementQu(id, quantity + 1);

        if (data?.errMsg) {
          throw new Error(data?.errMsg);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 500), // 500ms delay
    []
  );

  const handelDecQu = useCallback(
    debounce(async (id: string, quantity: number) => {
      try {
        if (quantity > 1) {
          setLoading(true);
          const data = await actionDecrementQu(id, quantity - 1);

          if (data.errMsg) {
            throw new Error(data.errMsg);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 500), // 500ms delay
    []
  );

  // Handle increment with real-time updates
  const handleIncrement = (productId: string) => {
    updateLocalQuantity(productId, 1); // Update local state immediately
    const updatedItem = localCart.items.find(
      (item: CartItem) => item?.product?.id === productId
    );
    if (updatedItem) {
      handelIncQu(productId, updatedItem.quantity); // Use the updated quantity from localCart
    }
  };

  // Handle decrement with real-time updates
  const handleDecrement = (productId: string) => {
    updateLocalQuantity(productId, -1); // Update local state immediately
    const updatedItem = localCart.items.find(
      (item: CartItem) => item?.product?.id === productId
    );
    if (updatedItem) {
      handelDecQu(productId, updatedItem.quantity); // Use the updated quantity from localCart
    }
  };

  return (
    <div className="mx-auto mt-5 relative">
      {loading && (
        <div className="absolute bg-gray-200 cursor-wait z-40 bg-opacity-30 w-full h-full left-0 top-0"></div>
      )}
      <Table className="w-full">
        <TableHeader className="sticky top-0 z-10">
          <TableRow>
            <TableHead className="text-white font-semibold">
              title image transpert
            </TableHead>
            <TableHead className="text-gray-500 font-semibold">
              Product
            </TableHead>
            <TableHead className="text-gray-500 font-semibold">Price</TableHead>
            <TableHead className="text-gray-500 font-semibold">
              Quantity
            </TableHead>
            <TableHead className="text-gray-500 font-semibold">
              Subtotal
            </TableHead>
            <TableHead className="text-gray-500 font-semibold"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localCart?.items?.length ? (
            localCart.items?.map((item: CartItem) => (
              <TableRow key={item?.id}>
                <TableCell>
                  <img
                    src={item?.product?.images[0]?.image}
                    alt="Product Image"
                    width={70}
                    height={70}
                  />
                </TableCell>

                <TableCell className="font-medium text-slate-700 whitespace-nowrap">
                  <Link
                    className="cursor-pointer hover:underline"
                    href={`/product/${item.product?.id}`}
                  >
                    {capitalizeIfAmpersand(item?.product?.name || "")}
                  </Link>
                </TableCell>
                <TableCell className="text-slate-700">
                  $
                  {item?.product?.offer
                    ? item.product.offer
                    : item?.product?.price}
                </TableCell>
                <TableCell className="text-slate-700">
                  <div className="flex items-center">
                    {/* Decrease Button */}
                    <div
                      onClick={() => handleDecrement(item?.product?.id || "")}
                      className="rounded-full bg-gray-200 w-7 h-7 flex items-center justify-center mr-2 cursor-pointer hover:bg-gray-300 transition-colors duration-200"
                    >
                      <span className="text-gray-700 text-lg font-medium">
                        <Minus className="size-3" />
                      </span>
                    </div>

                    {/* Quantity Display */}
                    <p className="text-gray-900 text-sm font-medium mx-1">
                      {item?.quantity}
                    </p>

                    {/* Increase Button */}
                    <div
                      onClick={() => handleIncrement(item?.product?.id || "")}
                      className="rounded-full bg-gray-200 w-7 h-7 flex items-center justify-center ml-2 cursor-pointer hover:bg-gray-300 transition-colors duration-200"
                    >
                      <span className="text-gray-700 text-lg font-medium">
                        <Plus className="size-3" />
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right text-slate-700">
                  <div className="flex items-center">
                    $
                    {(
                      item?.quantity *
                      (item?.product?.offer
                        ? item?.product?.offer
                        : item?.product?.price ?? 0)
                    ).toFixed(2)}
                  </div>
                </TableCell>
                <TableCell className="text-right text-slate-700 cursor-pointer">
                  <X
                    className="size-5"
                    onClick={() => handelDeleteProduct(item?.product?.id)}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500">
                No cart items found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TabelCart;
