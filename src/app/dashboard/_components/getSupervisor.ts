"use server";
import { headers } from "next/headers";

const getSupervisor = async () => {
  const requestHeaders = headers();

  const supervisorInfo = {
    email: (await requestHeaders).get("x-user-email"),
    role: (await requestHeaders).get("x-user-role"),
    id: (await requestHeaders).get("x-user-id"),
  };
  return supervisorInfo;
};

export default getSupervisor;
