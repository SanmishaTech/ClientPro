import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
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
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toTitleCase } from "../../lib/titleCase.js";

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
  demat_account_data: z
    .array(
      z.object({
        client_id: z.coerce.number().min(1, "Client ID field is required."),
        family_member_id: z.union([z.string(), z.number()]).optional(),
        // account_number: z
        //   .string()
        //   .min(1, "Account Number field is required")
        //   .max(100, "Account Number field can not exceed 100 characters"),
        account_number: z
          .string()
          .min(16, "Account Number must be exact 16 characters long.")
          .max(16, "Account Number must be exact 16 characters long.")
          .regex(
            /^[A-Za-z0-9]+$/,
            "Account Number can only contain letters and numbers."
          ),

        plan_name: z
          .string()
          .min(1, "Plan name field is required.")
          .max(100, "Plan name field must not exceed 100 characters.")
          .regex(
            /^[A-Za-z\s\u0900-\u097F]+$/,
            "Plan name can only contain letters."
          ),
        company_name: z
          .string()
          .min(1, "Company name field is required.")
          .max(100, "Company name field must not exceed 100 characters.")
          .regex(
            /^[A-Za-z\s\u0900-\u097F]+$/,
            "Company name can only contain letters."
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
      })
    )
    .min(1, "At least one Demat Account is required.") // Ensure at least one entry
    .optional(),
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
  // account_number: z.string().optional(), // Make it optional
  // have_demat_account: z.string().optional(),

  // service_provider: z.string().optional(), // Make it optional
});

