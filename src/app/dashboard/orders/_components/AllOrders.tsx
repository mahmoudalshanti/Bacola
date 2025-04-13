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
import { View } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Loading from "@/components/Loading";
import {
  actionPageNextOrders,
  actionPagePrevOrders,
} from "../../_actions/actionDashboard";
import { DrawerDialog } from "@/components/Drawer";
import ViewOrder from "./ViewOrder";

function AllOrders({
  countServer,
  pagesServer,
  orders,
  page,
}: {
  pagesServer: number;
  countServer: number;
  orders: Order[];
  page: number;
}) {
  const [viewOrder, setViewOrder] = useState<Order | null>(null); // View order dialog
  const [openView, setOpenView] = useState<boolean>(false); // View order dialog

  return (
    <>
      <div className="mt-10 w-full">
        <p className="text-slate-800 font-semibold mb-1">
          Lists <span className="text-slate-900 font-bold">All Orders</span>
        </p>
        <p className="text-slate-700 font-semibold mb-1 text-sm flex justify-end w-full">
          {countServer} Order(s) found, Page {pagesServer} of {1}
        </p>

        <div className="border rounded-lg overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-cyan-900 hover:bg-cyan-900 ">
                <TableHead className="w-[200px] text-white">
                  Track No.
                </TableHead>
                <TableHead className="text-white">
                  Email of request Order
                </TableHead>
                <TableHead className="text-white">Country</TableHead>
                <TableHead className="text-white">Total</TableHead>
                <TableHead className="text-white">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Display orders if available */}
              {orders?.length > 0 ? (
                orders.map((order: Order) => (
                  <TableRow
                    key={order?.id}
                    className="bg-gray-50 hover:bg-gray-100 even:bg-gray-100"
                  >
                    <TableCell className="font-semibold text-slate-700">
                      {order?.track}
                    </TableCell>
                    <TableCell className="font-medium text-slate-700">
                      {order?.user?.email}
                    </TableCell>

                    <TableCell className="text-slate-700">
                      <div className="flex items-center gap-2">
                        {order?.country ? order?.country : "UnKnown"}
                      </div>
                    </TableCell>

                    <TableCell className="font-medium text-slate-700">
                      {order?.totalAmount}$
                    </TableCell>

                    <TableCell className="text-slate-700 cursor-pointer">
                      <div className="flex items-center">
                        <View
                          className="text-blue-600 size-4 cursor-pointer"
                          onClick={() => {
                            setViewOrder(order);
                            setOpenView(true);
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center text-gray-500 py-4"
                  >
                    No Orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Component */}
        <PaginationTable pages={pagesServer} page={page} />

        <DrawerDialog
          content={
            viewOrder && (
              <ViewOrder order={viewOrder} setOpenView={setOpenView} />
            )
          }
          open={openView}
          setOpen={setOpenView}
        />
      </div>
    </>
  );
}

/**
 * PaginationTable Component
 * @param pages - Total number of pages
 * @param page - Current page number
 */
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

  /**
   * Handle previous page navigation
   */
  const handlePrevPage = async () => {
    setLoadingPrev(true);
    const newPage = await actionPagePrevOrders(); // Fetch previous page data
    setPage(newPage);
    setLoadingPrev(false);
  };

  /**
   * Handle next page navigation
   */
  const handleNextPage = async () => {
    setLoadingNext(true);
    const newPage = await actionPageNextOrders(); // Fetch next page data
    setPage(newPage);
    setLoadingNext(false);
  };

  return (
    <Pagination className="mt-10 mb-3">
      <PaginationContent>
        <PaginationItem>
          <Button
            onClick={handlePrevPage}
            className={`bg-cyan-900 hover:bg-cyan-900 ${
              page === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={page === 1 || loadingPrev}
          >
            {loadingPrev ? <Loading /> : "Previous"}
          </Button>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink className="bg-cyan-900 hover:bg-cyan-900 hover:text-white">
            {page}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <Button
            onClick={handleNextPage}
            className={`bg-cyan-700 hover:bg-cyan-700 ${
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

export default AllOrders;
