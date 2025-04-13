import type { Metadata } from "next";
import AppBar from "../_components/AppBar";
import Footer from "../_components/Footer";

export const metadata: Metadata = {
  title: "Order Details | Bacola",
  description: "View your order details and tracking information on Bacola",

  icons: { icon: "/cart-logo-bacola.png" },
};

export default function OrderTracking({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppBar />
      <div className="p-4  xl:px-20">{children}</div>

      <Footer />
    </>
  );
}
