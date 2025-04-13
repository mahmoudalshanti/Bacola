import AppBar from "@/app/_components/AppBar";
import Footer from "@/app/_components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Bacola - Secure Online Grocery Shopping",
  description:
    "Complete your grocery order securely with Bacola. Fast delivery and easy payment options.",

  keywords: [
    "Bacola checkout",
    "online grocery checkout",
    "secure payment",
    "food delivery checkout",
    "grocery cart checkout",
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
