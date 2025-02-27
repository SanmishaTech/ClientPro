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
        account_number: z.string().optional(), // Make it optional
        have_demat_account: z.string().optional(),
        service_provider: z.string().optional(), // Make it optional
      })
    )
    .min(1, "At least one mediclaim entry is required.") // Ensure at least one entry
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
    have_demat_account: "0",
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

  const haveDemat = watch("have_demat_account");

  

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
        have_demat_account: "0",
        account_number: "",
        service_provider: "",
      });

      // Append forms for each family member
      showClientData?.Client?.Family_members?.forEach((familyMember) => {
        append({
          client_id: showClientData?.Client?.id,
          family_member_id: familyMember.id || "",
          have_demat_account: "0",
          account_number: "",
          service_provider: "",
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

  useEffect(() => {
    console.log(errors); // Log errors
  }, [errors]);

  useEffect(() => {
    // Ensure that the form is initialized with "0" for 'have_demat_account'
    if (!watch("have_demat_account")) {
      setValue("have_demat_account", "0");
    }
  }, [setValue, watch]);

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

                  <div className="w-full mb-5 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
                    {/* Company Name */}
                    <div className="relative">
                      <Label
                        className="font-normal"
                        htmlFor={`mediclaim_data[${index}].company_name`}
                      >
                        Company Name: <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`mediclaim_data[${index}].company_name`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id={`mediclaim_data[${index}].company_name`}
                            className="mt-1"
                            type="text"
                            placeholder="Enter company name"
                          />
                        )}
                      />
                      {errors.mediclaim_data?.[index]?.company_name && (
                        <p className="absolute text-red-500 text-sm mt-1 left-0">
                          {errors.mediclaim_data[index].company_name?.message}
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
