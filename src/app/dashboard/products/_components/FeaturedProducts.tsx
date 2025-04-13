import { actionGetFeaturedProducts } from "../../_actions/actionDashboard";
import Tabel from "./Tabel";

async function FeaturedProducts() {
  let featuredProducts: Product[] | {}[] = [];
  try {
    featuredProducts = (await actionGetFeaturedProducts()) as Product[] | {}[];
  } catch (err) {
    console.log("Something went Wrong!", err);
  }

  return (
    <div>
      <Tabel
        caption="Featured Products"
        headerColor="bg-gray-700 hover:bg-gray-700"
        products={featuredProducts as Product[]}
        notFound={"No featured products found"}
      />
    </div>
  );
}

export default FeaturedProducts;
