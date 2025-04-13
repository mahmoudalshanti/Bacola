import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import CategoriesMenuProvider from "./_context/CategoriesMenuProvider";
import { Toaster } from "react-hot-toast";
import ProductsProvider from "./_context/ProductsProvider";
import UserProvider from "./_context/UserProvider";
import { SessionProvider } from "next-auth/react";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap", // no flickering
});

export const metadata: Metadata = {
  title: "Fresh Groceries Online | Bacola - Your Local Food Store",
  description:
    "Order fresh groceries online from Bacola! We offer a wide selection of high-quality vegetables, fruits, meats, and more. Fast delivery to your country",
  keywords: [
    "fresh groceries",
    "online food store",
    "vegetables",
    "fruits",
    "meat",
    "global food delivery",
    "fresh produce",
  ],
  authors: [{ name: "Bacola" }],

  icons: { icon: "/cart-logo-bacola.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} antialiased scrollbar-custom`}>
        <SessionProvider>
          <UserProvider>
            <CategoriesMenuProvider>
              <ProductsProvider>{children}</ProductsProvider>
              <Toaster position="bottom-right" />
            </CategoriesMenuProvider>
          </UserProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
