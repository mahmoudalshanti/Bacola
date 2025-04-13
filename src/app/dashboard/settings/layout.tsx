import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings - dashboard",
  description: "Dashboard - Bacola",

  icons: { icon: "/cart-logo-bacola.png" },
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
