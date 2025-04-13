import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users - dashboard",
  description: "Dashboard - Bacola",

  icons: { icon: "/cart-logo-bacola.png" },
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
