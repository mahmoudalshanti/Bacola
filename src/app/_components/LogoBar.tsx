"use client";

import { Menu } from "lucide-react";
import Logo from "./Logo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CategoriesMenuMobile } from "./CategoriesMenu";
import { DialogTitle } from "@radix-ui/react-dialog";
import CategoriesBar from "./CategoriesBar";
import { useMenu } from "../_context/CategoriesMenuProvider";

function LogoBar({ categories }: { categories: Category[] }) {
  const { openSheet, setOpenSheet } = useMenu();
  return (
    <div>
      <div className="flex-shrink-0">
        <div className="hidden xl:block mb-5">
          <Logo horizontal="start" wieght="bold" />
          <p className="text-xs text-gray-400">
            Online Grocery Shopping Center
          </p>
        </div>
        <div className="flex items-center xl:hidden">
          <Sheet open={openSheet} onOpenChange={setOpenSheet}>
            <SheetTrigger>
              <Menu className="mr-2 text-gray-500 cursor-pointer" />
            </SheetTrigger>
            <SheetContent
              side={"left"}
              className="overflow-y-scroll h-[100vh] scrollbar-custom-sheet outline-none"
            >
              <SheetHeader>
                <DialogTitle></DialogTitle>
                <Logo horizontal="center" wieght="bold" />
                <CategoriesMenuMobile categories={categories} />
                <br />
                <div className="w-full h-0.5 bg-gray-100"></div>
                <br />
                <p className="text-gray-500 text-sm text-start">
                  Site Navigation
                </p>
                <CategoriesBar />
              </SheetHeader>
            </SheetContent>
          </Sheet>
          <Logo horizontal="" wieght="" />
        </div>
      </div>
    </div>
  );
}

export default LogoBar;
