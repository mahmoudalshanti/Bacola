import getSupervisor from "../_components/getSupervisor";
import ReplaceEmail from "./_components/ReplaceEmail";
import {
  actionGetManagers,
  getPageManagers,
} from "../_actions/actionDashboard";
import AddManager from "./_components/AddManager";
import ManagerTabel from "./_components/ManagerTabel";

async function Page() {
  let managers: {
    currentPage: Manager[];
    no: number;
    pages: number;
    count: number;
  };

  let supervisor: Manager | Admin | null;

  try {
    managers = (await actionGetManagers(await getPageManagers())) as {
      currentPage: Manager[];
      no: number;
      pages: number;
      count: number;
    };

    if ("errMsg" in managers) {
      if (managers.errMsg) throw new Error(managers.errMsg as string);
    }
  } catch (err) {
    managers = { currentPage: [], count: 0, no: 0, pages: 0 };
    console.log("Something went Wrong!", err);
  }

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
    <div>
      <div className="w-full max-w-md p-4">
        <p className="text-2xl font-semibold text-black">Account Profile</p>
        <div className="mt-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="h-16 w-16 rounded-full cursor-pointer bg-green-700 text-white flex justify-center items-center text-3xl">
              {supervisor?.email?.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-base font-medium text-black">
                Email:{" "}
                <span className="ml-1 font-bold">{supervisor?.email}</span>
              </p>
              <p className="text-base font-medium text-black">
                Role: <span className="ml-1 font-bold">{supervisor?.role}</span>
              </p>
            </div>
            <div className="text-black bg-gray-200 rounded-full text-sm p-2 whitespace-nowrap">
              Currency: <span className="font-semibold">USD</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-16">
        <p className="text-2xl font-semibold text-black mb-5">
          Account Settings
        </p>
        <ReplaceEmail
          supervisor={supervisor || { email: "", id: "", role: "" }}
        />

        <p className="text-2xl font-semibold text-black mt-14 mb-5">
          Manager Settings
        </p>

        {supervisor?.role === "admin" && (
          <AddManager
            supervisor={supervisor || { email: "", id: "", role: "" }}
          />
        )}
        {supervisor?.role === "admin" && (
          <ManagerTabel
            managers={managers.currentPage}
            page={managers.no}
            pagesServer={managers.pages}
            countServer={managers.count}
          />
        )}
      </div>
    </div>
  );
}

export default Page;
