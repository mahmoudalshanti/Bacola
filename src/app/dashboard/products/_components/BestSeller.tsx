import React from "react";
import Tabel from "./Tabel";
import { actionGetBestSeller } from "../../_actions/actionDashboard";

async function BestSeller() {
  let bestProducts: Product[] | {}[] = [];
  try {
    bestProducts = (await actionGetBestSeller()) as Product[] | {}[];
  } catch (err) {
    console.log("Something went Wrong!", err);
  }
  return (
    <div>
      <Tabel
        caption="Best Seller"
        headerColor="bg-neutral-900 hover:bg-neutral-900"
        products={bestProducts as Product[]}
        notFound="best seller products not found"
      />
    </div>
  );
}

export default BestSeller;
