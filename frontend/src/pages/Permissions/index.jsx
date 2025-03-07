import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Link } from "react-router-dom";
import { Pencil, MoreHorizontal, PrinterCheck } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Pagination from "@/customComponents/Pagination/Pagination";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
// import Delete from "./Delete";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const {
    data: PermissionsData,
    isLoading: isPermissionsDataLoading,
    isError: isPermissionsDataError,
  } = useQuery({
    queryKey: ["permissions", currentPage, search], // This is the query key
    queryFn: async () => {
      try {
        const response = await axios.get("/api/permissions", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: currentPage,
            search: search,
          },
        });
        return response.data?.data; // Return the fetched data
      } catch (error) {
        throw new Error(error.message);
      }
    },
    keepPreviousData: true, // Keep previous data until the new data is available
  });

  // pagination start
  const { Permissions, pagination } = PermissionsData || {};
  const { current_page, last_page, total, per_page } = pagination || {}; // Destructure pagination data

  // pagination end

  const generatePermissionMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.get(`/api/generate_permissions`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the Bearer token
        },
      });
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("permissions");
      toast.success("Permissions Generated Successfully");
    },
    onError: (error) => {
      toast.success("Error while generating permission");
    },
  });
  const onPermissionGenerate = () => {
    generatePermissionMutation.mutate();
  };

  if (isPermissionsDataError) {
    return (
      <div className="m-5">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Error Loading Data.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div className="w-full p-5">
        <div className="w-full mb-7 text-right md:pr-6">
          <Button
            onClick={() => onPermissionGenerate()}
            variant=""
            className="text-sm dark:text-white shadow-xl bg-blue-600 hover:bg-blue-700"
          >
            Generate Permissions
          </Button>
        </div>
        {isPermissionsDataLoading ? (
          <div className="px-5 mt-8 pb-2 dark:bg-background pt-1 w-full bg-white   rounded-md">
            <div className="w-full pt-4 pb-6 flex flex-col gap-2 md:flex-row justify-between items-center">
              <h2 className="text-xl   font-medium leading-none tracking-tight">
                <Skeleton className="h-6 w-[220px]" />
              </h2>
              <Skeleton className="h-6 w-[220px]" />
            </div>
            <Table className="mb-2">
              <TableCaption className="mb-2">
                <div className="flex justify-end"></div>
              </TableCaption>
              <TableHeader className="dark:bg-background bg-gray-50 rounded-md">
                <TableRow>
                  <TableHead className="w-[150px]">
                    <Skeleton className="h-6 w-full" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(10)].map(
                  (
                    _,
                    index // Use 5 or however many rows you want
                  ) => (
                    <TableRow
                      key={index}
                      className="dark:border-b dark:border-gray-600"
                    >
                      <TableCell className="font-medium">
                        <Skeleton className="h-6 w-[150px]" />
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="px-5 dark:bg-background pt-1 w-full bg-white shadow-xl border rounded-md">
            <div className="w-full py-3 flex flex-col gap-2 md:flex-row justify-between items-center">
              <h2 className="text-2xl font-semibold leading-none tracking-tight">
                Permissions
              </h2>
              {/* search field here */}
              <div className="relative p-0.5 ">
                <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  id="search"
                  className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search for Permissions"
                />
              </div>
              {/* end */}
            </div>
            <Table className="mb-2">
              <TableCaption className="mb-2">
                <div className="flex justify-end">
                  <Pagination
                    className="pagination-bar"
                    currentPage={current_page}
                    totalCount={total}
                    pageSize={per_page}
                    onPageChange={(page) => setCurrentPage(page)}
                    lastPage={last_page} // Pass the last_page value here
                  />
                </div>
              </TableCaption>
              <TableHeader className="dark:bg-background bg-gray-100  rounded-md">
                <TableRow>
                  <TableHead className="">Permissions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Permissions &&
                  Permissions.map((permission) => (
                    <TableRow
                      key={permission.id}
                      className=" dark:border-b dark:border-gray-600"
                    >
                      <TableCell className="font-medium">
                        {permission.name}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
};

export default Index;
