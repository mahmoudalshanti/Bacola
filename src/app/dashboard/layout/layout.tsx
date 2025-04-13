import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Layout - dashboard",
  description: "Layout - Bacola",

  icons: { icon: "/cart-logo-bacola.png" },
};

export default function LayoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
