import type { Metadata } from "next";
import AppBar from "../_components/AppBar";
import Footer from "../_components/Footer";

export const metadata: Metadata = {
  title: "My Wishlist | Bacola - Your Online Grocery Store",
  description:
    "View your saved items on your Bacola wishlist. Easily keep track of your favorite fresh groceries, vegetables, fruits, and meats for future purchase",

  icons: { icon: "/cart-logo-bacola.png" },
};

export default function WishListLayout({
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
