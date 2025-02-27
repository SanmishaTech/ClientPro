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
  pooja_type: z
    .string()
    .min(2, "pooja type must be at least 2 characters.")
    .max(100, "pooja type must be at max 100 characters")
    .regex(
      /^[A-Za-z\s\u0900-\u097F]+$/,
      "Pooja Type can only contain letters."
    ), // Allow letters and spaces, including Marathi
  devta_id: z.coerce.number().min(1, "devta field is required."),
  multiple: z.coerce.number().min(0, "multiple field is required."),
  // contribution: z.coerce.number().optional(),
  contribution: z.coerce
    .number()
    .max(99999, "Contribution must be at most 5 digits.")
    .optional(),
});

const Update = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const navigate = useNavigate();

  const defaultValues = {
    pooja_type: "",
    devta_id: "",
    multiple: "",
    contribution: "",
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm({ resolver: zodResolver(formSchema), defaultValues });

  const {
    data: allDevtasData,
    isLoading: isAllDevtaDataLoading,
    isError: isAllDevtaDataError,
  } = useQuery({
    queryKey: ["allDevtas"], // This is the query key
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/all_devtas`, {
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
    data: editPoojaType,
    isLoading: isEditPoojaTypeDataLoading,
    isError: isEditPoojaTypeDataError,
  } = useQuery({
    queryKey: ["editPoojaType", id], // This is the query key
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/pooja_types/${id}`, {
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
    if (editPoojaType) {
      setValue("pooja_type", editPoojaType.PoojaType?.pooja_type);
      setValue("devta_id", editPoojaType.PoojaType?.devta_id);
      setValue("contribution", editPoojaType.PoojaType?.contribution);
      setValue("multiple", editPoojaType.PoojaType?.multiple);
    }
  }, [editPoojaType, setValue]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(`/api/pooja_types/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the Bearer token
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("poojaTypes");

      toast.success("Pooja Type Updated Successfully");
      setIsLoading(false);
      navigate("/pooja_types");
    },
    onError: (error) => {
      setIsLoading(false);
      if (error.response && error.response.data.errors) {
        const serverStatus = error.response.data.status;
        const serverErrors = error.response.data.errors;
        if (serverStatus === false) {
          if (serverErrors.pooja_type) {
            setError("pooja_type", {
              type: "manual",
              message: serverErrors.pooja_type[0], // The error message from the server
            });
            // toast.error("The poo has already been taken.");
          }
        } else {
          toast.error("Failed to add pooja type.");
        }
      } else {
        toast.error("Failed to add pooja type.");
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
                onClick={() => navigate("/pooja_types")}
                className="p-0 text-blue-700 text-sm font-light"
                variant="link"
              >
                Pooja Types
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
            <h2 className="text-lg  font-normal">Edit Pooja Type</h2>
          </div>
          {/* row starts */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full mb-8 grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="pooja_type">
                  Pooja Type: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="pooja_type"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="pooja_type"
                      className="mt-1"
                      type="text"
                      placeholder="Enter pooja type"
                    />
                  )}
                />
                {errors.pooja_type && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.pooja_type.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="devta_id">
                  Devta: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="devta_id"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select devta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select Devta</SelectLabel>
                          {allDevtasData?.Devtas &&
                            allDevtasData?.Devtas.map((devta) => (
                              <SelectItem value={String(devta.id)}>
                                {devta.devta_name}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.devta_id && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.devta_id.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full mb-8 grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="contribution">
                  Contribution:
                </Label>
                <Controller
                  name="contribution"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="contribution"
                      className="mt-1"
                      type="number"
                      placeholder="Enter contribution amount"
                    />
                  )}
                />
                {errors.contribution && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.contribution.message}
                  </p>
                )}
              </div>
              <div className="relative flex gap-2 md:pt-10 md:pl-2 ">
                <Controller
                  name="multiple"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="multiple"
                      checked={field.value === 1}
                      onChange={(e) => {
                        field.onChange(e.target.checked ? 1 : 0); // Map true/false to 1/0
                      }}
                      type="checkbox"
                      className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                  )}
                />
                <Label className="font-normal" htmlFor="multiple">
                  Multiple
                </Label>
                {errors.multiple && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.multiple.message}
                  </p>
                )}
              </div>
            </div>
            {/* row ends */}
            <div className="w-full gap-4 mt-4 flex justify-end items-center">
              <Button
                type="button"
                className="dark:text-white shadow-xl bg-red-600 hover:bg-red-700"
                onClick={() => navigate("/pooja_types")}
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
