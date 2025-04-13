import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages - dashboard",
  description: "Messages - Bacola",

  icons: { icon: "/cart-logo-bacola.png" },
};

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
