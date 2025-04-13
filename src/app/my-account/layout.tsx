import { Metadata } from "next";
import AppBar from "../_components/AppBar";
import Footer from "../_components/Footer";

export const metadata: Metadata = {
  title: "My Account | Bacola - Your Online Grocery Store",
  description:
    "Manage your account details, orders, and preferences on Bacola - Your trusted online grocery store.",

  icons: { icon: "/cart-logo-bacola.png" },
};

export default function MyAccountLayout({
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
