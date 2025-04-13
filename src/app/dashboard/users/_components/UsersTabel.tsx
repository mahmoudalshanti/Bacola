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
import { InfoIcon, Trash, View } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import {
  actionDeleteUser,
  actionGetRatesUser,
  actionGetUserOrders,
  actionPageNextUsers,
  actionPagePrevUsers,
} from "../../_actions/actionDashboard";
import { DrawerDialog } from "@/components/Drawer";
import { ViewOrderSearch } from "../../orders/_components/SearchInput";
import OrderLoading from "@/components/OrderLoading";
import StarRating from "@/components/RatingStars";
import { capitalizeIfAmpersand } from "@/lib/utils";
import Content from "../../products/_components/ViewProduct";
import RatesLoading from "@/components/RatesLoading";

function UsersTable({
  pagesServer,
  countServer,
  users,
  page,
}: {
  pagesServer: number;
  countServer: number;
  users: User[];
  page: number;
}) {
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [errMsg, setErrMsg] = useState<string>("");
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [openError, setOpenError] = useState<boolean>(false);
  const [openViewOrders, setOpenViewOrders] = useState<boolean>(false);
  const [openViewRates, setOpenViewRates] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");

  // Handle User deletion
  const handleDeleteUser = async (id: string) => {
    try {
      setLoadingDelete(true);
      const data = await actionDeleteUser(id);

      if (data && "errMsg" in data && data.errMsg) {
        throw new Error(data.errMsg);
      } else {
        setErrMsg("");
        setOpenConfirmDelete(false);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong!";
      setErrMsg(message);
      setOpenError(true);
      setOpenConfirmDelete(false);
      console.error("Something went wrong", err);
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
      {/* Users Table Section */}
      <div className="mt-10 w-full">
        <p className="text-slate-800 font-semibold mb-1">
          Lists <span className="text-slate-900 font-bold">All Users</span>
        </p>
        <p className="text-slate-700 font-semibold mb-1 text-sm flex justify-end w-full">
          {countServer} User(s) found, Page {page} of {pagesServer}
        </p>

        {/* Table Container */}
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-emerald-900 hover:bg-emerald-900 ">
                <TableHead className="w-[100px] text-white">Id</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Created At</TableHead>
                <TableHead className="text-white">Date Of Birth</TableHead>
                <TableHead className="text-white">Country</TableHead>
                <TableHead className="text-white">Orders</TableHead>
                <TableHead className="text-white">Rated</TableHead>
                <TableHead className="text-white">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.length > 0 ? (
                users.map((user: User) => (
                  <TableRow
                    key={user?.id}
                    className="bg-gray-50 hover:bg-gray-100 even:bg-gray-100"
                  >
                    <TableCell className="font-semibold text-slate-700">
                      {user?.id}
                    </TableCell>
                    <TableCell className="font-medium text-slate-700">
                      {user?.email}
                    </TableCell>
                    <TableCell className="text-slate-700 whitespace-nowrap w-auto">
                      {`${
                        user?.fName.charAt(0).toUpperCase() +
                        user?.fName.slice(1)
                      } ${
                        user?.lName.charAt(0).toUpperCase() +
                        user?.lName.slice(1)
                      }`}
                    </TableCell>
                    <TableCell className="text-slate-700 whitespace-nowrap w-auto">
                      {user?.createdAt.toDateString()}
                    </TableCell>
                    <TableCell className="text-slate-700 whitespace-nowrap w-auto">
                      {user?.dateOfBirth.toDateString()}
                    </TableCell>
                    <TableCell className="text-slate-700">
                      <div className="flex items-center gap-2">
                        {user?.country?.flag && (
                          <img
                            src={user.country.flag}
                            alt={user.country.name}
                            className="w-5 h-5 rounded-full"
                          />
                        )}
                        {user?.country?.name ? user?.country?.name : "UnKnown"}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-700">
                      <View
                        className="text-blue-600 size-4 cursor-pointer"
                        onClick={() => {
                          setUserId(user.id);
                          setOpenViewOrders(true);
                        }}
                      />
                    </TableCell>
                    <TableCell className="text-slate-700">
                      <View
                        className="text-blue-600 size-4 cursor-pointer"
                        onClick={() => {
                          setUserId(user.id);
                          setOpenViewRates(true);
                        }}
                      />
                    </TableCell>
                    <TableCell className="text-slate-700 cursor-pointer">
                      {/* Action buttons for delete */}
                      <div className="flex items-center">
                        <Trash
                          className="text-red-600 size-4 mr-2 hover:text-red-700"
                          onClick={() => {
                            setDeleteUser(user);
                            setOpenConfirmDelete(true); // Open delete confirmation
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
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Component */}
        <PaginationTable pages={pagesServer} page={page} />

        {/* Confirm Delete Drawer Dialog */}
        <DrawerDialog
          content={
            <div className="p-5 flex items-center">
              <div className="w-full">
                <p className="text-slate-800 font-semibold mb-2">
                  Are you sure you want to delete "{deleteUser?.email}"?
                </p>
                <Button
                  disabled={loadingDelete}
                  className="w-full bg-red-700 hover:bg-red-600"
                  onClick={() => deleteUser && handleDeleteUser(deleteUser.id)}
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

      <DrawerDialog
        open={openViewOrders}
        setOpen={setOpenViewOrders}
        content={<ViewOrderUser userId={userId} />}
      />
      <DrawerDialog
        open={openViewRates}
        setOpen={setOpenViewRates}
        content={<ViewRatesUser userId={userId} />}
      />
    </>
  );
}

const ViewOrderUser = ({ userId }: { userId: string }) => {
  const [orders, setOrders] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true); // Start with true since we load immediately

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        const fetchOrders = await actionGetUserOrders(userId);
        setOrders(fetchOrders);

        if (fetchOrders && "errMsg" in fetchOrders) {
          if (fetchOrders.errMsg) throw new Error(fetchOrders.errMsg);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, [userId]);

  return (
    <div className="p-5 h-96 overflow-y-scroll">
      {loading ? (
        <OrderLoading />
      ) : orders.length ? (
        orders.map((order: any) => (
          <ViewOrderSearch key={order.id} order={order} />
        ))
      ) : (
        <p className="text-slate-700 flex items-center">
          <InfoIcon className="mr-1" /> No orders found
        </p>
      )}
    </div>
  );
};
const ViewRatesUser = ({ userId }: { userId: string }) => {
  const [rates, setRates] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true); // Start with true since we load immediately
  const [openView, setOpenView] = useState<boolean>(false);
  const [viewProduct, setViewProduct] = useState<any>(null);

  useEffect(() => {
    const getRates = async () => {
      try {
        setLoading(true);
        const fetchRates = await actionGetRatesUser(userId);
        setRates(fetchRates);

        if (fetchRates && "errMsg" in fetchRates) {
          if (fetchRates.errMsg) throw new Error(fetchRates.errMsg);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    getRates();
  }, [userId]);

  return (
    <div className="p-5 h-96 overflow-y-scroll">
      {loading ? (
        <RatesLoading />
      ) : rates.length ? (
        rates?.map((rate: any) => (
          <div
            key={rate.id}
            className="flex justify-between items-start p-4 mb-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
          >
            <div className="flex gap-4 w-full">
              <div className="flex-shrink-0 w-14 h-14 rounded-md overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={
                    rate?.product?.images?.[0]?.image ||
                    "/placeholder-product.png"
                  }
                  alt={rate?.product?.name}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <StarRating rate={rate?.rating} size={4} />
                  <span className="text-xs text-gray-500">
                    {rate?.rating}/5
                  </span>
                </div>

                <h3 className="mt-1 text-md font-medium w-[170px] text-gray-800 truncate">
                  {capitalizeIfAmpersand(rate?.product?.name)}
                </h3>

                <p className="text-xs text-gray-500">
                  {capitalizeIfAmpersand(rate?.product?.category?.name)}
                </p>

                {rate.comment && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    "{rate.comment}"
                  </p>
                )}
              </div>
            </div>

            <Button
              className="flex-shrink-0 w-10 h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full flex items-center justify-center transition-colors duration-200"
              onClick={() => {
                setViewProduct(rate.product);
                setOpenView(true);
              }}
              aria-label={`View ${rate?.product?.name} details`}
            >
              <View className="w-5 h-5" />
            </Button>
          </div>
        ))
      ) : (
        <div className="text-slate-700 flex items-center">
          <InfoIcon className="mr-1" /> No rates found
        </div>
      )}

      <DrawerDialog
        content={
          viewProduct && (
            <Content
              product={viewProduct}
              setOpenView={setOpenView}
              setViewProduct={setViewProduct}
            />
          )
        }
        open={openView}
        setOpen={setOpenView}
      />
    </div>
  );
};

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
    const newPage = await actionPagePrevUsers(); // Fetch previous page data
    setPage(newPage);
    setLoadingPrev(false);
  };

  const handleNextPage = async () => {
    setLoadingNext(true);
    const newPage = await actionPageNextUsers(); // Fetch next page data
    setPage(newPage);
    setLoadingNext(false);
  };

  return (
    <Pagination className="mt-10 mb-3">
      <PaginationContent>
        <PaginationItem>
          <Button
            onClick={handlePrevPage}
            className={`bg-emerald-700 hover:bg-emerald-700 ${
              page === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={page === 1 || loadingPrev}
          >
            {loadingPrev ? <Loading /> : "Previous"}
          </Button>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink className="bg-emerald-900 hover:bg-emerald-900 hover:text-white">
            {page}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <Button
            onClick={handleNextPage}
            className={`bg-emerald-700 hover:bg-emerald-700 ${
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

export default UsersTable;
