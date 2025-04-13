import type { Metadata } from "next";
import Sidebar from "./_components/Sidebar";
import Upbar from "./_components/Upbar";

export const metadata: Metadata = {
  title: "Admin Dashboard | Bacola - Secure Management Portal",
  description:
    "Secure administration panel for managing the Bacola online grocery store.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="relative">
        <nav className="fixed h-[100vh] bg-gray-200 left-0 w-[20%] ">
          <Sidebar />
        </nav>
        <Upbar />
        <div className=" text-white w-[80%] ml-[20%] p-5 px-9">{children}</div>
      </div>
    </>
  );
}
