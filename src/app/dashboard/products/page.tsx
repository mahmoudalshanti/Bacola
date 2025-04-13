import { PieChartComponent } from "@/components/ui/PieChart";
import Category from "./_components/Category";
import FeaturedProducts from "./_components/FeaturedProducts";
import BestSeller from "./_components/BestSeller";
import OfferProducts from "./_components/OfferProducts";
import {
  actionGetProucts,
  actionGetCategories,
  getPageProducts,
} from "../_actions/actionDashboard";
import CreateProduct from "./_components/CreateProduct";
import AllProducts from "./_components/AllProducts";

async function page() {
  let categories: Category[] = [];

  let products: {
    currentPage: Product[];
    no: number;
    pages: number;
    count: number;
  } = { currentPage: [], count: 0, no: 0, pages: 0 };

  try {
    categories = (await actionGetCategories()) as Category[];
    if ("errMsg" in categories) {
      if (categories.errMsg) throw new Error(categories.errMsg as string);
    }
  } catch (err) {
    console.error("Something went Error!", err);
  }

  try {
    products = (await actionGetProucts(await getPageProducts())) as {
      currentPage: Product[];
      no: number;
      pages: number;
      count: number;
    };

    if ("errMsg" in products) {
      if (products.errMsg) throw new Error(products.errMsg as string);
    }
  } catch (err) {
    console.error("Something went Error!", err);
  }

  return (
    <div>
      <p className="font-semibold text-2xl mb-5 hidden md:flex text-slate-600">
        Products Management
      </p>
      <CreateProduct categories={categories} />

      <div className="flex flex-wrap gap-4">
        <div className=" w-full md:w-[70%]">
          <Category categories={categories} productsCount={products.count} />
        </div>
        <div className="w-full md:w-[28%]">
          {/* Pie chart component to display product statistics */}
          <PieChartComponent />
        </div>
      </div>

      <p className="text-slate-800 font-semibold mb-1">
        Lists{" "}
        <span className="text-slate-900 font-bold">Specific Products</span>{" "}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <div className="border border-slate-300 p-5 rounded-lg">
          <FeaturedProducts />
        </div>
        <div className="border border-slate-300 p-5 rounded-lg">
          <BestSeller />
        </div>
        <div className="border border-slate-300 p-5 rounded-lg ">
          <OfferProducts />
        </div>
      </div>

      <AllProducts
        countServer={products.count} // Total number of products
        pagesServer={products.pages} // Total number of pages
        products={products.currentPage} // Products on the current page
        page={products.no} // Current page number
      />
    </div>
  );
}

export default page;
