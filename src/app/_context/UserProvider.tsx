"use client";

import React, {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import getUser from "../_components/getUser";
import PageLoading from "@/components/PageLoading";
import { usePathname } from "next/navigation";

interface User {
  id: string;
  role: string;
  email: string;
}

type contextType = {
  user: User | null;
  setUser: React.Dispatch<SetStateAction<User | null>>;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  open: boolean;
};

const userContext = createContext<contextType>({
  user: null,
  setUser: () => {},
  setOpen: () => {},
  open: false,
});

function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const findUser = await getUser();
        setUser(findUser);
      } catch (err) {
        console.error("Something went Error!", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [pathname]);

  return (
    <userContext.Provider value={{ user, setUser, setOpen, open }}>
      <>{loading ? <PageLoading /> : children}</>
    </userContext.Provider>
  );
}

export const useUser = () => {
  return useContext(userContext);
};

export default UserProvider;
