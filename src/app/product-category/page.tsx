import React from "react";
import NavigationBar from "../_components/NavigationBar";

import Filter from "./_components/Filter";
import { actionGetCategories } from "../dashboard/_actions/actionDashboard";

async function page() {
  let categories: Category[] = [];

  try {
    categories = (await actionGetCategories()) as Category[];
    if ("errMsg" in categories) {
      if (categories.errMsg) throw new Error(categories.errMsg as string);
    }
  } catch (err) {
    console.error("Something went Wrong!", err);
  }
  return (
    <div className="py-[130px] md:p-0 mb-0 md:mb-32">
      <div className="sm:mb-10 lg:mb-14 mb-4">
        <NavigationBar navigation="Category & Filter" />
        <div className="mt-8 lg:mt-14">
          <Filter categories={categories} />
        </div>
      </div>
    </div>
  );
}

export default page;
