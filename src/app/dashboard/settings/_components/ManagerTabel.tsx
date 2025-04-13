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

import React, { useState, useEffect } from "react";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  actionDeleteManager,
  actionPageNextManagers,
  actionPagePrevManagers,
} from "../../_actions/actionDashboard";
import Loading from "@/components/Loading";
import { DrawerDialog } from "@/components/Drawer";

function ManagerTabel({
  pagesServer,
  countServer,
  managers,
  page,
}: {
  pagesServer: number;
  countServer: number;
  managers: Manager[];
  page: number;
}) {
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [deleteManager, setDeleteManager] = useState<Manager | null>(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);

  const handelDeleteManager = async (email: string): Promise<void> => {
    try {
      setLoadingDelete(true);
      const data = await actionDeleteManager(email);

      if (data && "errMsg" in data && data.errMsg) {
        throw new Error(data.errMsg);
      } else {
        setLoadingDelete(false);
        setDeleteManager(null);
        setOpenConfirmDelete(false);
      }
    } catch (err) {
      console.error("Something went Error!", err);
    }
  };

  return (
    <div className="mt-10 w-full">
      {/* Header for the Manager list */}
      <p className="text-slate-800 font-semibold mb-1">
        Lists <span className="text-slate-900 font-bold">Manager</span> email
      </p>
      <p className="text-slate-700 font-semibold mb-1 text-sm flex justify-end w-full">
        {countServer} Manager(s) found, pages {pagesServer}
      </p>

      <div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-700 hover:bg-gray-700">
              <TableHead className="w-[100px] text-white">Id</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Role</TableHead>
              <TableHead className="text-white">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {managers.length > 0 ? (
              managers.map((manager) => {
                return (
                  <TableRow
                    key={manager.id}
                    className="bg-gray-200 hover:bg-gray-300"
                  >
                    <TableCell className="font-semibold text-black">
                      {manager.id}
                    </TableCell>
                    <TableCell className="text-black">
                      {manager.email}
                    </TableCell>
                    <TableCell className="text-black">{manager.role}</TableCell>
                    <TableCell className="text-black flex items-center cursor-pointer">
                      {/* Trash icon to delete the manager */}
                      <Trash
                        className="text-red-600 size-4 mr-2"
                        onClick={() => {
                          setDeleteManager(manager); // Set manager to be deleted
                          setOpenConfirmDelete(true); // Open confirmation dialog
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  No managers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationTable page={page} pages={pagesServer} />

      <DrawerDialog
        content={
          <div className="p-5 flex items-center">
            <div className="w-full">
              <p className="text-slate-800 font-semibold mb-2">
                Are you sure you want to delete "{deleteManager?.email}"?
              </p>
              <Button
                disabled={loadingDelete}
                className="w-full bg-red-700 hover:bg-red-600"
                onClick={() =>
                  deleteManager && handelDeleteManager(deleteManager.email)
                }
              >
                {loadingDelete ? <Loading /> : "Delete"}{" "}
              </Button>
            </div>
          </div>
        }
        open={openConfirmDelete}
        setOpen={setOpenConfirmDelete}
      />
    </div>
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

  const handlePrevPage = async (): Promise<void> => {
    setLoadingPrev(true);
    const newPage = await actionPagePrevManagers();
    setPage(newPage);
    setLoadingPrev(false);
  };

  const handleNextPage = async (): Promise<void> => {
    setLoadingNext(true);
    const newPage = await actionPageNextManagers();
    setPage(newPage);
    setLoadingNext(false);
  };

  return (
    <Pagination className="mt-10 mb-3">
      <PaginationContent>
        <PaginationItem>
          <Button
            onClick={handlePrevPage}
            className={`bg-gray-700 hover:bg-slate-600 ${
              page === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={page === 1 || loadingPrev}
          >
            {loadingPrev ? <Loading /> : "Previous"}{" "}
          </Button>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink className="bg-gray-700 hover:bg-gray-700 hover:text-white">
            {page}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <Button
            onClick={handleNextPage}
            className={`bg-gray-700 hover:bg-slate-600 ${
              page === pages || !pages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={page === pages || !pages || loadingNext}
          >
            {loadingNext ? <Loading /> : "Next"}{" "}
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default ManagerTabel;
