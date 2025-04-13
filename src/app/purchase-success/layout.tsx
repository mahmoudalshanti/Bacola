import type { Metadata } from "next";
import AppBar from "../_components/AppBar";
import Footer from "../_components/Footer";

export const metadata: Metadata = {
  title: "Order Successful! | Bacola - Fresh Food Delivery",
  description:
    "Your Bacola order has been placed successfully! Thank you for your purchase. We'll deliver your fresh groceries soon.",

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
