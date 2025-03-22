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
  account_number: z
    .string()
    .min(1, "Account Number field is required")
    .max(100, "Account Number field can not exceed 100 characters"),
  mutual_fund_name: z
    .string()
    .min(1, "Name field is required.")
    .max(100, "Name field must not exceed 100 characters.")
    .regex(/^[A-Za-z\s\u0900-\u097F]+$/, "Name can only contain letters."),
  reference_name: z
    .string()
    .min(1, "Reference name field is required.")
    .max(100, "Reference name field must not exceed 100 characters.")
    .regex(
      /^[A-Za-z\s\u0900-\u097F]+$/,
      "Reference name can only contain letters."
    ),
  start_date: z.string().min(1, "Start Date field is required"),
  service_provider: z
    .string()
    .min(1, "Service Provider field is required.")
    .max(100, "Service Provider field must not exceed 100 characters.")
    .regex(
      /^[A-Za-z\s\u0900-\u097F]+$/,
      "Service Provider can only contain letters."
    ), // Make it optional
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
    reference_name: "",
    mutual_fund_name: "",
    service_provider: "",
    start_date: "",
    account_number: "",
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
    data: editMutual,
    isLoading: isEditMutualDataLoading,
    isError: isEditMutualDataError,
  } = useQuery({
    queryKey: ["editMutualFund", id], // This is the query key
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/mutual_funds/${id}`, {
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
    if (editMutual) {
      setValue("client_id", editMutual.MutualFund?.client_id || "");
      setValue(
        "mutual_fund_name",
        editMutual.MutualFund?.mutual_fund_name || ""
      );
      setValue("reference_name", editMutual.MutualFund?.reference_name || "");
      setValue(
        "service_provider",
        editMutual.MutualFund?.service_provider || ""
      );
      setValue("start_date", editMutual.MutualFund?.start_date || "");
      setValue("account_number", editMutual.MutualFund?.account_number || "");

      setTimeout(() => {
        setValue(
          "family_member_id",
          editMutual?.MutualFund?.family_member_id
            ? String(editMutual?.MutualFund?.family_member_id)
            : ""
        );
      }, 200); // 1000
    }
  }, [editMutual, setValue]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(`/api/mutual_funds/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the Bearer token
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("mutual_funds");

      toast.success("Mutual Fund details Updated Successfully");
      setIsLoading(false);
      navigate("/mutual_funds");
    },
    onError: (error) => {
      setIsLoading(false);
      if (error.response && error.response.data.errors) {
        const serverStatus = error.response.data.status;
        const serverErrors = error.response.data.errors;
        if (serverStatus === false) {
          if (serverErrors.mutual_fund_name) {
            setError("mutual_fund_name", {
              type: "manual",
              message: serverErrors.mutual_fund_name[0], // The error message from the server
            });
            // toast.error("The poo has already been taken.");
          }
        } else {
          toast.error("Failed to update Mutual Fund details.");
        }
      } else {
        toast.error("Failed to update Mutual Fund details.");
      }
    },
  });
  const onSubmit = (data) => {
    setIsLoading(true);

    const isCancelled = editMutual?.MutualFund?.cancelled === 0;
    if (isCancelled) {
      updateMutation.mutate(data);
    } else {
      setIsLoading(false);
      toast.error("Cannot Update Cancelled Mutual Fund.");
      navigate("/mutual_funds");
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
                onClick={() => navigate("/mutual_funds")}
                className="p-0 text-blue-700 text-sm font-light"
                variant="link"
              >
                Mutual Funds
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
            <h2 className="text-lg  font-normal">Edit Mutual Fund</h2>
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
                <Label className="font-normal" htmlFor="mutual_fund_name">
                  Mutual Fund Name: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="mutual_fund_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="mutual_fund_name"
                      className="mt-1"
                      type="text"
                      placeholder="Enter name"
                    />
                  )}
                />
                {errors.mutual_fund_name && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.mutual_fund_name.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full mb-5 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="reference_name">
                  Reference Name: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="reference_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="reference_name"
                      className="mt-1"
                      type="text"
                      placeholder="Enter reference name"
                    />
                  )}
                />
                {errors.reference_name && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.reference_name.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="account_number">
                  Account Number: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="account_number"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="account_number"
                      className="mt-1"
                      type="text"
                      placeholder="Enter account number"
                    />
                  )}
                />
                {errors.account_number && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.account_number.message}
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
            </div>
            <div className="w-full mb-5 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="service_provider">
                  Service Provider: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="service_provider"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="service_provider"
                      className="mt-1"
                      type="text"
                      placeholder="Enter account number"
                    />
                  )}
                />
                {errors.service_provider && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.service_provider.message}
                  </p>
                )}
              </div>
            </div>

            {/* row ends */}
            <div className="w-full gap-4 mt-4 flex justify-end items-center">
              <Button
                type="button"
                className="dark:text-white shadow-xl bg-red-600 hover:bg-red-700"
                onClick={() => navigate("/mutual_funds")}
              >
                Cancel
              </Button>

              {editMutual?.MutualFund?.cancelled === 1 ? (
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
