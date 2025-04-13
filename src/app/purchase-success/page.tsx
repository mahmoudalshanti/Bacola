"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { actionCheckoutSuccess } from "../checkout/_actions/actionCheckout";
import { capitalizeIfAmpersand, formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import PageLoading from "@/components/PageLoading";

export default function OrderSuccessPage() {
  const [orderDetails, setOrderDetails] = useState<{
    orderId?: string;
    trackingNumber?: string;
    email?: string;
    orderDate?: Date;
    items?: [];
    total?: number;
    street?: string;
    zipCode?: string;
    country?: any;
    city?: string;
  }>({
    orderId: "",
    trackingNumber: "",
    email: "",
    orderDate: new Date(),
    items: [],
    total: 0,
    city: "",
    country: "",
    street: "",
    zipCode: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const purchase = await actionCheckoutSuccess();
        setOrderDetails({
          orderId: purchase?.orderId,
          trackingNumber: purchase?.track,
          email: purchase?.email,
          orderDate: purchase?.createdAt,
          items: purchase?.items,
          total: purchase?.total,
          street: purchase?.street,
          zipCode: purchase?.zipCode,
          country: purchase?.country,
          city: purchase?.city,
        });
        if (purchase && "errMsg" in purchase) {
          if (purchase.errMsg) throw new Error(purchase.errMsg);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, []);

  if (loading) {
    return (
      <div className="pt-32 xl:pt-0">
        <PageLoading />
      </div>
    );
  }

  if (error) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen items-center justify-center pt-36 md:pt-10 xl:pt-5 bg-gray-50 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center bg-green-50 rounded-t-lg border-b">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">
            Order Successful!
          </CardTitle>
          <CardDescription className="text-green-600">
            Thank you for your purchase, {orderDetails.email}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Order Number:</span>
              <span className="font-medium">{orderDetails.orderId}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Tracking Number:</span>
              <Badge variant="outline" className="font-mono">
                {orderDetails.trackingNumber}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Order Date:</span>
              <span>
                {orderDetails.orderDate && formatDate(orderDetails?.orderDate)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Country</span>
              <span>{orderDetails.country && orderDetails.country}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">City</span>
              <span>{orderDetails.city && orderDetails.city}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Street</span>
              <span>{orderDetails.street && orderDetails.street}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">ZipCode</span>
              <span>{orderDetails.zipCode && orderDetails.zipCode}</span>
            </div>

            <div className="border-t border-b py-4 my-4">
              <h3 className="font-medium mb-2">Order Summary</h3>
              {orderDetails?.items &&
                orderDetails?.items.map((item: OrderItem) => (
                  <div
                    key={item.productId}
                    className="flex justify-between text-sm mb-2"
                  >
                    <span>
                      {capitalizeIfAmpersand(item.name)} × {item.quantity}
                    </span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                ))}
              <div className="flex justify-between font-bold mt-4 pt-2 border-t">
                <span>Total</span>
                <span>
                  ${orderDetails.total && orderDetails?.total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                We'll send updates about your order to your email. You can also
                track your order using the tracking number above.
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between pt-2">
          <Button variant="outline" asChild>
            <Link href="/product-category">Back to Shop</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/order_tracking">View Orders</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
