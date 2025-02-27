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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Link } from "react-router-dom";
import { Pencil, MoreHorizontal, PrinterCheck } from "lucide-react";

import Pagination from "@/customComponents/Pagination/Pagination";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import Cancel from "./Cancel";

const Index = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [openReceiptType, setOpenReceiptType] = useState(false);
  const [receiptType, setReceiptType] = useState("");
  const [receiptName, setReceiptName] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [receiptAmount, setReceiptAmount] = useState("");

  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const toggleSearchSection = () => {
    setIsSearchVisible((prev) => !prev); // Toggle between true and false
  };

  const {
    data: allReceiptTypesData,
    isLoading: isAllReceiptTypesDataLoading,
    isError: isAllReceiptTypesDataError,
  } = useQuery({
    queryKey: ["allReceiptTypes"], // This is the query key
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/all_select_receipt_types`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data?.data; // Return the fetched data
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const {
    data: ReceiptsData,
    isLoading: isReceiptsDataLoading,
    isError: isReceiptsDataError,
  } = useQuery({
    queryKey: [
      "receipts",
      currentPage,
      search,
      fromDate,
      toDate,
      receiptType,
      receiptNumber,
      receiptName,
      receiptAmount,
    ], // This is the query key
    queryFn: async () => {
      try {
        const response = await axios.get("/api/receipts", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: currentPage,
            search: search,
            fromDate: fromDate,
            toDate: toDate,
            receiptType: receiptType,
            receiptName: receiptName,
            receiptNumber: receiptNumber,
            receiptAmount: receiptAmount,
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
  const { Receipts, pagination } = ReceiptsData || {};
  const { current_page, last_page, total, per_page } = pagination || {}; // Destructure pagination data

  // pagination end

  if (isReceiptsDataError) {
    return <p>Error fetching data</p>;
  }

  const handlePrint = async (receiptId) => {
    try {
      const response = await axios.get(`/api/generate_receipt/${receiptId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Ensure the response is a blob (PDF file)
      });

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);

      // Open a new window or tab with the PDF
      const newWindow = window.open(url, "_blank");

      // Optionally, check if the window was successfully opened
      if (!newWindow) {
        toast.error("Unable to open the PDF in a new window.");
      }

      // Invalidate the queries related to the "lead" data
      queryClient.invalidateQueries("receipts");
      toast.success("Receipt Printed Successfully");
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
          toast.error("An error occurred while printing the Receipt");
        }
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  const clearSearch = () => {
    setFromDate("");
    setToDate("");
    setReceiptName("");
    setReceiptNumber("");
    setReceiptAmount("");
    setReceiptType("");
  };

  return (
    <>
      <div className="w-full p-5">
        <div className="w-full mb-7 flex justify-end text-right md:pr-6">
          <Button
            onClick={toggleSearchSection}
            variant=""
            className="text-sm mr-4 dark:text-white shadow-xl bg-blue-600 hover:bg-blue-700"
          >
            Search Receipts
          </Button>
          <Button
            onClick={() => navigate("/receipts/create")}
            variant=""
            className="text-sm dark:text-white shadow-xl bg-blue-600 hover:bg-blue-700"
          >
            Add Receipt
          </Button>
        </div>
        {isSearchVisible && (
          <div className="px-5 my-3 dark:bg-background pt-1 w-full bg-white shadow-xl border rounded-md">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl py-3 font-semibold leading-none tracking-tight">
                Search
              </h2>
              <Button
                variant="ghost"
                onClick={clearSearch}
                className="bg-red-600 mt-3 w-20 text-white hover:bg-red-700 hover:text-white"
              >
                Clear
              </Button>
            </div>
            <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="devta_id">
                  Receipt Type:
                </Label>
                <Select value={receiptType} onValueChange={setReceiptType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select receipt type" />
                  </SelectTrigger>
                  <SelectContent className="pb-10">
                    <SelectGroup>
                      <SelectLabel>Select receipt type</SelectLabel>
                      {allReceiptTypesData?.ReceiptTypes &&
                        allReceiptTypesData?.ReceiptTypes.map((receiptType) => (
                          <SelectItem value={String(receiptType.receipt_type)}>
                            {receiptType.receipt_type}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="devta_name">
                  Name:
                </Label>
                <Input
                  value={receiptName}
                  onChange={(e) => {
                    setReceiptName(e.target.value);
                  }}
                  id="to_date"
                  className=" mt-1"
                  type="text"
                  placeholder="Enter name."
                />
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="devta_name">
                  Receipt No:
                </Label>
                <Input
                  value={receiptNumber}
                  onChange={(e) => {
                    setReceiptNumber(e.target.value);
                  }}
                  id="to_date"
                  className=" mt-1"
                  type="text"
                  placeholder="Enter receipt no."
                />
              </div>
            </div>
            <div className="w-full mb-8 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="amount">
                  Amount:
                </Label>
                <Input
                  value={receiptAmount}
                  onChange={(e) => {
                    setReceiptAmount(e.target.value);
                  }}
                  id="to_date"
                  className=" mt-1"
                  type="text"
                  placeholder="Enter Amount"
                />
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="devta_name">
                  From Date:
                </Label>
                <input
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                  }}
                  id="from_date"
                  className=" dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                  type="date"
                  placeholder="Enter To date"
                />
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="devta_name">
                  To Date:
                </Label>
                <input
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                  }}
                  id="to_date"
                  className=" dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                  type="date"
                  placeholder="Enter To date"
                />
              </div>
            </div>
          </div>
        )}
        <div className="px-5 dark:bg-background pt-1 w-full bg-white shadow-xl border rounded-md">
          <div className="w-full py-3 flex flex-col gap-2 md:flex-row justify-between items-center">
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              Receipts
            </h2>
            {/* search field here */}
            {/* <div className="relative p-0.5 ">
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
                placeholder="Search for Receipts"
              />
            </div> */}
            {/* end */}

            {/* <Button
              onClick={toggleSearchSection}
              variant=""
              className="text-sm mr-4 dark:text-white shadow-xl bg-blue-600 hover:bg-blue-700"
            >
              Search Receipts
            </Button> */}
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
                <TableHead className="p-2">Receipt No</TableHead>
                <TableHead className="p-2">Receipt Type</TableHead>
                <TableHead className="p-2">Receipt Date</TableHead>
                <TableHead className="p-2">Name</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Receipts &&
                Receipts.map((receipt) => (
                  <TableRow
                    key={receipt.id}
                    // className={`${
                    //   receipt.cancelled ? 'line-through text-gray-500' : '' // Conditional line-through for deleted rows
                    // } dark:border-b dark:border-gray-600`}
                    className={`${
                      receipt.cancelled
                        ? "relative" // Add a bottom border for strike-through effect
                        : ""
                    } dark:border-b dark:border-gray-600`}
                  >
                    <TableCell className="font-medium p-2">
                      {receipt.receipt_no}
                      {/* {new Date(denomination.deposit_date).toLocaleDateString("en-GB")} */}
                    </TableCell>
                    <TableCell className="font-medium p-2">
                      {receipt.receipt_type}
                    </TableCell>
                    <TableCell className="font-medium p-2">
                      {/* {poojaDate.pooja_date} */}
                      {new Date(receipt.receipt_date).toLocaleDateString(
                        "en-GB"
                      )}
                    </TableCell>
                    <TableCell className="font-medium p-2">
                      {receipt.name}
                    </TableCell>
                    <TableCell className="text-right font-medium p-2">
                      ₹{receipt.amount}
                    </TableCell>

                    <TableCell className="text-right gap-1 flex items-center justify-end p-2 ">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white hover:text-white text-sm justify-start"
                        onClick={() => handlePrint(receipt.id)}
                      >
                        <PrinterCheck size={16} /> Print
                      </Button>{" "}
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
                              navigate(`/receipts/${receipt.id}/edit`)
                            }
                          >
                            <Pencil size={16} /> View
                          </Button>
                          {/* print button start */}

                          {/* <AlertDialog>
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
                                  Are you sure you want to print the Receipt?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={() => handlePrint(receipt.id)}
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog> */}
                          {!receipt.cancelled && (
                            <div className="w-full">
                              <Cancel id={receipt.id} />
                            </div>
                          )}
                          {/* print button end */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    {receipt.cancelled ? (
                      <div
                        className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-500"
                        style={{
                          transform: "translateY(-50%)", // Vertically center the line in the row
                        }}
                      ></div>
                    ) : (
                      ""
                    )}
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

// import { PhoneInput } from "react-international-phone";
// import "react-international-phone/style.css"; // Import styles for the phone input
// import { useRef, useEffect } from "react";

// <div className="relative">
//   <Label className="font-normal" htmlFor="mobile">
//     Mobile:
//   </Label>
//   <Controller
//     name="mobile"
//     control={control}
//     render={({ field }) => {
//       const phoneInputRef = useRef(null);

//       useEffect(() => {
//         if (phoneInputRef.current) {
//           const dropdownElement =
//             phoneInputRef.current.querySelector(".react-phone-input-2__select");

//           // Disable tabbing to the country dropdown
//           if (dropdownElement) {
//             dropdownElement.setAttribute("tabIndex", "-1");
//           }
//         }
//       }, []);

//       return (
//         <PhoneInput
//           {...field}
//           ref={phoneInputRef}
//           defaultCountry="IN"
//           id="mobile"
//           name="mobile"
//           placeholder="Enter mobile number"
//           inputStyle={{ minWidth: "17rem" }}
//           className="mt-1"
//           // Ensure the phone number field (input) is tabbable and gets focused
//           tabIndex={0}
//           inputProps={{
//             tabIndex: 0, // Ensure the phone number input field is tabbable
//           }}
//           dropdownProps={{
//             tabIndex: -1, // Skip the country code dropdown from tabbing
//           }}
//         />
//       );
//     }}
//   />
//   {errors.mobile && (
//     <p className="absolute text-red-500 text-sm mt-1 left-0">
//       {errors.mobile.message}
//     </p>
//   )}
// </div>
