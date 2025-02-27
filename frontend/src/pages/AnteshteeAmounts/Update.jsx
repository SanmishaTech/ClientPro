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
  day_9_amount: z.coerce.number().min(1, "Amount field is required."),
  day_10_amount: z.coerce.number().min(1, "Amount field is required."),
  day_11_amount: z.coerce.number().min(1, "Amount field is required."),
  day_12_amount: z.coerce.number().min(1, "Amount field is required."),
  day_13_amount: z.coerce.number().min(1, "Amount field is required."),
});

const Update = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const navigate = useNavigate();

  const defaultValues = {
    day_9_amount: "0.00",
    day_10_amount: "0.00",
    day_11_amount: "0.00",
    day_12_amount: "0.00",
    day_13_amount: "0.00",
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm({ resolver: zodResolver(formSchema), defaultValues });

  const {
    data: editAnteshteeAmount,
    isLoading: isEditAnteshteeAmountDataLoading,
    isError: isEditAnteshteeAmountDataError,
  } = useQuery({
    queryKey: ["editAnteshteeAmount", id], // This is the query key
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/anteshtee_dates/${id}`, {
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
    if (editAnteshteeAmount) {
      setValue(
        "day_9_amount",
        editAnteshteeAmount?.AnteshteeDate?.day_9_amount
      );
      setValue(
        "day_10_amount",
        editAnteshteeAmount?.AnteshteeDate?.day_10_amount
      );
      setValue(
        "day_11_amount",
        editAnteshteeAmount?.AnteshteeDate?.day_11_amount
      );
      setValue(
        "day_12_amount",
        editAnteshteeAmount?.AnteshteeDate?.day_12_amount
      );
      setValue(
        "day_13_amount",
        editAnteshteeAmount?.AnteshteeDate?.day_13_amount
      );
    }
  }, [editAnteshteeAmount, setValue]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(`/api/anteshtee_dates/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the Bearer token
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("anteshteeDates");

      toast.success("Anteshtee Date Amounts Updated Successfully");
      setIsLoading(false);
      navigate("/anteshtees");
    },
    onError: (error) => {
      setIsLoading(false);
      if (error.response && error.response.data.errors) {
        const serverStatus = error.response.data.status;
        const serverErrors = error.response.data.errors;
        if (serverStatus === false) {
          if (serverErrors.day_12_amount) {
            setError("day_9_amount", {
              type: "manual",
              message: serverErrors.day_9_amount[0],
            });
          }
          if (serverErrors.day_10_amount) {
            setError("day_10_amount", {
              type: "manual",
              message: serverErrors.day_10_amount[0],
            });
          }
          if (serverErrors.day_11_amount) {
            setError("day_11_amount", {
              type: "manual",
              message: serverErrors.day_11_amount[0],
            });
          }
          if (serverErrors.day_12_amount) {
            setError("day_12_amount", {
              type: "manual",
              message: serverErrors.day_12_amount[0],
            });
          }
          if (serverErrors.day_13_amount) {
            setError("day_13_amount", {
              type: "manual",
              message: serverErrors.day_13_amount[0],
            });
          }
        } else {
          toast.error("Failed to update anteshtee amount details.");
        }
      } else {
        toast.error("Failed to update anteshtee amount details.");
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
              {/* Users */}
              <Button
                onClick={() => navigate("/anteshtees")}
                className="p-0 text-blue-700 text-sm font-light"
                variant="link"
              >
                Anteshtee Amounts
              </Button>
            </span>
            <span className="text-gray-400">/</span>
            <span className="dark:text-gray-500">Edit</span>
          </div>
        </div>
        {/* breadcrumb ends */}

        {/* form style strat */}
        <div className="px-5 pb-7 pt-1 w-full dark:bg-background bg-white shadow-lg border  rounded-md">
          <div className="w-full py-3 flex justify-start items-center">
            <h2 className="text-lg  font-normal">Edit Anteshtee Amounts</h2>
          </div>
          {/* row starts */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full mb-8 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="day_9_amount">
                  Day 9 Amount: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="day_9_amount"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="day_9_amount"
                      className="mt-1"
                      type="number"
                      placeholder="Enter amount"
                    />
                  )}
                />
                {errors.day_9_amount && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.day_9_amount.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="day_10_amount">
                  Day 10 Amount: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="day_10_amount"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="day_10_amount"
                      className="mt-1"
                      type="number"
                      placeholder="Enter amount"
                    />
                  )}
                />
                {errors.day_10_amount && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.day_10_amount.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="day_11_amount">
                  Day 11 Amount: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="day_11_amount"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="day_11_amount"
                      className="mt-1"
                      type="number"
                      placeholder="Enter amount"
                    />
                  )}
                />
                {errors.day_11_amount && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.day_11_amount.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full mb-8 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="day_12_amount">
                  Day 12 Amount: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="day_12_amount"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="day_12_amount"
                      className="mt-1"
                      type="number"
                      placeholder="Enter amount"
                    />
                  )}
                />
                {errors.day_12_amount && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.day_12_amount.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="day_13_amount">
                  Day 13 Amount: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="day_13_amount"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="day_13_amount"
                      className="mt-1"
                      type="number"
                      placeholder="Enter amount"
                    />
                  )}
                />
                {errors.day_13_amount && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.day_13_amount.message}
                  </p>
                )}
              </div>
            </div>

            {/* row ends */}
            <div className="w-full gap-4 mt-4 flex justify-end items-center">
              <Button
                type="button"
                className=" shadow-xl dark:text-white bg-red-600 hover:bg-red-700"
                onClick={() => navigate("/anteshtees")}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                className="shadow-xl dark:text-white bg-green-600 hover:bg-green-700"
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
