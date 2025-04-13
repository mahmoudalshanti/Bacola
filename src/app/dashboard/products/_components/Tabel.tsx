"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash, View } from "lucide-react";
import { useState } from "react";
import { actionDeleteProduct } from "../../_actions/actionDashboard";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";
import { DrawerDialog } from "@/components/Drawer";
import ViewProduct from "./ViewProduct";
import StarRating from "@/components/RatingStars";

function Tabel({
  headerColor,
  products,
  caption,
  notFound,
}: {
  headerColor: string;
  products: Product[];
  caption: string;
  notFound: string;
}) {
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");
  const [openError, setOpenError] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [openView, setOpenView] = useState<boolean>(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  const handleDeleteProduct = async (id: string) => {
    try {
      setLoadingDelete(true);
      const data = await actionDeleteProduct(id);
      setErrMsg("");
      setOpenConfirmDelete(false);

      if (data && "errMsg" in data) {
        if (data.errMsg) throw new Error(data.errMsg);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong!";
      setErrMsg(message);
      setOpenError(true);
      setOpenConfirmDelete(false);
      console.error("Something went wrong!", err);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <>
      {/* Error Message Dialog */}
      {errMsg && (
        <DrawerDialog
          content={
            <div>
              <p className="text-red-600">{errMsg}</p>
            </div>
          }
          open={openError}
          setOpen={setOpenError}
        />
      )}

      <div className="max-h-80 overflow-y-auto w-full rounded-md p-2">
        {/* Caption and product count */}
        <p className="text-slate-700 font-semibold mb-1">{caption}</p>
        <p className="text-sm text-muted-foreground mb-3 text-end">
          {products.length} product(s) found
        </p>

        {/* Product Table */}
        <Table className="w-full">
          <TableHeader className="sticky top-0 z-10">
            <TableRow className={`${headerColor}`}>
              <TableHead className="w-[100px] text-gray-200">Name</TableHead>
              <TableHead className="text-gray-200">Category</TableHead>
              <TableHead className="text-gray-200">Price</TableHead>
              <TableHead className="text-gray-200">Offer</TableHead>
              <TableHead className="text-right text-gray-200">Rate</TableHead>
              <TableHead className="text-right text-gray-200">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Render products or "not found" message */}
            {products.length ? (
              products.map((product: Product, i: number) => (
                <TableRow className="bg-gray-200 hover:bg-gray-300" key={i}>
                  <TableCell className="font-medium text-slate-700 flex items-center">
                    <div className="w-10 h-10 mr-2">
                      {/* Display product image */}
                      {
                        <img
                          className="object-cover w-full h-full"
                          src={
                            product?.images?.find(
                              (image: { type: string; image: string }) =>
                                image?.type === "default"
                            )?.image
                          }
                        />
                      }
                    </div>
                    {product?.name}
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {product?.category?.name}
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {product?.price}$
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {product?.offer}$
                  </TableCell>
                  <TableCell className="text-right text-slate-700">
                    <StarRating rate={product?.rate} size={4} />
                  </TableCell>
                  <TableCell className="text-right text-slate-700">
                    {/* Action buttons: Delete and View */}
                    <div className="flex items-center">
                      <Trash
                        className="text-red-600 size-4 mr-2"
                        onClick={() => {
                          setDeleteProduct(product);
                          setOpenConfirmDelete(true);
                        }}
                      />
                      <View
                        className="text-blue-600 size-4"
                        onClick={() => {
                          setViewProduct(product);
                          setOpenView(true);
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  {notFound}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* View Product Drawer */}
        <DrawerDialog
          content={
            viewProduct && (
              <ViewProduct
                product={viewProduct}
                setViewProduct={setViewProduct}
                setOpenView={setOpenView}
              />
            )
          }
          open={openView}
          setOpen={setOpenView}
        />

        {/* Confirm Delete Drawer */}
        <DrawerDialog
          content={
            <div className="p-5 flex items-center">
              <div className="w-full">
                <p className="text-slate-800 font-semibold mb-2">
                  Are you sure you want to delete "{deleteProduct?.name}"?
                </p>
                <Button
                  disabled={loadingDelete}
                  className="w-full bg-red-700 hover:bg-red-600"
                  onClick={() =>
                    deleteProduct && handleDeleteProduct(deleteProduct.id)
                  }
                >
                  {loadingDelete ? <Loading /> : "Delete"}
                </Button>
              </div>
            </div>
          }
          open={openConfirmDelete}
          setOpen={setOpenConfirmDelete}
        />
      </div>
    </>
  );
}

export default Tabel;
