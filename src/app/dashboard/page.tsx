import React from "react";
import UsersCard from "./_components/cards/Users";
import TotalRevenue from "./_components/cards/TotalRevenue";
import TotalSales from "./_components/cards/TotalSales";
import ProductsCard from "./_components/cards/Products";
import { LineChartComponent } from "@/components/ui/LineChart";
import { BarChartComponent } from "@/components/ui/BarChart";
import { PieChartComponent } from "@/components/ui/PieChart";
import DashboardTime from "./_components/DashboardTime";
import getSupervisor from "./_components/getSupervisor";
import { actionCountCards } from "./_actions/actionDashboard";

async function Page() {
  let supervisor: Manager | Admin | null;

  let countCards: {
    product_count: number;
    user_count: number;
    sales_count: number;
    revenue: number;
  };

  try {
    const supervisorData = await getSupervisor();
    supervisor = supervisorData
      ? {
          ...supervisorData,
          id: supervisorData.id || "",
          email: supervisorData.email || "",
          role: supervisorData.role || "",
        }
      : null;
  } catch (err) {
    supervisor = null;
  }

  try {
    countCards = (await actionCountCards()) as {
      product_count: number;
      user_count: number;
      sales_count: number;
      revenue: number;
    };
  } catch (err) {
    countCards = {
      product_count: 0,
      user_count: 0,
      sales_count: 0,
      revenue: 0,
    };
  }
  return (
    <div>
      <div className="mb-7">
        <p className="font-semibold text-2xl md:text-3xl text-slate-700 dark:text-slate-300">
          Welcome back,
          <span className="text-gray-800">
            Sir{" "}
            {supervisor?.role
              ? supervisor?.email.charAt(0).toUpperCase() +
                supervisor?.email.slice(1).split("@")[0]
              : "Role"}
          </span>
          !
        </p>
        <DashboardTime />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full h-fit mb-5">
        <UsersCard users={countCards?.user_count} />
        <ProductsCard products={countCards?.product_count} />
        <TotalRevenue total_revenue={countCards?.revenue} />
        <TotalSales total_sales={countCards?.sales_count} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 w-full h-fit mb-2">
        <LineChartComponent />
        <BarChartComponent />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 w-full h-fit">
        <PieChartComponent />
        {/* <GeographyChart data={data} /> */}
      </div>
    </div>
  );
}

export default Page;