const Create = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [openClient, setOpenClient] = useState(false);
  const [clientData, setClientData] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);

  const queryClient = useQueryClient();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const navigate = useNavigate();
  const defaultValues = {
    client_id: "",
    account_number: "",
    service_provider: "",
    company_name: "",
    plan_name: "",
    start_date: "",
    demat_account_data: [],
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
    setError,
    setValue,
  } = useForm({ resolver: zodResolver(formSchema), defaultValues });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "demat_account_data", // This will store all mediclaim data including client and family members
  });

  const clientId = watch("client_id");

  const {
    data: showClientData,
    isLoading: isShowClientDataLoading,
    isError: isShowClientDataError,
  } = useQuery({
    queryKey: ["showClient", clientId], // This is the query key
    queryFn: async () => {
      try {
        if (!clientId) {
          return [];
        }
        const response = await axios.get(`/api/clients/${clientId}`, {
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
    enabled: !!clientId, // Enable the query only if clientId is truthy
  });

  useEffect(() => {
    if (showClientData) {
      remove();
      setClientData(showClientData?.Client);
      setFamilyMembers(showClientData?.Client?.Family_members);
      // Add an initial form for the client
      append({
        client_id: showClientData?.Client?.id,
        family_member_id: "", // client doesn't have a family_member_id
        company_name: "",
        plan_name: "",
        start_date: "",
        account_number: "",
        service_provider: "",
      });

      // Append forms for each family member
      showClientData?.Client?.Family_members?.forEach((familyMember) => {
        append({
          client_id: showClientData?.Client?.id,
          family_member_id: familyMember.id || "",
          company_name: familyMember.company_name || "",
          plan_name: familyMember.plan_name || "",
          start_date: familyMember.start_date || "",
          account_number: familyMember.account_number || "",
          service_provider: familyMember.service_provider || "",
        });
      });
    }
  }, [showClientData, append]);

  const storeMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post("/api/demat_accounts", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the Bearer token
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("demat_accounts");
      toast.success("Demat Account details Added Successfully");
      setIsLoading(false);
      navigate("/demat_accounts");
    },
    onError: (error) => {
      setIsLoading(false);
      if (error.response && error.response.data.errors) {
        const serverStatus = error.response.data.status;
        const serverErrors = error.response.data.errors;
        if (serverStatus === false) {
          for (const [field, messages] of Object.entries(serverErrors)) {
            // Extract the index for array errors like demat_account_data.0.account_number
            const fieldNameParts = field.split(".");
            const fieldName = fieldNameParts[fieldNameParts.length - 1]; // e.g., "account_number"

            // Handle nested array errors dynamically
            if (field.includes("demat_account_data")) {
              const index = fieldNameParts[1]; // e.g., "0" for the first item in the array

              setError(
                `demat_account_data[${index}].${fieldName}`, // Path to the nested field
                {
                  type: "manual",
                  message: messages[0], // The error message from the server
                }
              );
            } else {
              // Handle non-nested fields normally
              setError(fieldName, {
                type: "manual",
                message: messages[0],
              });
            }
          }
        } else {
          toast.error("Failed to add Demat Account details.");
        }
      } else {
        toast.error("Failed to add Demat Account details.");
      }
    },
  });
  const onSubmit = (data) => {
    setIsLoading(true);

    // if (data.have_demat_account === "0") {
    //   data.service_provider = "";
    //   data.account_number = "";
    // }
    storeMutation.mutate(data);
  };

  return (
    <>
      <div className="p-5">
        {/* breadcrumb start */}
        <div className=" mb-7 text-sm">
          <div className="flex items-center space-x-2 text-gray-700">
            <span className="">
              <Button
                onClick={() => navigate("/demat_accounts")}
                className="p-0 text-blue-700 text-sm font-light"
                variant="link"
              >
                Demat Accounts
              </Button>
            </span>
            <span className="text-gray-400">/</span>
            <span className="dark:text-gray-300">Add</span>
          </div>
        </div>
        {/* breadcrumb ends */}

        {/* form style strat */}

        <div className="px-5 pb-7 dark:bg-background pt-1 w-full bg-white shadow-lg border  rounded-md">
          <div className="w-full py-3 flex justify-start items-center">
            <h2 className="text-lg  font-normal">Add Demat Account Details</h2>
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
            </div>
            {fields.map((item, index) => {
              const isClient = !item.family_member_id;
              const memberData = !isClient
                ? familyMembers.find(
                    (member) => member.id === item.family_member_id
                  )
                : null;
              const heading = isClient
                ? "Client"
                : memberData?.family_member_name || "Family Member";

              return (
                <div key={item.id}>
                  <h3 className="font-bold tracking-wide">{heading}</h3>

                  <div className="w-full mb-2 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
                    {/* Company Name */}
                    <div className="relative">
                      <Label
                        className="font-normal"
                        htmlFor={`demat_account_data[${index}].company_name`}
                      >
                        Company Name: <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`demat_account_data[${index}].company_name`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id={`demat_account_data[${index}].company_name`}
                            className="mt-1"
                            type="text"
                            placeholder="Enter company name"
                            onChange={(e) => {
                              const formatedValue = toTitleCase(e.target.value);
                              field.onChange(formatedValue);
                            }}
                          />
                        )}
                      />
                      {errors.demat_account_data?.[index]?.company_name && (
                        <p className=" text-red-500 text-sm mt-1 left-0">
                          {
                            errors.demat_account_data[index].company_name
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <Label
                        className="font-normal"
                        htmlFor={`demat_account_data[${index}].account_number`}
                      >
                        Demat Account Number:{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`demat_account_data[${index}].account_number`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id={`demat_account_data[${index}].account_number`}
                            className="mt-1"
                            type="text"
                            placeholder="Enter account number"
                            maxLength={16}
                          />
                        )}
                      />
                      {errors.demat_account_data?.[index]?.account_number && (
                        <p className=" text-red-500 text-sm mt-1 left-0">
                          {
                            errors.demat_account_data[index].account_number
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <Label
                        className="font-normal"
                        htmlFor={`demat_account_data[${index}].plan_name`}
                      >
                        Plan Name: <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`demat_account_data[${index}].plan_name`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id={`demat_account_data[${index}].plan_name`}
                            className="mt-1"
                            type="text"
                            placeholder="Enter plan name"
                            onChange={(e) => {
                              const formatedValue = toTitleCase(e.target.value);
                              field.onChange(formatedValue);
                            }}
                          />
                        )}
                      />
                      {errors.demat_account_data?.[index]?.plan_name && (
                        <p className=" text-red-500 text-sm mt-1 left-0">
                          {errors.demat_account_data[index].plan_name?.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="w-full mb-2 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
                    <div className="relative">
                      <Label
                        className="font-normal"
                        htmlFor={`demat_account_data[${index}].start_date`}
                      >
                        Start Date: <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`demat_account_data[${index}].start_date`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            id={`demat_account_data[${index}].start_date`}
                            className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                            type="date"
                            placeholder="Enter proposal date"
                          />
                        )}
                      />
                      {errors.demat_account_data?.[index]?.start_date && (
                        <p className=" text-red-500 text-sm mt-1 left-0">
                          {errors.demat_account_data[index].start_date?.message}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <Label
                        className="font-normal"
                        htmlFor={`demat_account_data[${index}].service_provider`}
                      >
                        Service Provider:{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`demat_account_data[${index}].service_provider`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id={`demat_account_data[${index}].service_provider`}
                            className="mt-1"
                            type="text"
                            placeholder="Enter service provider"
                            onChange={(e) => {
                              const formatedValue = toTitleCase(e.target.value);
                              field.onChange(formatedValue);
                            }}
                          />
                        )}
                      />
                      {errors.demat_account_data?.[index]?.service_provider && (
                        <p className=" text-red-500 text-sm mt-1 left-0">
                          {
                            errors.demat_account_data[index].service_provider
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="w-full mb-5 grid grid-cols-1 md:grid-cols-9 gap-7 md:gap-4">
                    <Button
                      type="button"
                      onClick={() => {
                        remove(index); // Remove the selected form field

                        if (index !== 0) {
                          // Only update familyMembers when a family member form is removed
                          setFamilyMembers((prevMembers) => {
                            const updatedMembers = [...prevMembers];
                            updatedMembers.splice(index - 1, 1); // Remove the corresponding family member
                            return updatedMembers;
                          });
                        }
                        // If the client (index 0) is removed, do not update familyMembers.
                      }}
                      className="mt-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })}

            {/* row ends */}
            <div className="w-full gap-4 mt-4 flex justify-end items-center">
              <Button
                type="button"
                className="dark:text-white shadow-xl bg-red-600 hover:bg-red-700"
                onClick={() => navigate("/demat_accounts")}
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

export default Create;
