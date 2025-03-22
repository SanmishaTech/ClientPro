import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const formSchema = z.object({
  client_id: z.coerce.number().min(1, "Client field is required."),
  family_member_id: z.string().optional(),
  company_name: z
    .string()
    .min(1, "Company name field is required.")
    .max(100, "Company name must be at max 100 characters")
    .regex(
      /^[A-Za-z\s\u0900-\u097F]+$/,
      "Company name can only contain letters."
    ),
  insurance_type: z
    .string()
    .min(1, "Insurance type field is required.")
    .max(100, "Insurance type must be at max 100 characters")
    .regex(
      /^[A-Za-z\s\u0900-\u097F]+$/,
      "Insurance type can only contain letters."
    ),
  premium: z.coerce
    .number()
    .min(1, "Premium amount field is required.")
    .max(99999999, "Premium amount must not exceed 9,99,99,999."),
  start_date: z.string().min(1, "Start Date is required"),
  end_date: z.string().min(1, "End date is required"),
});

const Update = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [openClient, setOpenClient] = useState(false);
  const queryClient = useQueryClient();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const navigate = useNavigate();

  const defaultValues = {
    client_id: "",
    family_member_id: "",
    company_name: "",
    insurance_type: "",
    premium: "",
    start_date: "",
    end_date: "",
  };

  const {
    data: allClientsData,
    isLoading: isAllClientsDataLoading,
    isError: isAllClientsDataError,
  } = useQuery({
    queryKey: ["all_clients"], // This is the query key
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/all_clients`, {
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
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    watch,
  } = useForm({ resolver: zodResolver(formSchema), defaultValues });
  const selectedClient = watch("client_id") || null;

  const {
    data: editGeneralInsurance,
    isLoading: isEditGeneralInsuranceDataLoading,
    isError: isEditGeneralInsuranceDataError,
  } = useQuery({
    queryKey: ["editGeneralInsurance", id], // This is the query key
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/general_insurances/${id}`, {
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
    data: editClient,
    isLoading: isEditClientDataLoading,
    isError: isEditClientDataError,
  } = useQuery({
    queryKey: ["editClient", selectedClient], // This is the query key
    queryFn: async () => {
      try {
        if (!selectedClient) {
          return [];
        }
        const response = await axios.get(`/api/clients/${selectedClient}`, {
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
    enabled: !!selectedClient, // Enable the query only if selectedPoojaTypeId is truthy
  });

  useEffect(() => {
    if (editGeneralInsurance) {
      setValue(
        "client_id",
        editGeneralInsurance.GeneralInsurance?.client_id || ""
      );
      setValue(
        "company_name",
        editGeneralInsurance.GeneralInsurance?.company_name || ""
      );
      setValue(
        "insurance_type",
        editGeneralInsurance.GeneralInsurance?.insurance_type || ""
      );
      setValue(
        "start_date",
        editGeneralInsurance.GeneralInsurance?.start_date || ""
      );
      setValue(
        "end_date",
        editGeneralInsurance.GeneralInsurance?.end_date || ""
      );
      setValue("premium", editGeneralInsurance.GeneralInsurance?.premium || "");
      setTimeout(() => {
        setValue(
          "family_member_id",
          editGeneralInsurance?.GeneralInsurance?.family_member_id
            ? String(editGeneralInsurance?.GeneralInsurance?.family_member_id)
            : ""
        );
      }, 200); // 1000
    }
  }, [editGeneralInsurance, setValue]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(`/api/general_insurances/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the Bearer token
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("lics");

      toast.success("general insurance details Updated Successfully");
      setIsLoading(false);
      navigate("/general_insurances");
    },
    onError: (error) => {
      setIsLoading(false);
      if (error.response && error.response.data.errors) {
        const serverStatus = error.response.data.status;
        const serverErrors = error.response.data.errors;
        if (serverStatus === false) {
          if (serverErrors.company_name) {
            setError("company_name", {
              type: "manual",
              message: serverErrors.company_name[0], // The error message from the server
            });
            // toast.error("The poo has already been taken.");
          }
        } else {
          toast.error("Failed to update General Insurance details.");
        }
      } else {
        toast.error("Failed to update General Insurance details.");
      }
    },
  });
  const onSubmit = (data) => {
    setIsLoading(true);

    const isCancelled = editGeneralInsurance?.GeneralInsurance?.cancelled === 0;
    if (isCancelled) {
      updateMutation.mutate(data);
    } else {
      setIsLoading(false);
      toast.error("Cannot Update Cancelled General Insurance.");
      navigate("/general_insurances");
    }
  };

  return (
    <>
      <div className="p-5">
        {/* breadcrumb start */}
        <div className=" mb-7 text-sm">
          <div className="flex items-center space-x-2 text-gray-700">
            <span className="">
              <Button
                onClick={() => navigate("/general_insurances")}
                className="p-0 text-blue-700 text-sm font-light"
                variant="link"
              >
                General Insurance
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
            <h2 className="text-lg  font-normal">Edit General Insurance</h2>
          </div>
          {/* row starts */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full mb-5 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
              {/* <div className="relative">
                <Label className="font-normal" htmlFor="client_id">
                  Client: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="client_id"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select Client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select Client</SelectLabel>
                          {allClientsData?.Clients &&
                            allClientsData?.Clients.map((client) => (
                              <SelectItem value={String(client.id)}>
                                {client.client_name}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.client_id && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.client_id.message}
                  </p>
                )}
              </div> */}
              <div className="relative mt-2 flex flex-col gap-1">
                <Label className="font-normal" htmlFor="client_id">
                  Client: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="client_id"
                  control={control}
                  render={({ field }) => (
                    <Popover open={openClient} onOpenChange={setOpenClient}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openClient ? "true" : "false"} // This should depend on the popover state
                          className=" w-[325px]  md:w-[320px] justify-between mt-1"
                          onClick={() => setOpenClient((prev) => !prev)} // Toggle popover on button click
                        >
                          {field.value
                            ? allClientsData?.Clients &&
                              allClientsData?.Clients.find(
                                (client) => client.id === field.value
                              )?.client_name
                            : "Select Client..."}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[325px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search client..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No client found.</CommandEmpty>
                            <CommandGroup>
                              {allClientsData?.Clients &&
                                allClientsData?.Clients.map((client) => (
                                  <CommandItem
                                    key={client.id}
                                    value={client.id}
                                    onSelect={(currentValue) => {
                                      setValue("client_id", client.id);
                                      setValue("family_member_id", "");
                                      // setSelectedReceiptTypeId(
                                      //   currentValue === selectedReceiptTypeId
                                      //     ? ""
                                      //     : currentValue
                                      // );

                                      setOpenClient(false);
                                      // Close popover after selection
                                    }}
                                  >
                                    {client.client_name}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        client.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.client_id && (
                  <p className="absolute text-red-500 text-sm mt-16 left-0">
                    {errors.client_id.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="family_member_id">
                  Family Member:
                </Label>
                <Controller
                  name="family_member_id"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select Family member" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select Family member</SelectLabel>
                          {editClient?.Client?.Family_members &&
                            editClient?.Client?.Family_members?.map(
                              (familyMember) => (
                                <SelectItem value={String(familyMember.id)}>
                                  {familyMember?.family_member_name}
                                </SelectItem>
                              )
                            )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.family_member_id && (
                  <p className=" text-red-500 text-sm mt-1 left-0">
                    {errors.family_member_id.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="company_name">
                  Company Name: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="company_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="company_name"
                      className="mt-1"
                      type="text"
                      placeholder="Enter company name"
                    />
                  )}
                />
                {errors.company_name && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.company_name.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full mb-5 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="insurance_type">
                  Insurance Type: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="insurance_type"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue className="" placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel className="">
                            Select insurance type
                          </SelectLabel>
                          <SelectItem value="Vehicle">Vehicle</SelectItem>
                          <SelectItem value="Fire">Fire</SelectItem>
                          <SelectItem value="Society">Society</SelectItem>
                          <SelectItem value="Workman">Workman</SelectItem>
                          <SelectItem value="Personal Accident">
                            Personal Accident
                          </SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.insurance_type && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.insurance_type.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="start_date">
                  Start Date: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="start_date"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="start_date"
                      className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                      type="date"
                      placeholder="Enter to date"
                    />
                  )}
                />
                {errors.start_date && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.start_date.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="end_date">
                  End Date: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="end_date"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="end_date"
                      className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                      type="date"
                      placeholder="Enter to date"
                    />
                  )}
                />
                {errors.end_date && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.end_date.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full mb-5 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="premium">
                  Premium: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="premium"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="premium"
                      className="mt-1"
                      type="number"
                      placeholder="Enter premium"
                    />
                  )}
                />
                {errors.premium && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.premium.message}
                  </p>
                )}
              </div>
            </div>

            {/* row ends */}
            <div className="w-full gap-4 mt-4 flex justify-end items-center">
              <Button
                type="button"
                className="dark:text-white shadow-xl bg-red-600 hover:bg-red-700"
                onClick={() => navigate("/general_insurances")}
              >
                Cancel
              </Button>

              {editGeneralInsurance?.GeneralInsurance?.cancelled === 1 ? (
                ""
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className=" dark:text-white  shadow-xl bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" /> {/* Spinner */}
                      Updating...
                    </>
                  ) : (
                    "Update"
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Update;
