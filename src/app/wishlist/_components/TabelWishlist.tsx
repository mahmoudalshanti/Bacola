"use client";
import getUser from "@/app/_components/getUser";
import {
  actionAddToCart,
  actionDeleteFromCart,
} from "@/app/cart/_actions/actionCart";
import { ToastAddCartSuccess, ToastFaild } from "@/components/Toasts";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { capitalizeIfAmpersand, formatDate } from "@/lib/utils";
import { X } from "lucide-react";
import React, { useState } from "react";
import {
  actionAddManyToCartFromWishlist,
  actionDeleteFromWishlist,
} from "../_actions/actionWishlist";
import Link from "next/link";

const TabelWishlist = ({ wishlist }: { wishlist: Wishlist[] }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const handelAddtoCart = async (id: string, name: string) => {
    try {
      const user = await getUser();
      if (user?.id) {
        setLoading(true);
        const data = await actionAddToCart(id);
        ToastAddCartSuccess(`1x ${capitalizeIfAmpersand(name)}`);
        if (data?.errMsg) throw new Error(data.errMsg);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong!";
      ToastFaild(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
    setSelectAll(selectedItems.length === wishlist.length - 1);
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allIds = wishlist.map((item: any) => item.id);
      setSelectedItems(allIds);
    } else {
      setSelectedItems([]);
    }
  };

  const handelDeleteProduct = async (id: string) => {
    try {
      setLoading(true);
      const data = await actionDeleteFromWishlist(id);
      if (data?.errMsg) throw new Error(data.errMsg);
    } catch (err) {
      console.error("Something went Error!", err);
    } finally {
      setLoading(false);
    }
  };
  const handleAddSelectedToCart = async () => {
    try {
      setLoading(true);
      const data = await actionAddManyToCartFromWishlist(selectedItems);
      ToastAddCartSuccess("Selected items added to cart.");
      setSelectedItems([]);
      setSelectAll(false);

      if (data?.errMsg) throw new Error(data.errMsg);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong!";
      ToastFaild(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-8 border relative ">
      {loading && (
        <div className="absolute bg-gray-200 cursor-wait z-40 bg-opacity-30 w-full h-full left-0 top-0"></div>
      )}
      <Table className="w-full">
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="">
            <TableHead className="text-white font-semibold ">
              <Checkbox
                checked={selectAll}
                onCheckedChange={handleSelectAllChange}
              />
            </TableHead>
            <TableHead className="text-white font-semibold border-l ">
              X
            </TableHead>
            <TableHead className="text-white font-semibold border-l ">
              Product image
            </TableHead>
            <TableHead className="text-gray-500 font-semibold border-l ">
              Product Name
            </TableHead>
            <TableHead className="text-gray-500 font-semibold border-l">
              Unit Price
            </TableHead>
            <TableHead className="text-gray-500 font-semibold border-l ">
              Date Added
            </TableHead>
            <TableHead className="text-gray-500 font-semibold border-l"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wishlist?.length ? (
            wishlist?.map((item: any) => (
              <TableRow className="border" key={item.id}>
                <TableCell className=" border border-l-transparent">
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => handleCheckboxChange(item.id)}
                  />
                </TableCell>
                <TableCell className="border">
                  <X
                    className="cursor-pointer"
                    onClick={() => handelDeleteProduct(item.id)}
                  />
                </TableCell>
                <TableCell className="font-medium text-slate-700 whitespace-nowrap border">
                  <img
                    src={item.images[0]?.image}
                    alt="Product Image"
                    width={70}
                    height={70}
                  />
                </TableCell>
                <TableCell className="text-slate-900 border text-base whitespace-nowrap">
                  <Link
                    href={`/product/${item.id}`}
                    className="hover:underline"
                  >
                    {capitalizeIfAmpersand(item.name)}
                  </Link>
                </TableCell>
                <TableCell className="text-slate-700 border">
                  <div className="flex">
                    {item?.offer ? (
                      <p className="line-through text-slate-600 text-base mr-2">
                        ${item.price}
                      </p>
                    ) : (
                      ""
                    )}
                    <p className="underline text-slate-600 text-base">
                      ${item?.offer ? item?.offer : item?.price}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-right text-slate-900 text-base border whitespace-nowrap">
                  <div className="flex items-center">
                    {formatDate(item.createdAt)}
                  </div>
                </TableCell>
                <TableCell className="text-center text-slate-700 cursor-pointer border border-r-transparent">
                  <Button
                    disabled={item.inCart}
                    onClick={() => handelAddtoCart(item.id, item.name)}
                    className="bg-blue-900 hover:bg-blue-900"
                  >
                    {item.inCart ? "In Cart" : " Add to Cart"}
                  </Button>
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
      <div className="flex justify-end  p-4">
        <Button
          className="bg-blue-900 hover:bg-blue-900 mr-2"
          onClick={handleAddSelectedToCart}
          disabled={loading || selectedItems.length === 0}
        >
          Add Selected to Cart
        </Button>
      </div>
    </div>
  );
};

export default TabelWishlist;
