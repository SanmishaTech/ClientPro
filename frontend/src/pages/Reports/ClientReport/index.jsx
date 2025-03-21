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
  mediclaim_insurance: z.coerce.number().min(0),
  term_plan: z.coerce.number().min(0),
  lic: z.coerce.number().min(0),
  loan: z.coerce.number().min(0),
  general_insurance: z.coerce.number().min(0),
  demat_account: z.coerce.number().min(0),
  mutual_fund: z.coerce.number().min(0),
});

const index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const queryClient = useQueryClient();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const navigate = useNavigate();
  const defaultValues = {
    from_date: "",
    to_date: "",
    mediclaim_insurance: "",
    term_plan: "",
    lic: "",
    loan: "",
    general_insurance: "",
    demat_account: "",
    mutual_fund: "",
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
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
      const response = await axios.post(`/api/client_report`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Ensure the response is a blob (PDF file)
      });

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      // link.download = `AllReceiptReport-${Date.now()}.pdf`; // Use current timestamp for unique file name
      const currentDate = new Date();
      const day = ("0" + currentDate.getDate()).slice(-2); // Ensure two digits for day
      const month = ("0" + (currentDate.getMonth() + 1)).slice(-2); // Ensure two digits for month
      const year = currentDate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;
      link.href = url;
      link.download = `ClientReport_${formattedDate}.pdf`; // Use formatted date in the filename

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
            toast.error("At least one checkbox should be checked.");
          }
        } else {
          console.error("Error:", error);
          toast.error("At least one checkbox should be checked.");
        }
      } else {
        console.error("Unexpected error:", error);
        toast.error("At least one checkbox should be checked.");
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

  const onSubmit = (data) => {
    setIsLoading(true);
    // storeMutation.mutate(data);

    handlePrint(data);
    setIsLoading(false);
  };

  const handleSelectAllChange = () => {
    const newState = !selectAll;
    setSelectAll(newState);

    const value = newState ? true : false;
    setValue("mediclaim_insurance", value);
    setValue("term_plan", value);
    setValue("lic", value);
    setValue("loan", value);
    setValue("general_insurance", value);
    setValue("demat_account", value);
    setValue("mutual_fund", value);
  };

  return (
    <>
      <div className="p-5">
        <div className="w-full mb-7">
          <h1 className="text-4xl">Report</h1>
        </div>
        <div className="px-5 pb-7 dark:bg-background pt-1 w-full bg-white shadow-lg border  rounded-md">
          <div className="w-full py-3 flex justify-start items-center">
            <h2 className="text-lg  font-normal">Client Report</h2>
          </div>
          {/* row starts */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full mb-6 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
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
                      className=" dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
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
              <div className="relative flex gap-2 mt-10  md:pl-2 ">
                <Controller
                  name="selectAll"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="selectAll"
                      {...field}
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                      type="checkbox"
                      className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                  )}
                />
                <Label className="font-normal" htmlFor="selectAll">
                  Select All
                </Label>
                {errors.selectAll && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.selectAll.message}
                  </p>
                )}
              </div>
            </div>
            {/* <h2 className="text-2xl mb-2">categories</h2> */}
            <div className="w-full mb-5 grid grid-cols-1 md:grid-cols-5 gap-7 md:gap-4">
              <div className="relative flex gap-2  md:pl-2 ">
                <Controller
                  name="mediclaim_insurance"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="mediclaim_insurance"
                      {...field}
                      checked={field.value}
                      type="checkbox"
                      className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                  )}
                />
                <Label className="font-normal" htmlFor="mediclaim_insurance">
                  Mediclaim Insurance
                </Label>
                {errors.mediclaim_insurance && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.mediclaim_insurance.message}
                  </p>
                )}
              </div>
              <div className="relative flex gap-2  md:pl-2 ">
                <Controller
                  name="term_plan"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="term_plan"
                      {...field}
                      checked={field.value}
                      type="checkbox"
                      className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                  )}
                />
                <Label className="font-normal" htmlFor="term_plan">
                  Term Plan
                </Label>
                {errors.term_plan && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.term_plan.message}
                  </p>
                )}
              </div>
              <div className="relative flex gap-2  md:pl-2 ">
                <Controller
                  name="lic"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="lic"
                      {...field}
                      checked={field.value}
                      type="checkbox"
                      className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                  )}
                />
                <Label className="font-normal" htmlFor="lic">
                  LIC
                </Label>
                {errors.lic && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.lic.message}
                  </p>
                )}
              </div>
              <div className="relative flex gap-2  md:pl-2 ">
                <Controller
                  name="loan"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="loan"
                      {...field}
                      checked={field.value}
                      type="checkbox"
                      className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                  )}
                />
                <Label className="font-normal" htmlFor="loan">
                  Loan
                </Label>
                {errors.loan && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.loan.message}
                  </p>
                )}
              </div>
              <div className="relative flex gap-2  md:pl-2 ">
                <Controller
                  name="general_insurance"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="general_insurance"
                      {...field}
                      checked={field.value}
                      type="checkbox"
                      className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                  )}
                />
                <Label className="font-normal" htmlFor="general_insurance">
                  General Insurance
                </Label>
                {errors.general_insurance && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.general_insurance.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full mb-5 grid grid-cols-1 md:grid-cols-5 gap-7 md:gap-4">
              <div className="relative flex gap-2 md:pl-2 ">
                <Controller
                  name="demat_account"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="demat_account"
                      {...field}
                      checked={field.value}
                      type="checkbox"
                      className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                  )}
                />
                <Label className="font-normal" htmlFor="demat_account">
                  Demat Account
                </Label>
                {errors.demat_account && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.demat_account.message}
                  </p>
                )}
              </div>
              <div className="relative flex gap-2 md:pl-2 ">
                <Controller
                  name="mutual_fund"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="mutual_fund"
                      {...field}
                      checked={field.value}
                      type="checkbox"
                      className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                  )}
                />
                <Label className="font-normal" htmlFor="mutual_fund">
                  Mutual Fund
                </Label>
                {errors.mutual_fund && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.mutual_fund.message}
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
