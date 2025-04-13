import { BarChartComponent } from "@/components/ui/BarChart";
import PendingUsers from "../_components/cards/PendingUsers";
import UsersCard from "../_components/cards/Users";
import SearchInput from "./_components/Search";
import UsersTabel from "./_components/UsersTabel";
import {
  actionGetUsers,
  actionPendingGetUsers,
  getPagePendingUsers,
  getPageUsers,
} from "../_actions/actionDashboard";
import PendingUsersTable from "./_components/PendingUsersTabel";

async function page() {
  let users: {
    currentPage: User[]; // Users to display on the current page
    no: number; // Current page number
    pages: number; // Total number of pages
    count: number; // Total number of users
  } = { currentPage: [], count: 0, no: 0, pages: 0 };

  let pendingUsers: {
    currentPage: PendingUser[];
    no: number;
    pages: number;
    count: number;
  } = { currentPage: [], count: 0, no: 0, pages: 0 };

  try {
    users = (await actionGetUsers(await getPageUsers())) as {
      currentPage: User[]; // Users to display on the current page
      no: number; // Current page number
      pages: number; // Total number of pages
      count: number; // Total number of users
    };

    if ("errMsg" in users) {
      if (users.errMsg) throw new Error(users.errMsg as string);
    }
  } catch (err) {
    console.log("Something went Wrong!", err);
  }
  try {
    pendingUsers = (await actionPendingGetUsers(
      await getPagePendingUsers()
    )) as {
      currentPage: PendingUser[];
      no: number;
      pages: number;
      count: number;
    };
  } catch (err) {
    console.log("Something went Wrong!", err);
  }

  return (
    <div>
      <p className="font-semibold text-2xl mb-5 hidden md:flex text-slate-600">
        Users Management
      </p>

      <div className="mt-5 md:flex-row flex justify-between flex-col">
        <div className="flex w-full md:w-2/3  mb-4 md:mb-0 mr-5">
          <div className="w-full h-fit">
            <div className="md:flex gap-2 w-full h-fit">
              <UsersCard users={users.count} />
              <PendingUsers pendingUsers={pendingUsers.count} />
            </div>
            <SearchInput />
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <BarChartComponent />
        </div>
      </div>
      <PendingUsersTable
        countServer={pendingUsers.count}
        page={pendingUsers.no}
        pagesServer={pendingUsers.pages}
        pendingUsers={pendingUsers.currentPage}
      />
      <br />
      <br />
      <div className="h-0.5 w-full bg-slate-300"></div>
      <br />
      <UsersTabel
        countServer={users.count}
        page={users.no}
        pagesServer={users.pages}
        users={users.currentPage}
      />
    </div>
  );
}

export default page;
