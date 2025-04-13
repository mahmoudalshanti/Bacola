import TotalRevenue from "../_components/cards/TotalRevenue";
import TotalSales from "../_components/cards/TotalSales";
import { LineChartComponent } from "@/components/ui/LineChart";
import SearchInput from "./_components/SearchInput";
import AllOrders from "./_components/AllOrders";
import {
  actionCountCards,
  actionGetOrders,
  getPageOrders,
} from "../_actions/actionDashboard";

async function page() {
  let orders: {
    currentPage: Order[]; // Orders to display on the current page
    no: number; // Current page number
    pages: number; // Total number of pages
    count: number; // Total number of products
  } = { currentPage: [], count: 0, no: 0, pages: 0 };

  let countCards: {
    product_count: number;
    user_count: number;
    sales_count: number;
    revenue: number;
  } = {
    product_count: 0,
    user_count: 0,
    sales_count: 0,
    revenue: 0,
  };

  try {
    orders = (await actionGetOrders(await getPageOrders())) as {
      currentPage: Order[];
      no: number;
      pages: number;
      count: number;
    };
    if ("errMsg" in orders) {
      if (orders.errMsg) throw new Error(orders.errMsg as string);
    }
  } catch (err) {
    console.error("Something went error", err);
  }

  try {
    countCards = (await actionCountCards()) as {
      product_count: number;
      user_count: number;
      sales_count: number;
      revenue: number;
    };
  } catch (err) {
    console.error("Something went error", err);
  }

  return (
    <div>
      <p className="font-semibold text-2xl mb-5 hidden md:flex text-slate-600">
        Orders Management
      </p>

      <div className="mt-5 md:flex-row flex justify-between flex-col">
        <div className="flex w-full md:w-2/3  mb-4 md:mb-0 mr-5">
          <div className="w-full h-fit">
            <div className="md:flex gap-2 w-full h-fit">
              <TotalRevenue total_revenue={countCards.revenue} />
              <TotalSales total_sales={countCards.sales_count} />
            </div>
            <SearchInput />
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <LineChartComponent />
        </div>
      </div>
      <AllOrders
        countServer={orders.count}
        pagesServer={orders.pages}
        orders={orders.currentPage}
        page={orders.no}
      />
    </div>
  );
}

export default page;
