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
  client_id: z.coerce.number().min(1, "client field is required."),
  //   account_number: z
  //     .string()
  //     .min(16, "Account Number must be at max 16 characters.")
  //     .max(16, "Account Number must be at max 16 characters")
  //     .regex(
  //       /^[A-Za-z0-9\s]+$/,
  //       "Account Number can only contain letters and numbers."
  //     ),
  //   have_demat_account: z
  //     .string()
  //     .min(1, "Account Number must be at max 16 characters."),

  //   service_provider: z
  //     .string()
  //     .min(1, "Service Provider field is required.")
  //     .max(100, "Service Provider must be at max 100 characters")
  //     .regex(/^[A-Za-z\s]+$/, "Service Provider can only contain letters."),
  account_number: z.string().optional(), // Make it optional
  have_mutual_fund_account: z.string().optional(),

  service_provider: z.string().optional(), // Make it optional
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
    account_number: "",
    service_provider: "",
    have_mutual_fund_account: "0",
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
    watch,
    formState: { errors },
    setValue,
    setError,
  } = useForm({ resolver: zodResolver(formSchema), defaultValues });

  const haveMutual = watch("have_mutual_fund_account");

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

  useEffect(() => {
    if (editMutual) {
      setValue("client_id", editMutual.MutualFund?.client_id || "");
      setValue(
        "service_provider",
        editMutual.MutualFund?.service_provider || ""
      );
      setValue("account_number", editMutual.MutualFund?.account_number || "");
      setValue(
        "have_mutual_fund_account",
        editMutual.MutualFund?.have_mutual_fund_account ? "1" : "0"
      );
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

      toast.success("Mutual Funds details Updated Successfully");
      setIsLoading(false);
      navigate("/mutual_funds");
    },
    onError: (error) => {
      setIsLoading(false);
      if (error.response && error.response.data.errors) {
        const serverStatus = error.response.data.status;
        const serverErrors = error.response.data.errors;
        if (serverStatus === false) {
          if (serverErrors.account_number) {
            setError("account_number", {
              type: "manual",
              message: serverErrors.account_number[0], // The error message from the server
            });
            // toast.error("The poo has already been taken.");
          }
          if (serverErrors.service_provider) {
            setError("service_provider", {
              type: "manual",
              message: serverErrors.service_provider[0], // The error message from the server
            });
            // toast.error("The poo has already been taken.");
          }
          if (serverErrors.client_id) {
            setError("client_id", {
              type: "manual",
              message: serverErrors.client_id[0], // The error message from the server
            });
            // toast.error("The poo has already been taken.");
          }
        } else {
          toast.error("Failed to Update Mutual Funds details.");
        }
      } else {
        toast.error("Failed to Update Mutual Funds details.");
      }
    },
  });
  const onSubmit = (data) => {
    setIsLoading(true);
    if (data.have_mutual_fund_account === "0") {
      data.service_provider = "";
      data.account_number = "";
    }
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
            <h2 className="text-lg  font-normal">Edit Mutual Funds Details</h2>
          </div>
          {/* row starts */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full mb-2 grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-4">
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
                          className=" w-[325px]  md:w-[490px] justify-between mt-1"
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
              <div className="a">
                <Label className="font-normal" htmlFor="mutual-yes">
                  Have Mutual Fund Account{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <div className="w-full mb-5 grid grid-cols-1 md:grid-cols-10 gap-7 md:gap-4">
                  <div className="relative flex gap-2 md:pt-3 md:pl-2 ">
                    <Controller
                      name="have_mutual_fund_account"
                      control={control}
                      defaultValue={0}
                      render={({ field }) => (
                        <input
                          id="mutual-no"
                          {...field}
                          type="radio"
                          value="0"
                          checked={field.value === "0"}
                          className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                      )}
                    />
                    <Label className="font-normal" htmlFor="mutual-no">
                      No
                    </Label>
                    {errors.have_mutual_fund_account && (
                      <p className="absolute text-red-500 text-sm mt-1 left-0">
                        {errors.have_mutual_fund_account.message}
                      </p>
                    )}
                  </div>
                  <div className="relative flex gap-2 md:pt-3 md:pl-2 ">
                    <Controller
                      name="have_mutual_fund_account"
                      control={control}
                      render={({ field }) => (
                        <input
                          id="mutual-yes"
                          {...field}
                          type="radio"
                          value="1"
                          checked={field.value === "1"}
                          className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                      )}
                    />
                    <Label className="font-normal" htmlFor="mutual-yes">
                      Yes
                    </Label>
                    {errors.have_mutual_fund_account && (
                      <p className="absolute text-red-500 text-sm mt-1 left-0">
                        {errors.have_mutual_fund_account.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {haveMutual === "1" ? (
              <>
                <div className="w-full mb-5 grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-4">
                  <div className="relative">
                    <Label className="font-normal" htmlFor="account_number">
                      Account Number:<span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="account_number"
                      control={control}
                      rules={{
                        required: "Account number field is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Account number must be exact 16 digits",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="account_number"
                          className="mt-1"
                          type="text"
                          placeholder="Enter account number"
                          maxLength={16} // Enforce max length of 10 digits
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
                    <Label className="font-normal" htmlFor="service_provider">
                      Service Provider:<span className="text-red-500">*</span>
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
                          placeholder="Enter service provider"
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
              </>
            ) : (
              ""
            )}

            {/* row ends */}
            <div className="w-full gap-4 mt-4 flex justify-end items-center">
              <Button
                type="button"
                className="dark:text-white shadow-xl bg-red-600 hover:bg-red-700"
                onClick={() => navigate("/mutual_funds")}
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
                    Updating...
                  </>
                ) : (
                  "Update"
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
