"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { SparklesIcon, StarIcon, TagIcon, Trash, View } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  actionDeleteProduct,
  actionPageNextProducts,
  actionPagePrevProducts,
} from "../../_actions/actionDashboard";
import Loading from "@/components/Loading";
import { DrawerDialog } from "@/components/Drawer";
import ViewProduct from "./ViewProduct";
import { Badge } from "@/components/ui/badge";
import StarRating from "@/components/RatingStars";
import { capitalizeIfAmpersand } from "@/lib/utils";

function AllProducts({
  pagesServer,
  countServer,
  products,
  page,
}: {
  pagesServer: number;
  countServer: number;
  products: Product[];
  page: number;
}) {
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");
  const [openError, setOpenError] = useState<boolean>(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
  const [openView, setOpenView] = useState<boolean>(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  // Handle product deletion
  const handleDeleteProduct = async (id: string) => {
    try {
      setLoadingDelete(true);
      const data = await actionDeleteProduct(id);
      setErrMsg("");
      setOpenConfirmDelete(false);
      if (data && "errMsg" in data) throw new Error(data.errMsg);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong!";
      setErrMsg(message);
      setOpenError(true);
      setOpenConfirmDelete(false);
      console.error("Soemthing went wrong", err);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <>
      {/* Error Dialog */}
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

      {/* Products Table */}
      <div className="mt-10 w-full">
        <p className="text-slate-800 font-semibold mb-1">
          Lists <span className="text-slate-900 font-bold">All Products</span>{" "}
        </p>
        <p className="text-slate-700 font-semibold mb-1 text-sm flex justify-end w-full">
          {countServer} Product(s) found, pages {pagesServer}
        </p>

        <div>
          <Table>
            <TableHeader>
              <TableRow className="bg-cyan-900 hover:bg-cyan-900">
                {/* Table Headers */}
                <TableHead className="w-[100px] text-white">Id</TableHead>
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Category</TableHead>
                <TableHead className="text-white">Price</TableHead>
                <TableHead className="text-white">Offer</TableHead>
                <TableHead className="text-white text-center">
                  Characteristics
                </TableHead>
                <TableHead className="text-white">Rate</TableHead>
                <TableHead className="text-white">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* If there are products, display them in the table */}
              {products?.length > 0 ? (
                products.map((product) => (
                  <TableRow
                    key={product?.id}
                    className="bg-gray-200 hover:bg-gray-300"
                  >
                    <TableCell className="font-semibold text-slate-700 ">
                      {product?.id}
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap text-slate-700 flex items-center">
                      {/* Display product image if available */}
                      <div className="w-10 h-10 mr-2">
                        {product.images?.find(
                          (image: { type: string; image: string }) =>
                            image.type === "default"
                        )?.image ? (
                          <img
                            className="object-cover w-full h-full"
                            src={
                              product.images.find(
                                (image: { type: string; image: string }) =>
                                  image.type === "default"
                              )?.image || undefined
                            }
                            alt={product?.name}
                          />
                        ) : null}
                      </div>
                      {capitalizeIfAmpersand(product?.name)}
                    </TableCell>
                    <TableCell className="text-slate-700 ">
                      {capitalizeIfAmpersand(product?.category?.name)}
                    </TableCell>

                    <TableCell className="text-slate-700 ">
                      {product?.price}$
                    </TableCell>
                    <TableCell className="text-slate-700 ">
                      {product?.offer}$
                    </TableCell>
                    <TableCell className="text-slate-700">
                      <div className="flex items-center space-x-2">
                        {product?.isFeatured ? (
                          <Badge className="bg-gray-700">
                            <StarIcon className="h-3  w-3 mr-0.5" /> Featured
                          </Badge>
                        ) : (
                          ""
                        )}
                        {product?.offer ? (
                          <Badge className="bg-emerald-900 hover:bg-emerald-900">
                            <TagIcon className="h-3  w-3 mr-0.5" /> Offer
                          </Badge>
                        ) : (
                          ""
                        )}
                        {product?.best ? (
                          <Badge className="bg-neutral-900 hover:bg-neutral-900">
                            <SparklesIcon className="h-3  w-3 mr-0.5" /> Best
                          </Badge>
                        ) : (
                          ""
                        )}
                        {!product?.isFeatured &&
                          !product?.offer &&
                          !product?.best && (
                            <Badge className="text-gray-600 bg-gray-300">
                              N/A
                            </Badge>
                          )}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-700 ">
                      <StarRating rate={product.rate} size={4} />
                    </TableCell>
                    <TableCell className="text-slate-700 cursor-pointer">
                      {/* Action buttons for view and delete */}
                      <div className="flex items-center ">
                        <Trash
                          className="text-red-600 size-4 mr-2"
                          onClick={() => {
                            setDeleteProduct(product);
                            setOpenConfirmDelete(true); // Open delete confirmation
                          }}
                        />
                        <View
                          className="text-blue-600 size-4 cursor-pointer"
                          onClick={() => {
                            setViewProduct(product);
                            setOpenView(true); // Open product view
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Component */}
        <PaginationTable pages={pagesServer} page={page} />

        {/* View Product Drawer Dialog */}
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

        {/* Confirm Delete Drawer Dialog */}
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

const PaginationTable = ({
  pages,
  page: pageNo,
}: {
  pages: number;
  page: number;
}) => {
  const [page, setPage] = useState<number>(pageNo ? pageNo : 1);
  const [loadingNext, setLoadingNext] = useState<boolean>(false);
  const [loadingPrev, setLoadingPrev] = useState<boolean>(false);

  const handlePrevPage = async () => {
    setLoadingPrev(true);
    const newPage = await actionPagePrevProducts();
    setPage(newPage);
    setLoadingPrev(false);
  };

  const handleNextPage = async () => {
    setLoadingNext(true);
    const newPage = await actionPageNextProducts();
    setPage(newPage);
    setLoadingNext(false);
  };

  return (
    <Pagination className="mt-10 mb-3">
      <PaginationContent>
        <PaginationItem>
          <Button
            onClick={handlePrevPage}
            className={`bg-gray-700 hover:bg-slate-600 ${
              page === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={page === 1 || loadingPrev}
          >
            {loadingPrev ? <Loading /> : "Previous"}
          </Button>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink className="bg-gray-700 hover:bg-gray-700 hover:text-white">
            {page}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <Button
            onClick={handleNextPage}
            className={`bg-gray-700 hover:bg-slate-600 ${
              page === pages || !pages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={page === pages || !pages || loadingNext}
          >
            {loadingNext ? <Loading /> : "Next"}
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default AllProducts;
