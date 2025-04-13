"use client";

import { usePathname } from "next/navigation";
import React, {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type contextType = {
  open: boolean;
  openSheet: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  setOpenSheet: React.Dispatch<SetStateAction<boolean>>;
  setOrderFilter: React.Dispatch<SetStateAction<"latest" | "topOffer">>;
  orderFilter: "latest" | "topOffer";
};
const categoriesContext = createContext<contextType>({
  open: false,
  setOpen: () => {},
  setOrderFilter: () => {},
  setOpenSheet: () => {},
  openSheet: false,
  orderFilter: "latest",
});

function CategoriesMenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<boolean>(false);
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [orderFilter, setOrderFilter] = useState<"latest" | "topOffer">(
    "latest"
  );

  const location = usePathname();
  useEffect(() => {
    if (location === "/") {
      setOpen(true);
    } else setOpen(false);
  }, [location]);

  return (
    <categoriesContext.Provider
      value={{
        open,
        setOpen,
        orderFilter,
        setOrderFilter,
        openSheet,
        setOpenSheet,
      }}
    >
      {children}
    </categoriesContext.Provider>
  );
}

export const useMenu = () => {
  return useContext(categoriesContext);
};
export default CategoriesMenuProvider;
