import type { Metadata } from "next";
import AppBar from "../_components/AppBar";
import Footer from "../_components/Footer";

export const metadata: Metadata = {
  title: "Contact Bacola - Your Online Grocery Store",
  description:
    "Contact Bacola for any inquiries, support, or feedback regarding your online grocery orders globally.",
  keywords: [
    "contact us",
    "Bacola support",
    "customer service",
    "grocery delivery help",
    "reach Bacola",
    "contact online store",
  ],

  icons: { icon: "/cart-logo-bacola.png" },
};
export default function ContactLayout({
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
