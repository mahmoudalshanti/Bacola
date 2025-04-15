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
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { actionContinueGoogle } from "../sign-in/_actions/actionSignIn";

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
  const { data } = useSession();
  const router = useRouter();

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

  useEffect(() => {
    const handelGoogleSignInContinue = async () => {
      try {
        if (data) {
          const result = await actionContinueGoogle(data?.user?.email || "");
          if (result.redirect === "/") {
            const user = await getUser();
            if (user?.email) setUser(user);
          } else {
            router.push(result?.redirect || "/");
          }

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
    <userContext.Provider value={{ user, setUser, setOpen, open }}>
      <>{loading ? <PageLoading /> : children}</>
    </userContext.Provider>
  );
}

export const useUser = () => {
  return useContext(userContext);
};

export default UserProvider;
