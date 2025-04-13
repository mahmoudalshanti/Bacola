"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Loading from "@/components/Loading";
import {
  actionDeleteUser,
  actionPageNextUsers,
  actionPagePrevUsers,
} from "../../_actions/actionDashboard";
import { DrawerDialog } from "@/components/Drawer";

function PendingUsersTable({
  pagesServer,
  countServer,
  pendingUsers,
  page,
}: {
  pagesServer: number;
  countServer: number;
  pendingUsers: PendingUser[];
  page: number;
}) {
  const [deleteUser, setDeleteUser] = useState<PendingUser | null>(null);
  const [errMsg, setErrMsg] = useState<string>("");
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [openError, setOpenError] = useState<boolean>(false);

  const handleDeleteUser = async (id: string) => {
    try {
      setLoadingDelete(true);
      const data = await actionDeleteUser(id);

      if (data && "errMsg" in data && data.errMsg) {
        throw new Error(data.errMsg);
      } else {
        setErrMsg("");
        setOpenConfirmDelete(false);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong!";
      setErrMsg(message);
      setOpenError(true);
      setOpenConfirmDelete(false);
      console.error("Something went wrong", err);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <>
      {errMsg && (
        <DrawerDialog
          content={
            <div>
              <p className="text-red-600">{errMsg}</p>
            </div>
          }
          open={openError}
          setOpen={setOpenError}
        />
      )}
      <div className="mt-10 w-full">
        <p className="text-slate-800 font-semibold mb-1">
          Lists{" "}
          <span className="text-slate-900 font-bold">All Pending Users</span>
        </p>
        <p className="text-slate-700 font-semibold mb-1 text-sm flex justify-end w-full">
          {countServer} P-User(s) found, Page {page} of {pagesServer}
        </p>

        <div className="border rounded-lg overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-orange-900 hover:bg-orange-900 ">
                <TableHead className="w-[100px] text-white">Id</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Country</TableHead>
                <TableHead className="text-white">OAuth</TableHead>
                <TableHead className="text-white">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingUsers?.length > 0 ? (
                pendingUsers.map((user: PendingUser) => (
                  <TableRow
                    key={user?.id}
                    className="bg-gray-50 hover:bg-gray-100 even:bg-gray-100"
                  >
                    <TableCell className="font-semibold text-slate-700">
                      {user?.id}
                    </TableCell>
                    <TableCell className="font-medium text-slate-700">
                      {user?.email}
                    </TableCell>

                    <TableCell className="text-slate-700">
                      <div className="flex items-center gap-2">
                        {user?.country?.flag && (
                          <img
                            src={user.country.flag}
                            alt={user.country.name}
                            className="w-5 h-5 rounded-full"
                          />
                        )}
                        {user?.country?.name ? user?.country?.name : "UnKnown"}
                      </div>
                    </TableCell>

                    <TableCell className="font-medium text-slate-700">
                      {user.OAuth ? "YES" : "NO"}
                    </TableCell>

                    <TableCell className="text-slate-700 cursor-pointer">
                      {/* Action buttons for delete */}
                      <div className="flex items-center">
                        <Trash
                          className="text-red-600 size-4 mr-2 hover:text-red-700"
                          onClick={() => {
                            setDeleteUser(user);
                            setOpenConfirmDelete(true);
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center text-gray-500 py-4"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <PaginationTable pages={pagesServer} page={page} />

        <DrawerDialog
          content={
            <div className="p-5 flex items-center">
              <div className="w-full">
                <p className="text-slate-800 font-semibold mb-2">
                  Are you sure you want to delete "{deleteUser?.email}"?
                </p>
                <Button
                  disabled={loadingDelete}
                  className="w-full bg-red-700 hover:bg-red-600"
                  onClick={() => deleteUser && handleDeleteUser(deleteUser.id)}
                >
                  {loadingDelete ? <Loading /> : "Delete"}
                </Button>
              </div>
            </div>
          }
          open={openConfirmDelete}
          setOpen={setOpenConfirmDelete}
        />
      </div>
    </>
  );
}

const PaginationTable = ({
  pages,
  page: pageNo,
}: {
  pages: number;
  page: number;
}) => {
  const [page, setPage] = useState<number>(pageNo ? pageNo : 1);
  const [loadingNext, setLoadingNext] = useState<boolean>(false);
  const [loadingPrev, setLoadingPrev] = useState<boolean>(false);

  const handlePrevPage = async () => {
    setLoadingPrev(true);
    const newPage = await actionPagePrevUsers();
    setPage(newPage);
    setLoadingPrev(false);
  };

  const handleNextPage = async () => {
    setLoadingNext(true);
    const newPage = await actionPageNextUsers();
    setPage(newPage);
    setLoadingNext(false);
  };

  return (
    <Pagination className="mt-10 mb-3">
      <PaginationContent>
        <PaginationItem>
          <Button
            onClick={handlePrevPage}
            className={`bg-orange-900 hover:bg-orange-900 ${
              page === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={page === 1 || loadingPrev}
          >
            {loadingPrev ? <Loading /> : "Previous"}
          </Button>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink className="bg-orange-900 hover:bg-orange-900 hover:text-white">
            {page}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <Button
            onClick={handleNextPage}
            className={`bg-orange-700 hover:bg-orange-700 ${
              page === pages || !pages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={page === pages || !pages || loadingNext}
          >
            {loadingNext ? <Loading /> : "Next"}
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PendingUsersTable;
