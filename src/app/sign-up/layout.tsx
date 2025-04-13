import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Your Bacola Account | Fresh Groceries Online Store",
  description:
    "Sign up for Bacola and start ordering fresh vegetables, fruits, meats, and more online.. Enjoy convenient grocery delivery!",
  keywords: [
    "sign up",
    "register",
    "create account",
    "Bacola",
    "online store",
    "food delivery",
    "fresh produce",
  ],

  icons: { icon: "/cart-logo-bacola.png" },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
