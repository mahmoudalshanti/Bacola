import { actionGetOfferProducts } from "../../_actions/actionDashboard";
import Tabel from "./Tabel";

async function OfferProducts() {
  let offerProducts: Product[] | {}[] = [];
  try {
    offerProducts = (await actionGetOfferProducts()) as Product[] | {}[];
  } catch (err) {
    console.log("Something went Wrong!", err);
  }

  return (
    <Tabel
      caption="Offer Products"
      headerColor="bg-emerald-800 hover:bg-emerald-800"
      products={offerProducts as Product[]}
      notFound={"No offer products found"}
    />
  );
}

export default OfferProducts;
