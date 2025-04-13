import React from "react";
import getSupervisor from "./getSupervisor";

async function Upbar() {
  let supervisor: Manager | Admin | null;

  try {
    const supervisorData = await getSupervisor();
    supervisor = supervisorData
      ? {
          ...supervisorData,
          id: supervisorData.id || "",
          email: supervisorData.email || "",
          role: supervisorData.role || "",
        }
      : null;
  } catch (err) {
    supervisor = null;
  }
  return (
    <nav className="flex justify-end items-center p-5  bg-slate-700">
      <div className="h-5 w-5 rounded-full cursor-pointer bg-green-700 text-white flex justify-center items-center text-lg p-4">
        {supervisor?.email.slice(0, 1).toUpperCase()}
      </div>
    </nav>
  );
}

export default Upbar;
