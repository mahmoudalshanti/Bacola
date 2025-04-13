import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Truck, Package, XCircle, Loader2, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { capitalizeIfAmpersand } from "@/lib/utils";
import { actionUpdateStatusOrder } from "../../_actions/actionDashboard";

// Enums and Interfaces
enum OrderStatus {
  PENDING = "PENDING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
}

// Status Color Mapping
const STATUS_COLORS = {
  [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [OrderStatus.SHIPPED]: "bg-blue-100 text-blue-800",
  [OrderStatus.DELIVERED]: "bg-green-100 text-green-800",
  [OrderStatus.CANCELED]: "bg-red-100 text-red-800",
};

const STATUS_ICONS = {
  [OrderStatus.PENDING]: <Package className="w-5 h-5 text-yellow-600" />,
  [OrderStatus.SHIPPED]: <Truck className="w-5 h-5 text-blue-600" />,
  [OrderStatus.DELIVERED]: <Check className="w-5 h-5 text-green-600" />,
  [OrderStatus.CANCELED]: <XCircle className="w-5 h-5 text-red-600" />,
};

export default function ViewOrder({
  order,
  setOpenView,
}: {
  order?: Order | null;
  setOpenView: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // Add null check and provide default values
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>(
    order?.status || OrderStatus.PENDING
  );

  // If no order is provided, return a placeholder or null
  if (!order) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardContent className="p-6 text-center text-gray-500">
          No order details available
        </CardContent>
      </Card>
    );
  }

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      const data = await actionUpdateStatusOrder(order.id, newStatus);

      if (data?.errMsg && "errMsg" in data) {
        throw new Error(data.errMsg);
      } else {
        setIsUpdating(false);
        setOpenView(false);
      }
    } catch (error) {
      console.error("Failed to update order status", error);
      setIsUpdating(false);
    }
  };

  return (
    <Card className="w-full  mx-auto  border-white shadow-none h-[500px] overflow-y-scroll scrollbar-custom-sheet">
      <CardHeader className=" border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">
            Order #{order?.track || "N/A"}
          </CardTitle>
          <Badge
            className={`${
              STATUS_COLORS[order.status as OrderStatus] ||
              STATUS_COLORS[OrderStatus.PENDING]
            } flex items-center gap-2`}
          >
            {STATUS_ICONS[order.status as OrderStatus] ||
              STATUS_ICONS[OrderStatus.PENDING]}
            {order?.status || "PENDING"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Order Details Section */}
        <p className="text-slate-500 font-bold ">{order?.user?.email}</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Order Date</p>
            <p>{order?.createdAt?.toLocaleDateString() || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Payment Method</p>
            <p>{order?.method || "N/A"}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">Address</p>
          <p>
            {order?.street +
              ", " +
              order.city +
              ", " +
              order.country +
              ", " +
              order.zipCode}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Session_Id</p>
          <p>{order.sessionId}</p>
        </div>
        {order.comment && (
          <div>
            <p className="text-sm text-gray-500">Comment</p>
            <p>{order.comment}</p>
          </div>
        )}

        <Separator />

        {/* Order Items */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Order Items</h3>
          {order?.items && order.items.length > 0 ? (
            order?.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-2 border-b last:border-b-0"
              >
                <div>
                  <p>
                    {capitalizeIfAmpersand(item?.product?.name || "") ||
                      "Unknown Product"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item?.quantity} x $
                    {item?.product?.offer
                      ? item?.product?.offer.toFixed(2)
                      : item?.product?.price.toFixed(2)}
                  </p>
                </div>
                <p className="font-semibold">
                  ${(item?.price || 0).toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No items in this order</p>
          )}
        </div>

        <Separator />

        {/* Total Amount */}
        <div className="flex justify-between font-bold text-lg">
          <p>Total Amount</p>
          <p>${(order?.totalAmount || 0).toFixed(2)}</p>
        </div>

        {/* Status Update Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Update Order Status</h3>
          <div className="flex items-center space-x-4">
            <Select
              value={newStatus}
              onValueChange={(value: OrderStatus) => setNewStatus(value)}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(OrderStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={newStatus === order.status || isUpdating}
                >
                  Update Status
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Status Update</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to change the order status to{" "}
                    {newStatus}?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleStatusUpdate}>
                    {isUpdating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Confirm"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
