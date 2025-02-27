import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const formSchema = z.object({
  from_date: z.string().min(1, "From date filed is required."),
  to_date: z.string().min(1, "To date filed is required."),
  receipt_head: z.string().optional(),
});

const index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const navigate = useNavigate();
  const defaultValues = {
    from_date: "",
    to_date: "",
    receipt_head: "",
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ resolver: zodResolver(formSchema), defaultValues });

  //   const handlePrint = async (data) => {
  //     try {
  //       const response = await axios.post(`/api/all_receipt_report`, data, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         responseType: "blob", // To ensure the response is a blob (PDF file)
  //       });

  //       const blob = response.data;
  //       const url = window.URL.createObjectURL(blob);
  //       const link = document.createElement("a");

  //       link.href = url;
  //       link.download = `receipt-${receiptId}.pdf`;

  //       document.body.appendChild(link);

  //       link.click();

  //       document.body.removeChild(link);

  //       // Invalidate the queries related to the "lead" data
  //       queryClient.invalidateQueries("receipts");
  //       toast.success("Receipt Printed Successfully");
  //     } catch (error) {
  //       // Handle errors (both response errors and network errors)
  //       if (axios.isAxiosError(error)) {
  //         if (error.response) {
  //           const errorData = error.response.data;
  //           if (error.response.status === 401 && errorData.status === false) {
  //             toast.error(errorData.errors.error);
  //           } else {
  //             toast.error("Failed to generate Receipt");
  //           }
  //         } else {
  //           // Network or other errors
  //           console.error("Error:", error);
  //           toast.error("An error occurred while printing the Receipt");
  //         }
  //       } else {
  //         console.error("Unexpected error:", error);
  //         toast.error("An unexpected error occurred");
  //       }
  //     }
  //   };

  const handlePrint = async (data) => {
    try {
      const response = await axios.post(`/api/summary_receipt_report`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Ensure the response is a blob (PDF file)
      });

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      const currentDate = new Date();
      const day = ("0" + currentDate.getDate()).slice(-2); // Ensure two digits for day
      const month = ("0" + (currentDate.getMonth() + 1)).slice(-2); // Ensure two digits for month
      const year = currentDate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;
      link.href = url;
      link.download = `ReceiptSummary_${formattedDate}.pdf`; // Use current timestamp for unique file name

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Invalidate the queries related to the "lead" data
      toast.success("Report Printed Successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorData = error.response.data;
          if (error.response.status === 401 && errorData.status === false) {
            toast.error(errorData.errors.error);
          } else {
            toast.error("Failed to generate Report");
          }
        } else {
          console.error("Error:", error);
          toast.error("An error occurred while printing the Report");
        }
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  //   const storeMutation = useMutation({
  //     mutationFn: async (data) => {
  //       const response = await axios.post("/api/all_receipt_report", data, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`, // Include the Bearer token
  //         },
  //       });
  //       return response.data;
  //     },
  //     onSuccess: (data) => {
  //       toast.success("Report Generated Successfully");
  //       setIsLoading(false);
  //     },
  //     onError: (error) => {
  //       setIsLoading(false);
  //       if (error.response && error.response.data.errors) {
  //         const serverStatus = error.response.data.status;
  //         const serverErrors = error.response.data.errors;
  //         if (serverStatus === false) {
  //           toast.error("Failed to Generate report.");
  //         } else {
  //           toast.error("Failed to Generate report.");
  //         }
  //       } else {
  //         toast.error("Failed to Generate report.");
  //       }
  //     },
  //   });

  const {
    data: allReceiptHeadsData,
    isLoading: isAllReceiptHeadsDataLoading,
    isError: isAllReceiptHeadsDataError,
  } = useQuery({
    queryKey: ["allReceiptHeads"], // This is the query key
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/all_receipt_heads`, {
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
    keepPreviousData: true, // Keep previous data until the new data is available
  });

  const onSubmit = (data) => {
    setIsLoading(true);
    // storeMutation.mutate(data);
    handlePrint(data);
    setIsLoading(false);
  };

  return (
    <>
      <div className="p-5">
        <div className="w-full mb-7">
          <h1 className="text-4xl">Report</h1>
        </div>
        <div className="px-5 pb-7 dark:bg-background pt-1 w-full bg-white shadow-lg border  rounded-md">
          <div className="w-full py-3 flex justify-start items-center">
            <h2 className="text-lg  font-normal">All Receipts Summary</h2>
          </div>
          {/* row starts */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full mb-8 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="from_date">
                  From date:<span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="from_date"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="from_date"
                      className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                      type="date"
                      placeholder="Enter from date"
                    />
                  )}
                />
                {errors.from_date && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.from_date.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="to_date">
                  To date:<span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="to_date"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="to_date"
                      className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                      type="date"
                      placeholder="Enter To date"
                    />
                  )}
                />
                {errors.to_date && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.to_date.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="receipt_head">
                  Receipt Head:
                </Label>
                <Controller
                  name="receipt_head"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select receipt head" />
                      </SelectTrigger>
                      <SelectContent className="pb-10">
                        <SelectGroup>
                          <SelectLabel>Select receipt head</SelectLabel>
                          {allReceiptHeadsData?.ReceiptHeads &&
                            Object.keys(allReceiptHeadsData?.ReceiptHeads).map(
                              (key) => (
                                <SelectItem key={key} value={key}>
                                  {allReceiptHeadsData.ReceiptHeads[key]}
                                </SelectItem>
                              )
                            )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.receipt_head && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.receipt_head.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full gap-4 mt-4 flex justify-end items-center">
              <Button
                type="button"
                className="dark:text-white shadow-xl bg-red-600 hover:bg-red-700"
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                className=" dark:text-white  shadow-xl bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" /> {/* Spinner */}
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default index;
