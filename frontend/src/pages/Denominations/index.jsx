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
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Delete from "./Delete";

const Index = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const {
    data: DenominationsData,
    isLoading: isDenominationsDataLoading,
    isError: isDenominationsDataError,
  } = useQuery({
    queryKey: ["denominations", currentPage, search], // This is the query key
    queryFn: async () => {
      try {
        const response = await axios.get("/api/denominations", {
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
  const { Denominations, pagination } = DenominationsData || {};
  const { current_page, last_page, total, per_page } = pagination || {}; // Destructure pagination data

  // pagination end

  if (isDenominationsDataError) {
    return <p>Error fetching data</p>;
  }

  const handlePrint = async (denominationId) => {
    try {
      const response = await axios.get(
        `/api/generate_denomination/${denominationId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // To ensure the response is a blob (PDF file)
        }
      );

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `denomination-${denominationId}.pdf`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      // Invalidate the queries related to the "lead" data
      queryClient.invalidateQueries("denominations");
      toast.success("Denomination Printed Successfully");
    } catch (error) {
      // Handle errors (both response errors and network errors)
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorData = error.response.data;
          if (error.response.status === 401 && errorData.status === false) {
            toast.error(errorData.errors.error);
          } else {
            toast.error("Failed to generate Receipt");
          }
        } else {
          // Network or other errors
          console.error("Error:", error);
          toast.error("An error occurred while printing the denomination");
        }
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <>
      <div className="w-full p-5">
        <div className="w-full mb-7 text-right md:pr-6">
          <Button
            onClick={() => navigate("/denominations/create")}
            variant=""
            className="text-sm dark:text-white shadow-xl bg-blue-600 hover:bg-blue-700"
          >
            Add Denominations
          </Button>
        </div>
        <div className="px-5 dark:bg-background pt-1 w-full bg-white shadow-xl border rounded-md">
          <div className="w-full py-3 flex flex-col gap-2 md:flex-row justify-between items-center">
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              Denominations
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
                placeholder="Search for Denominations"
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
                <TableHead className="p-2">Deposit Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Denominations &&
                Denominations.map((denomination) => (
                  <TableRow
                    key={denomination.id}
                    className=" dark:border-b dark:border-gray-600"
                  >
                    <TableCell className="font-medium p-2">
                      {/* {denomination.deposit_date} */}
                      {new Date(denomination.deposit_date).toLocaleDateString(
                        "en-GB"
                      )}
                    </TableCell>
                    <TableCell className=" text-right font-medium p-2">
                      ₹{denomination.amount}
                    </TableCell>

                    <TableCell className="text-right p-2 pr-5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="center"
                          className="w-full flex-col items-center flex justify-center"
                        >
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <b className="border border-gray-100 w-full"></b>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-sm justify-start"
                            onClick={() =>
                              navigate(`/denominations/${denomination.id}/edit`)
                            }
                          >
                            <Pencil size={16} /> Edit
                          </Button>
                          {/* <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-sm"
                            onClick={() => handlePrint(denomination.id)}
                          >
                            <PrinterCheck size={16} /> Print
                          </Button> */}
                          {/* print button start */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-sm justify-start"
                              >
                                <PrinterCheck size={16} /> Print
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to print the
                                  denomination?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={() => handlePrint(denomination.id)}
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          {/* print button end */}
                          <div className="w-full">
                            <Delete id={denomination.id} />
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default Index;
