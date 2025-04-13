"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Settings,
  Paperclip,
  LayoutDashboard,
  Package,
  Layout,
  MessageCircle,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import getSupervisor from "./getSupervisor";

function Sidebar() {
  const [active, setActive] = useState<string>("");
  const [supervisor, setSupervisor] = useState<Admin | Manager | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (active === "dashboard") return router.push(`/dashboard`);

    router.push(active);
  }, [active]);

  useEffect(() => {
    const getSupervisorData = async () => {
      const supervisor = await getSupervisor();
      setSupervisor(
        supervisor
          ? {
              ...supervisor,
              id: supervisor.id || "",
              email: supervisor.email || "",
              role: supervisor.role || "",
            }
          : null
      );
    };
    getSupervisorData();
  }, [active]);

  useEffect(() => {
    setActive(pathname);
  }, []);

  return (
    <div className="flex flex-col items-start">
      <div className="p-5 pb-0">
        <p className="font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis hidden md:block  md:w-[60%] lg:w-[100%] md:max-w-none">
          {supervisor?.email ? supervisor.email : "supervisor@gmail.com"}
        </p>
        <p className="text-xl text-start font-bold text-blue-950 hidden md:block">
          {supervisor?.role
            ? supervisor?.role.charAt(0).toUpperCase() +
              supervisor?.role.slice(1)
            : "Role"}
        </p>
      </div>
      <p
        onClick={() => setActive("/dashboard")}
        className={` ${
          active === "/dashboard"
            ? "bg-slate-300 text-blue-900"
            : "text-slate-700"
        } w-full mt-5 p-2 flex hover:bg-slate-300 ${
          active === "dashboard" && "hover:text-gray-600"
        } ease-in-out cursor-pointer justify-center md:justify-start `}
      >
        <LayoutDashboard className={`mr-2 ml-0 md:ml-5`} />{" "}
        <span className="max-w-none hidden md:block">Dashboard</span>{" "}
      </p>
      <p
        onClick={() => setActive("/dashboard/products")}
        className={` ${
          active === "/dashboard/products"
            ? "bg-slate-300 text-blue-900"
            : "text-slate-700"
        } w-full mt-5 p-2 flex hover:bg-slate-300 ${
          active !== "/dashboard/products" && "hover:text-gray-600"
        } ease-in-out cursor-pointer justify-center md:justify-start`}
      >
        <Package className="mr-2 ml-0 md:ml-5" />{" "}
        <span className="max-w-none hidden md:block">Products</span>{" "}
      </p>
      <p
        onClick={() => setActive("/dashboard/orders")}
        className={`${
          active === "/dashboard/orders"
            ? "bg-slate-300 text-blue-900"
            : "text-slate-700"
        }
         w-full mt-5  p-2 flex hover:bg-slate-300 ${
           active !== "/dashboard/orders" && "hover:text-gray-600"
         }  ease-in-out cursor-pointer justify-center md:justify-start `}
      >
        <Paperclip className="mr-2 ml-0 md:ml-5 " />{" "}
        <span className="max-w-none hidden md:block">Orders</span>{" "}
      </p>
      <p
        onClick={() => setActive("/dashboard/users")}
        className={`${
          active === "/dashboard/users"
            ? "bg-slate-300 text-blue-900"
            : "text-slate-700"
        }
        w-full mt-5 p-2 flex hover:bg-slate-300 ${
          active !== "/dashboard/users" && "hover:text-gray-600"
        } ease-in-out cursor-pointer justify-center md:justify-start `}
      >
        <User className="mr-2 ml-0 md:ml-5" />{" "}
        <span className="max-w-none hidden md:block">Users</span>{" "}
      </p>

      <p
        onClick={() => setActive("/dashboard/messages")}
        className={`${
          active === "/dashboard/messages"
            ? "bg-slate-300 text-blue-900"
            : "text-slate-700"
        }
        w-full mt-5 p-2 flex hover:bg-slate-300 ${
          active !== "/dashboard/messages" && "hover:text-gray-600"
        } ease-in-out cursor-pointer justify-center md:justify-start `}
      >
        <MessageCircle className="mr-2 ml-0 md:ml-5" />{" "}
        <span className="max-w-none hidden md:block">Messages</span>{" "}
      </p>

      <p
        onClick={() => setActive("/dashboard/layout")}
        className={`${
          active === "/dashboard/layout"
            ? "bg-slate-300 text-blue-900"
            : "text-slate-700"
        }
        w-full mt-5 p-2 flex hover:bg-slate-300 ${
          active !== "/dashboard/layout" && "hover:text-gray-600"
        } ease-in-out cursor-pointer justify-center md:justify-start `}
      >
        <Layout className="mr-2 ml-0 md:ml-5" />{" "}
        <span className="max-w-none hidden md:block">Layout</span>{" "}
      </p>

      <p
        onClick={() => setActive("/dashboard/settings")}
        className={` ${
          active === "/dashboard/settings"
            ? "bg-slate-300 text-blue-900"
            : "text-slate-700"
        }
        w-full mt-5 p-2 flex hover:bg-slate-300 ${
          active !== "/dashboard/settings" && "hover:text-gray-600"
        } ease-in-out cursor-pointer justify-center md:justify-start`}
      >
        <Settings className="mr-2 ml-0  md:ml-5" />{" "}
        <span className="max-w-none hidden md:block">Settings</span>{" "}
      </p>
    </div>
  );
}

export default Sidebar;
