"use client";

import CustomLoading from "@/components/CustomLoading";
import Input from "@/components/Input";
import { InfoIcon, Search, View } from "lucide-react";
import { KeyboardEvent, useState } from "react";
import { DrawerDialog } from "@/components/Drawer";
import { actionSearchOrder } from "../../_actions/actionDashboard";
import { Button } from "@/components/ui/button";
import ViewOrder from "./ViewOrder";

function SearchInput() {
  const [search, setSearch] = useState<string>("");
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");
  const [orders, setOrders] = useState<any>([]);
  const [openError, setOpenError] = useState<boolean>(false);

  const handelSearch = async () => {
    try {
      setLoadingSearch(true);
      const findOrders = await actionSearchOrder(search);
      setOrders(findOrders);
      setOpenSearch(true);
      if ("errMsg" in findOrders) {
        if (findOrders.errMsg) throw new Error(findOrders.errMsg);
      }
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Something went wrong!");
      setOpenError(true);
    } finally {
      setLoadingSearch(false);
    }
  };
  const handleKeyDownSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handelSearch();
  };

  return (
    <div>
      <DrawerDialog
        open={openSearch}
        setOpen={setOpenSearch}
        content={
          <div className=" p-5 h-96 overflow-y-scroll">
            {orders.length ? (
              orders.map((order: any) => (
                <ViewOrderSearch key={order.id} order={order} />
              ))
            ) : (
              <p className="text-slate-700 flex items-center">
                <InfoIcon className="mr-1" /> No orders found
              </p>
            )}
          </div>
        }
      />
      <div className="relative mt-5">
        <Input
          onKeyDown={handleKeyDownSearch}
          className="w-full pr-10"
          placeholder="Search orders by track, user email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div
          onClick={handelSearch}
          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
        >
          {loadingSearch ? (
            <CustomLoading props="w-5 h-5 border-t-cyan-950 border-slate-300" />
          ) : (
            <Search className="text-slate-600" />
          )}
        </div>
      </div>

      <DrawerDialog
        content={<div className="p-5 text-red-500 ">{errMsg}</div>}
        open={openError}
        setOpen={setOpenError}
      />
    </div>
  );
}

export const ViewOrderSearch = ({ order }: { order: Order }) => {
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [openView, setOpenView] = useState<boolean>(false);

  return (
    <div
      className="w-full flex items-center justify-between mt-4 mb-1 p-5  "
      key={order.id}
    >
      <div className="flex items-center justify-between w-full p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Order ID
              </p>
              <p className="text-sm font-medium text-gray-800 truncate">
                {order.track}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </p>
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === "PENDING"
                      ? "bg-yellow-600"
                      : order.status === "SHIPPED"
                      ? "bg-blue-600"
                      : order.status === "DELIVERED"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Payment
              </p>
              <p className="text-sm font-medium text-gray-800 capitalize">
                {order.method}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Session
              </p>
              <p className="text-sm font-medium text-gray-800 font-mono truncate">
                {order.sessionId}
              </p>
            </div>
          </div>
        </div>

        <div className="ml-4 flex-shrink-0">
          <Button
            className="flex-shrink-0 w-10 h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full flex items-center justify-center transition-colors duration-200"
            onClick={() => {
              setViewOrder(order);
              setOpenView(true);
            }}
          >
            <View className="w-5 h-5 text-gray-500" />
          </Button>
        </div>
      </div>

      <DrawerDialog
        content={
          viewOrder && <ViewOrder setOpenView={setOpenView} order={order} />
        }
        open={openView}
        setOpen={setOpenView}
      />
    </div>
  );
};

export default SearchInput;
