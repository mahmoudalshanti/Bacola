"use client";

import CustomLoading from "@/components/CustomLoading";
import Input from "@/components/Input";
import { InfoIcon, Search, Trash, View } from "lucide-react";
import { KeyboardEvent, SetStateAction, useCallback, useState } from "react";
import {
  actionDeleteUser,
  actionSearchUsers,
} from "../../_actions/actionDashboard";
import { Button } from "@/components/ui/button";
import { DrawerDialog } from "@/components/Drawer";
import Loading from "@/components/Loading";

function SearchInput() {
  const [search, setSearch] = useState<string>("");
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [openError, setOpenError] = useState<boolean>(false);

  const handleSearch = async () => {
    try {
      setLoadingSearch(true);
      setErrMsg("");
      const foundUsers: User[] | {}[] = (await actionSearchUsers(search)) as
        | User[]
        | {}[];
      setUsers(foundUsers as User[]);
      setOpenSearch(true);

      if (foundUsers && "errMsg" in foundUsers) {
        if ("errMsg" in foundUsers && typeof foundUsers.errMsg === "string") {
          throw new Error(foundUsers.errMsg);
        }
      }
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Something went wrong!");
      setOpenError(true);
      console.error("Something went wrong", err);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleKeyDownSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSearch();
  };

  return (
    <div>
      <DrawerDialog
        open={openSearch}
        setOpen={setOpenSearch}
        content={
          <div className=" p-5 h-96 overflow-y-scroll">
            {users.length ? (
              users.map((user: User) => (
                <ViewUserSearch
                  key={user.id}
                  user={user}
                  setOpenSearch={setOpenSearch}
                />
              ))
            ) : (
              <p className="text-slate-700 flex items-center">
                <InfoIcon className="mr-1" /> No users found
              </p>
            )}
          </div>
        }
      />
      <div className="relative mt-5">
        <Input
          className="w-full pr-10"
          placeholder="Search users email, pending- users "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDownSearch}
        />
        <div className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer">
          {loadingSearch ? (
            <CustomLoading props="w-5 h-5 border-t-cyan-950 border-slate-300" />
          ) : (
            <Search className="text-slate-600" onClick={handleSearch} />
          )}
        </div>
      </div>
      <DrawerDialog
        content={<div className="p-5 text-red-500 ">{errMsg}</div>}
        open={openError}
        setOpen={setOpenError}
      />
    </div>
  );
}

const ViewUserSearch = ({
  user,
  setOpenSearch,
}: {
  user: User;
  setOpenSearch: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [errMsg, setErrMsg] = useState<string>("");
  const [openError, setOpenError] = useState<boolean>(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const data = await actionDeleteUser(id);
      setOpenSearch(false);

      if (data && "errMsg" in data) {
        if (data.errMsg) throw new Error(data.errMsg);
      }
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Something went wrong!");
      setOpenError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full flex items-center justify-between mt-4 mb-1 p-5 "
      key={user.id}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <p className="ml-2">{user.email}</p>
        </div>
      </div>

      <div className="flex items-center">
        <Button
          disabled={loading}
          className="w-10 bg-red-700 hover:bg-red-600"
          onClick={() => setOpenConfirmDelete(true)}
        >
          {loading ? (
            <CustomLoading props="w-5 h-5 border-t-cyan-950 border-slate-300" />
          ) : (
            <Trash />
          )}
        </Button>
      </div>

      <DrawerDialog
        content={<div className="p-5 text-red-500">{errMsg}</div>}
        open={openError}
        setOpen={setOpenError}
      />

      <DrawerDialog
        content={
          <div className="p-5">
            <p className="text-slate-800 font-semibold mb-2">
              Are you sure you want to delete "{user.email}"?
            </p>
            <Button
              disabled={loading}
              className="w-full bg-red-700 hover:bg-red-600"
              onClick={() => handleDelete(user.id)}
            >
              {loading ? <Loading /> : "Delete"}
            </Button>
          </div>
        }
        open={openConfirmDelete}
        setOpen={setOpenConfirmDelete}
      />
    </div>
  );
};

export default SearchInput;
