import { Metadata } from "next";
import AppBar from "../_components/AppBar";
import Footer from "../_components/Footer";

export const metadata: Metadata = {
  title: "Your Shopping Cart | Bacola - Fresh Groceries Online Store",
  description:
    "Review and manage the items in your Bacola shopping cart. Proceed to checkout for fresh grocery delivery globally.",
  icons: { icon: "/cart-logo-bacola.png" },
};

export default function DashboardLayout({
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
