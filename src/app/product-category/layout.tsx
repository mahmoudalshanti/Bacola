import type { Metadata } from "next";
import AppBar from "../_components/AppBar";
import Footer from "../_components/Footer";

export const metadata: Metadata = {
  title: "Browse All Categories | Bacola - Fresh Groceries Online Store",
  description:
    "Explore our wide range of fresh food categories at Bacola. Find vegetables, fruits, meats, and more.. for online order and fast delivery.",
  keywords: [
    "all categories",
    "browse products",
    "fresh groceries",
    "online food store",
    "vegetables",
    "fruits",
    "meat",
    "Bacola",
    "breakfast",
    "frozen foods",
    "grocery",
    "staples",
    "snacks",
    "biscuits",
    "beverages",
    "breads",
  ],

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
      <div className="p-4  xl:px-20">{children}</div>
      <Footer />
    </>
  );
}
