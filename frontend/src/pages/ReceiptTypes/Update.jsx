import React, { useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const formSchema = z.object({
  receipt_type: z
    .string()
    .min(2, "Receipt type must be at least 2 characters.")
    .max(100, "Receipt type must not exceed 100 characters."),
  // .regex(
  //   /^[A-Za-z0-9\s\u0900-\u097F]+$/,
  //   'Receipt Type can only contain letters and numbers'
  // ),
  receipt_head: z.string().min(2, "Receipt head field is required."),
  special_date: z.string().optional(),
  // list_order: z.string().optional(),
  // minimum_amount: z.coerce.number().optional(),
  minimum_amount: z.coerce
    .number()
    .max(99999, "Amount must be at most 5 digits")
    .optional(),
  list_order: z.coerce
    .number()
    .max(999, "List Order must be at most 3 digits")
    .optional(),
  is_pooja: z.coerce.number().min(0, "is Pooja field is required"),
  show_special_date: z.coerce
    .number()
    .min(0, "Show Special date field is required"),
  show_remembarance: z.coerce
    .number()
    .min(0, "show remembarance field is required"),
});

const Update = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const navigate = useNavigate();

  const defaultValues = {
    receipt_type: "",
    receipt_head: "",
    special_date: "",
    minimum_amount: "",
    is_pooja: "",
    show_special_date: "",
    show_remembarance: "",
    list_order: "",
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm({ resolver: zodResolver(formSchema), defaultValues });

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

  const {
    data: editReceiptType,
    isLoading: isEditReceiptTypeDataLoading,
    isError: isEditReceiptTypeDataError,
  } = useQuery({
    queryKey: ["editReceiptType", id], // This is the query key
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/receipt_types/${id}`, {
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

  useEffect(() => {
    if (editReceiptType) {
      setValue("receipt_type", editReceiptType.ReceiptType?.receipt_type);
      setValue("receipt_head", editReceiptType.ReceiptType?.receipt_head);
      setValue("special_date", editReceiptType.ReceiptType?.special_date || "");
      setValue("minimum_amount", editReceiptType.ReceiptType?.minimum_amount);
      setValue("is_pooja", editReceiptType.ReceiptType?.is_pooja);
      setValue(
        "show_remembarance",
        editReceiptType.ReceiptType?.show_remembarance
      );
      setValue("list_order", editReceiptType.ReceiptType?.list_order || "");
      setValue(
        "show_special_date",
        editReceiptType.ReceiptType?.show_special_date
      );
    }
  }, [editReceiptType, setValue]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(`/api/receipt_types/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the Bearer token
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("receiptTypes");

      toast.success("Receipt Type Updated Successfully");
      setIsLoading(false);
      navigate("/receipt_types");
    },
    onError: (error) => {
      setIsLoading(false);
      if (error?.response && error?.response?.data?.errors) {
        const serverStatus = error?.response?.data?.status;
        const serverErrors = error?.response?.data?.errors;
        if (serverStatus === false) {
          // if (serverErrors.pooja_type) {
          //   setError("pooja_type", {
          //     type: "manual",
          //     message: serverErrors.pooja_type[0], // The error message from the server
          //   });
          //   // toast.error("The poo has already been taken.");
          // }
          toast.error("Failed to add receipt type.");
        } else {
          toast.error("Failed to add receipt type.");
        }
      } else {
        toast.error("Failed to add receipt type.");
      }
    },
  });
  const onSubmit = (data) => {
    setIsLoading(true);
    updateMutation.mutate(data);
  };

  return (
    <>
      <div className="p-5">
        {/* breadcrumb start */}
        <div className=" mb-7 text-sm">
          <div className="flex items-center space-x-2 text-gray-700">
            <span className="">
              <Button
                onClick={() => navigate("/receipt_types")}
                className="p-0 text-blue-700 text-sm font-light"
                variant="link"
              >
                Receipt Types
              </Button>
            </span>
            <span className="text-gray-400">/</span>
            <span className="dark:text-gray-300">Edit</span>
          </div>
        </div>
        {/* breadcrumb ends */}

        {/* form style strat */}
        <div className="px-5 pb-7 dark:bg-background pt-1 w-full bg-white shadow-lg border  rounded-md">
          <div className="w-full py-3 flex justify-start items-center">
            <h2 className="text-lg  font-normal">Edit Receipt Type</h2>
          </div>
          {/* row starts */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full mb-8 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="receipt_head">
                  Receipt Head: <span className="text-red-500">*</span>
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
              <div className="relative">
                <Label className="font-normal" htmlFor="receipt_type">
                  Receipt Type: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="receipt_type"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="receipt_type"
                      className="mt-1"
                      type="text"
                      placeholder="Enter receipt type"
                    />
                  )}
                />
                {errors.receipt_type && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.receipt_type.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="special_date">
                  Special date:
                </Label>
                <Controller
                  name="special_date"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="special_date"
                      className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                      type="date"
                      placeholder="Enter special date"
                    />
                  )}
                />
                {errors.special_date && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.special_date.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="minimum_amount">
                  Minimum Amount:
                </Label>
                <Controller
                  name="minimum_amount"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="minimum_amount"
                      className="mt-1"
                      type="number"
                      placeholder="Enter amount"
                    />
                  )}
                />
                {errors.minimum_amount && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.minimum_amount.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="list_order">
                  List Order:
                </Label>
                <Controller
                  name="list_order"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="list_order"
                      className="mt-1"
                      type="text"
                      placeholder="Enter list order"
                    />
                  )}
                />
                {errors.list_order && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.list_order.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full mb-8 grid grid-cols-1 md:grid-cols-5 gap-7 md:gap-4">
              <div className="relative flex gap-2 md:pt-10 md:pl-2 ">
                <Controller
                  name="is_pooja"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="is_pooja"
                      checked={field.value === 1}
                      onChange={(e) => {
                        field.onChange(e.target.checked ? 1 : 0); // Map true/false to 1/0
                      }}
                      type="checkbox"
                      className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                  )}
                />
                <Label className="font-normal" htmlFor="is_pooja">
                  Is Pooja
                </Label>
                {errors.is_pooja && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.is_pooja.message}
                  </p>
                )}
              </div>
              <div className="relative flex gap-2 md:pt-10 md:pl-2 ">
                <Controller
                  name="show_special_date"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="show_special_date"
                      checked={field.value === 1}
                      onChange={(e) => {
                        field.onChange(e.target.checked ? 1 : 0); // Map true/false to 1/0
                      }}
                      type="checkbox"
                      className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                  )}
                />
                <Label className="font-normal" htmlFor="show_special_date">
                  Show Special Date
                </Label>
                {errors.show_special_date && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.show_special_date.message}
                  </p>
                )}
              </div>
              <div className="relative flex gap-2 md:pt-10 md:pl-2 ">
                <Controller
                  name="show_remembarance"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="show_remembarance"
                      checked={field.value === 1}
                      onChange={(e) => {
                        field.onChange(e.target.checked ? 1 : 0); // Map true/false to 1/0
                      }}
                      type="checkbox"
                      className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                  )}
                />
                <Label className="font-normal" htmlFor="show_remembarance">
                  Show Remembrance
                </Label>
                {errors.show_remembarance && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.show_remembarance.message}
                  </p>
                )}
              </div>
            </div>
            {/* row ends */}
            <div className="w-full gap-4 mt-4 flex justify-end items-center">
              <Button
                type="button"
                className="dark:text-white shadow-xl bg-red-600 hover:bg-red-700"
                onClick={() => navigate("/receipt_types")}
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

export default Update;
