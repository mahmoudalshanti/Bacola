"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter } from "next/navigation";
import { useMenu } from "../_context/CategoriesMenuProvider";
import { capitalizeIfAmpersand } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import CategoryIcon from "./CategoreyIcon";
import { useSession } from "next-auth/react";
import getUser from "./getUser";
import { useUser } from "../_context/UserProvider";
import { actionContinueGoogle } from "../sign-in/_actions/actionSignIn";
import Link from "next/link";

function CategoriesMenuDesktop({ categories }: { categories: Category[] }) {
  return (
    <div className="hidden xl:block">
      <DropdownMenuRadioGroupDemo categories={categories} />
    </div>
  );
}

export function CategoriesMenuMobile({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <div className="block xl:hidden mx-auto w-full">
      <DropdownMenuRadioGroupDemo categories={categories} />
    </div>
  );
}

export default CategoriesMenuDesktop;

function DropdownMenuRadioGroupDemo({
  categories,
}: {
  categories: Category[];
}) {
  const { open } = useMenu();

  return (
    <div>
      <Accordion type="single" collapsible defaultValue={"item-1"}>
        <AccordionItem value="item-1" className="border-none">
          <CategoriesButton />
          <AnimatePresence>
            <AccordionContent
              key={"mobile-content"}
              className="xl:hidden block"
            >
              <CategoriesContent categories={categories} />
            </AccordionContent>
            {open && (
              <div className="xl:block hidden">
                <CategoriesContent categories={categories} />
              </div>
            )}
          </AnimatePresence>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

const CategoriesButton = () => {
  const { setOpen } = useMenu();
  const { data } = useSession();
  const { setUser } = useUser();

  useEffect(() => {
    const handelGoogleSignInContinue = async () => {
      try {
        if (data) {
          const result = await actionContinueGoogle(data?.user?.email || "");
          const user = await getUser();
          setUser(user);
          if ("errMsg" in result)
            if (result.errMsg) throw new Error(result.errMsg);
        }
      } catch (err) {
        console.error("Something went error by google auth", err);
      }
    };
    handelGoogleSignInContinue();
  }, [data]);

  return (
    <AccordionTrigger
      onClick={() => setOpen((prev) => !prev)}
      className="flex text-white no-underline bg-cyan-500 justify-center rounded-3xl p-3 cursor-pointer items-center w-full hover:no-underline"
    >
      <Menu className="mr-3 size-4" />
      <p className="mr-5 font-bold text-xs no-underline">ALL CATEGORIES</p>
    </AccordionTrigger>
  );
};

export const CategoriesContent = ({
  categories,
}: {
  categories: Category[];
}) => {
  const router = useRouter();
  const { setOrderFilter } = useMenu();
  const [hover, setHover] = useState<string>("");

  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: "auto" }}
      exit={{ height: 0 }}
      transition={{ ease: "easeInOut" }}
      className="px-4 xl:px-20 left-0 bg-none xl:top-[100.5%] xl:absolute mx-auto block xl:grid grid-cols-1 md:grid-cols-12 gap-4 w-full h-fit mb-0 xk:mb-5 xl:p-0"
    >
      <div className="col-span-12 w-full md:col-span-3 pt-3 xl:pt-5 z-20 bg-white xl:border xl:border-t-transparent">
        {categories?.map((category: Category) => {
          return (
            <Link
              href={`/product-category/${category.name}`}
              onClick={() => {
                setOrderFilter("latest");
              }}
              onMouseMove={() => setHover(category.name)}
              onMouseLeave={() => setHover("")}
              key={category?.id}
              className="flex items-center text-sm px-0 whitespace-nowrap xl:px-5 mb-2 cursor-pointer text-start text-slate-900 hover:text-cyan-600 p-2 rounded"
            >
              <CategoryIcon categoryName={category.name} hover={hover} />
              {capitalizeIfAmpersand(category?.name)}
            </Link>
          );
        })}
        <div className="h-[1px] mt-7 w-full bg-gray-200"></div>

        <Link
          href={"/product-category"}
          onClick={() => {
            setOrderFilter("topOffer");
          }}
          className="px-0  mt-2 xl:px-5 mb-2 text-slate-700 text-sm font-bold text-start hover:text-cyan-500"
        >
          Top 100 Offer
        </Link>
        <br />
        <Link
          href={"/product-category"}
          onClick={() => {
            setOrderFilter("latest");
          }}
          className="px-0 xl:px-5  text-start text-sm text-slate-700 font-bold hover:text-cyan-500"
        >
          New Arrivals
        </Link>
      </div>
    </motion.div>
  );
};
