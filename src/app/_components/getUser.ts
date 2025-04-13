"use server";

import { verifyToken } from "@/lib/utils";
import { cookies } from "next/headers";

function getUser() {
  const fetchUser = async () => {
    const token = (await cookies()).get("token")?.value;
    try {
      const decoded = await verifyToken(token ? token : "");
      return decoded;
    } catch (err) {
      return null;
    }
  };

  return fetchUser();
}

export default getUser;
