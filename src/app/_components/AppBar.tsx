import { actionGetCartUser } from "../cart/_actions/actionCart";
import {
  actionGetCategories,
  actionGetText,
} from "../dashboard/_actions/actionDashboard";
import AppBarDesktop from "./AppBarDesktop";
import AppBarMobile from "./AppBarMobile";

async function AppBar() {
  let categories: Category[] = [];
  let cart = null;
  let textAppbar: string = "";
  try {
    categories = (await actionGetCategories()) as Category[];
    if ("errMsg" in categories)
      if (categories.errMsg) throw new Error(categories.errMsg as string);
  } catch (err) {
    console.error("Something went wrong!", err);
  }

  try {
    cart = await actionGetCartUser();
  } catch (err) {
    console.error("Something went wrong!", err);
  }

  try {
    textAppbar = (await actionGetText()) as string;
    if (!textAppbar) throw new Error("Failed to fetch text for AppBar");
  } catch (err) {
    console.error("Something went wrong!", err);
  }
  return (
    <>
      <div className="md:block hidden">
        <AppBarDesktop />
      </div>
      <div className=" block md:hidden">
        <AppBarMobile
          categories={categories}
          cart={cart as unknown as Cart}
          textAppbar={textAppbar}
        />
      </div>
    </>
  );
}

export default AppBar;
