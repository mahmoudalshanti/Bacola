import AppBar from "@/app/_components/AppBar";
import Footer from "@/app/_components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Bacola - Your Local Online Grocery Store",
  description:
    "Learn more about Bacola, your trusted online grocery store, We are committed to providing fresh, high-quality food with convenient delivery.",
  keywords: [
    "about us",
    "Bacola story",
    "our mission",
    "online grocery store",
    "fresh food",
    "Bacola team",
  ],

  icons: { icon: "/cart-logo-bacola.png" },
};

export default function AboutUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppBar />
      <div className="">{children}</div>
      <Footer />
    </>
  );
}
