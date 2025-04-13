"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { actionGetUserOrders } from "../../dashboard/_actions/actionDashboard";
import { capitalizeIfAmpersand, formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import OrderLoading from "@/components/OrderLoading";

type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await actionGetUserOrders();
        setOrders(data as unknown as Order[]);

        if ("errMsg" in data && data?.errMsg) {
          throw new Error(data.errMsg);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Helper function to get status badge color
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const router = useRouter();
  return (
    <div className=" mt-8">
      {loading ? (
        <div className="relative overflow-hidden h-[300px]">
          <OrderLoading size={3} />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-600">
            You don't have any orders yet
          </h2>
          <p className="mt-2 text-gray-500">
            Once you place an order, it will appear here
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-blue-900 hover:bg-blue-800 rounded-full flex px-6 p-3 w-fit text-white mx-auto mt-10 "
          >
            Return to shop
          </Button>
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {orders?.map((order: Order) => (
            <AccordionItem
              key={order.id}
              value={order.id}
              className="border rounded-lg shadow-sm"
            >
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 rounded-t-lg">
                <div className="flex flex-col md:flex-row w-full items-start md:items-center justify-between text-left gap-2">
                  <div>
                    <p className="font-medium">Order #{order.track}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{order.totalAmount}</span>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-700">
                        Order Details
                      </h3>
                      <div className="mt-2 space-y-1 text-sm">
                        <p>
                          <span className="text-gray-500">Order ID:</span>{" "}
                          {order.id}
                        </p>
                        <p>
                          <span className="text-gray-500">
                            Tracking Number:
                          </span>{" "}
                          {order.track}
                        </p>
                        <p>
                          <span className="text-gray-500">Payment Method:</span>{" "}
                          {order.method}
                        </p>
                        <p>
                          <span className="text-gray-500">Last Updated:</span>{" "}
                          {formatDate(order.updatedAt)}
                        </p>
                      </div>
                    </div>

                    {order.comment && (
                      <div>
                        <h3 className="font-medium text-gray-700">Comments</h3>
                        <p className="mt-2 text-sm">{order.comment}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">
                      Order Items
                    </h3>
                    <div className="space-y-2">
                      {order?.items?.map((item: OrderItem) => (
                        <Card key={item.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div className="flex-1">
                                <p className="font-medium">
                                  {capitalizeIfAmpersand(
                                    item?.product?.name || ""
                                  )}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Quantity: {item.quantity} ×{" "}
                                  {item?.product?.offer
                                    ? item?.product?.offer
                                    : item?.product?.price}
                                </p>
                              </div>
                              <p className="font-semibold">{item.price}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end border-t pt-3">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-xl font-bold">{order.totalAmount}</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
