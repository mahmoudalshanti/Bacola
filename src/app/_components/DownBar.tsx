"use client";

import { DrawerDialog } from "@/components/Drawer";
import { Heart, Menu, Search, Store, User } from "lucide-react";
import { useState } from "react";
import { SearchBarMobile } from "./SearchBar";
import { useRouter } from "next/navigation";
import { useMenu } from "../_context/CategoriesMenuProvider";

function DownBar() {
  const { setOpenSheet, setOpen } = useMenu();
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const router = useRouter();
  return (
    <div className="">
      {openSearch && (
        <>
          <DrawerDialog
            content={<>{<SearchBarMobile />}</>}
            open={openSearch}
            setOpen={setOpenSearch}
          />
        </>
      )}
      <div className="flex justify-between px-5 w-full fixed bottom-0 pt-1 text-gray-700  md:hidden bg-white z-50">
        <div
          onClick={() => router.push("/product-category")}
          className="flex flex-col items-center text-xs cursor-pointer "
        >
          <Store className="size-5" />
          <p>Store</p>
        </div>
        <div
          className="flex flex-col items-center text-xs cursor-pointer"
          onClick={() => setOpenSearch(true)}
        >
          <Search className="size-5" />
          <p>Search</p>
        </div>
        <div
          className="flex flex-col items-center text-xs cursor-pointer"
          onClick={() => router.push("/wishlist")}
        >
          <Heart className="size-5" />
          <p>Wishlist</p>
        </div>
        <div
          onClick={() => router.push("/my-account")}
          className="flex flex-col items-center text-xs cursor-pointer"
        >
          <User className="size-5" />
          <p>Account</p>
        </div>
        <div
          onClick={() => {
            setOpenSheet(true);
            setOpen(true);
          }}
          className="flex flex-col items-center text-xs cursor-pointer"
        >
          <Menu className="size-5" />
          <p>Categoreis</p>
        </div>
      </div>
    </div>
  );
}

export default DownBar;
