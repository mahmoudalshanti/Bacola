import type { Metadata } from "next";
import AppBar from "../_components/AppBar";
import Footer from "../_components/Footer";

export const metadata: Metadata = {
  title: "Order Cancelled | Bacola",
  description: "Your Bacola order has been cancelled.",

  icons: { icon: "/cart-logo-bacola.png" },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppBar />
      {children}
      <Footer />
    </>
  );
}
