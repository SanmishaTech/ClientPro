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
  // n_2000: z.coerce.number().optional(),
  n_500: z.coerce.number().optional(),
  n_200: z.coerce.number().optional(),
  n_100: z.coerce.number().optional(),
  n_50: z.coerce.number().optional(),
  n_20: z.coerce.number().optional(),
  n_10: z.coerce.number().optional(),
  c_20: z.coerce.number().optional(),
  c_10: z.coerce.number().optional(),
  c_5: z.coerce.number().optional(),
  c_2: z.coerce.number().optional(),
  c_1: z.coerce.number().optional(),
  amount: z.coerce.number().min(0.01, { message: "amount field is required" }),
  deposit_date: z.string().min(1, "deposit date field is required"),
});

const Update = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const navigate = useNavigate();

  const defaultValues = {
    // n_2000: "",
    n_500: "",
    n_200: "",
    n_100: "",
    n_50: "",
    n_20: "",
    n_10: "",
    c_20: "",
    c_10: "",
    c_5: "",
    c_2: "",
    c_1: "",
    deposit_date: "",
    amount: "",
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    watch,
  } = useForm({ resolver: zodResolver(formSchema), defaultValues });

  const {
    data: editDenomination,
    isLoading: isEditDenominationDataLoading,
    isError: isEditDenominationDataError,
  } = useQuery({
    queryKey: ["editDenomination", id], // This is the query key
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/denominations/${id}`, {
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
    if (editDenomination) {
      // setValue("n_2000", editDenomination.Denomination?.n_2000);
      setValue("n_500", editDenomination.Denomination?.n_500);
      setValue("n_200", editDenomination.Denomination?.n_200);
      setValue("n_100", editDenomination.Denomination?.n_100);
      setValue("n_50", editDenomination.Denomination?.n_50);
      setValue("n_20", editDenomination.Denomination?.n_20);
      setValue("n_10", editDenomination.Denomination?.n_10);
      setValue("c_20", editDenomination.Denomination?.c_20);
      setValue("c_10", editDenomination.Denomination?.c_10);
      setValue("c_5", editDenomination.Denomination?.c_5);
      setValue("c_2", editDenomination.Denomination?.c_2);
      setValue("c_1", editDenomination.Denomination?.c_1);
      setValue("amount", editDenomination.Denomination?.amount);
      setValue("deposit_date", editDenomination.Denomination?.deposit_date);
    }
  }, [editDenomination, setValue]);

  const denominations = watch([
    // "n_2000",
    "n_500",
    "n_200",
    "n_100",
    "n_50",
    "n_20",
    "n_10",
    "c_20",
    "c_10",
    "c_5",
    "c_2",
    "c_1",
  ]);

  // Effect to calculate the total amount whenever denominations change
  useEffect(() => {
    const totalAmount = // (denominations[0] || 0) * 2000 + // n_2000
      (
        (denominations[0] || 0) * 500 + // n_500
        (denominations[1] || 0) * 200 + // n_200
        (denominations[2] || 0) * 100 + // n_100
        (denominations[3] || 0) * 50 + // n_50
        (denominations[4] || 0) * 20 + // n_20
        (denominations[5] || 0) * 10 + // n_10
        (denominations[6] || 0) * 20 + // c_20
        (denominations[7] || 0) * 10 + // c_10
        (denominations[8] || 0) * 5 + // c_5
        (denominations[9] || 0) * 2 + // c_2
        (denominations[10] || 0) * 1
      ) // c_1
        .toFixed(2);

    setValue("amount", totalAmount);
  }, [denominations, setValue]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(`/api/denominations/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the Bearer token
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("denominations");

      toast.success("Denomination Updated Successfully");
      setIsLoading(false);
      navigate("/denominations");
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error("Faild to update denomination");
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
                onClick={() => navigate("/denominations")}
                className="p-0 text-blue-700 text-sm font-light"
                variant="link"
              >
                Denominations
              </Button>
            </span>
            <span className="text-gray-400">/</span>
            <span className="dark:text-gray-300">Edit</span>
          </div>
        </div>
        {/* breadcrumb ends */}

        {/* form style strat */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-5 pb-4 mb-5 dark:bg-background pt-1 w-full bg-white shadow-lg border  rounded-md">
            <div className="w-full py-3 flex justify-start items-center">
              <h2 className="text-lg  font-normal">Deposit Details</h2>
            </div>
            <div className="w-full mb-8 grid grid-cols-1 md:grid-cols-4 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="deposit_date">
                  Deposit date:<span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="deposit_date"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="deposit_date"
                      className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                      type="date"
                      placeholder="Enter date"
                    />
                  )}
                />
                {errors.deposit_date && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.deposit_date.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="px-5 pb-7 mb-5 dark:bg-background pt-1 w-full bg-white shadow-lg border  rounded-md">
            <div className="w-full py-3 flex justify-start items-center">
              <h2 className="text-lg  font-normal">Notes Denominations</h2>
            </div>
            {/* row starts */}
            <div className="w-full mb-8 grid grid-cols-1 md:grid-cols-4 gap-7 md:gap-4">
              {/* <div className="relative">
                <Label className="font-normal" htmlFor="pooja_type">
                  2000 x:
                </Label>
                <Controller
                  name="n_2000"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="n_2000"
                      className="mt-1"
                      type="number"
                      placeholder="Enter amount"
                    />
                  )}
                />
                {errors.n_2000 && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.n_2000.message}
                  </p>
                )}
              </div> */}
              <div className="relative">
                <Label className="font-normal" htmlFor="n_500">
                  500 x:
                </Label>
                <Controller
                  name="n_500"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="n_500"
                      className="mt-1"
                      type="number"
                      placeholder="Enter amount"
                    />
                  )}
                />
                {errors.n_500 && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.n_500.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="n_200">
                  200 x:
                </Label>
                <Controller
                  name="n_200"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="n_200"
                      className="mt-1"
                      type="number"
                      placeholder="Enter amount"
                    />
                  )}
                />
                {errors.n_200 && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.n_200.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="n_100">
                  100 x:
                </Label>
                <Controller
                  name="n_100"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="n_100"
                      className="mt-1"
                      type="number"
                      placeholder="Enter amount"
                    />
                  )}
                />
                {errors.n_100 && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.n_100.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="n_50">
                  50 x:
                </Label>
                <Controller
                  name="n_50"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="n_50"
                      className="mt-1"
                      type="number"
                      placeholder="Enter amount"
                    />
                  )}
                />
                {errors.n_50 && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.n_50.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full mb-8 grid grid-cols-1 md:grid-cols-4 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="n_20">
                  20 x:
                </Label>
                <Controller
                  name="n_20"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="n_20"
                      className="mt-1"
                      type="number"
                      placeholder="Enter amount"
                    />
                  )}
                />
                {errors.n_20 && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.n_20.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="n_10">
                  10 x:
                </Label>
                <Controller
                  name="n_10"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="n_10"
                      className="mt-1"
                      type="number"
                      placeholder="Enter amount"
                    />
                  )}
                />
                {errors.n_10 && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.n_10.message}
                  </p>
                )}
              </div>
            </div>
            {/* row ends */}
          </div>

          <div className="px-5 pb-7 dark:bg-background pt-1 w-full bg-white shadow-lg border  rounded-md">
            <div className="w-full py-3 flex justify-start items-center">
              <h2 className="text-lg  font-normal">Coins Denominations</h2>
            </div>
            {/* row starts */}
            <div className="w-full mb-8 grid grid-cols-1 md:grid-cols-4 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="c_20">
                  20 x:
                </Label>
                <Controller
                  name="c_20"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="c_20"
                      className="mt-1"
                      type="number"
                      placeholder="Enter amount"
                    />
                  )}
                />
                {errors.c_20 && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.c_20.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="c_10">
                  10 x:
                </Label>
                <Controller
                  name="c_10"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="c_10"
                      className="mt-1"
                      type="number"
                      placeholder="Enter amount"
                    />
                  )}
                />
                {errors.c_10 && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.c_10.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="c_5">
                  5 x:
                </Label>
                <Controller
                  name="c_5"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="c_5"
                      className="mt-1"
                      type="number"
                      placeholder="Enter amount"
                    />
                  )}
                />
                {errors.c_5 && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.c_5.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="c_2">
                  2 x:
                </Label>
                <Controller
                  name="c_2"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="c_2"
                      className="mt-1"
                      type="number"
                      placeholder="Enter amount"
                    />
                  )}
                />
                {errors.c_2 && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.c_2.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full mb-8 grid grid-cols-1 md:grid-cols-4 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="c_1">
                  1 x:
                </Label>
                <Controller
                  name="c_1"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="c_1"
                      className="mt-1"
                      type="number"
                      placeholder="Enter amount"
                    />
                  )}
                />
                {errors.c_1 && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.c_1.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full mb-8 grid grid-cols-1 border-t-2 dark:border-gray-600 pt-3 md:grid-cols-4 gap-7 md:gap-4">
              <div className="relative  md:col-start-4">
                <Label className="font-normal" htmlFor="amount">
                  Total Amount:<span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="amount"
                      className="dark:bg-[var(--foreground)] mt-1 bg-gray-100"
                      readOnly
                      type="number"
                      placeholder="Enter amount"
                    />
                  )}
                />
                {errors.amount && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.amount.message}
                  </p>
                )}
              </div>
            </div>
            {/* row ends */}
            <div className="w-full gap-4 mt-4 flex justify-end items-center">
              <Button
                type="button"
                className="dark:text-white shadow-xl bg-red-600 hover:bg-red-700"
                onClick={() => navigate("/denominations")}
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
          </div>
        </form>
      </div>
    </>
  );
};

export default Update;
