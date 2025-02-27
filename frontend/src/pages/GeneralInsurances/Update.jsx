import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
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

  general_insurance_data: z
    .array(
      z.object({
        // Client validation (this can be at index 0)
        client_id: z.coerce.number().min(1, "Client ID field is required."),

        // Family member validation (for family members, the `family_member_id` is required)
        // family_member_id: z.unionstring().number().optional(),
        family_member_id: z.union([z.string(), z.number()]).optional(),
        // Fields common for both client and family members
        vehicle: z.coerce
          .number()
          .min(0, "vehicle insurance field is required."),
        fire: z.coerce.number().min(0, "fire insurance field is required."),
        society: z.coerce
          .number()
          .min(0, "society insurance field is required."),
        workman: z.coerce
          .number()
          .min(0, "workman insurance field is required."),
        personal_accident: z.coerce
          .number()
          .min(0, "personal account insurance field is required."),
        others: z.coerce.number().min(0, "others insurance field is required."),
      })
    )
    .min(1, "At least one mediclaim entry is required.") // Ensure at least one entry
    .optional(), // Optional so it can be dynamically added or removed
});

const Update = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [openClient, setOpenClient] = useState(false);
  const [clientData, setClientData] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const queryClient = useQueryClient();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const navigate = useNavigate();

  const defaultValues = {
    client_id: "",
    vehicle: "",
    fire: "",
    society: "",
    workman: "",
    personal_accident: "",
    others: "",
    general_insurance_data: [],
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "general_insurance_data", // This will store all mediclaim data including client and family members
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

  // useEffect(() => {
  //   if (editMediclaim) {
  //     setValue(
  //       "client_id",
  //       editMediclaim?.GeneralInsurance[0].client_id || ""
  //     );
  //   }

  //   if (editMediclaim?.MediclaimInsurance?.length) {

  //     const familyMembers = editMediclaim.MediclaimInsurance?.map((member) => ({
  //       client_id: member.client_id,
  //       family_member_id: member.family_member_id,
  //       company_name: member.company_name,
  //       broker_name: member.broker_name,
  //     }));
  //     setValue("mediclaim_data", familyMembers);
  //   }

  // }, [editMediclaim, showClientData, setValue]);
  useEffect(() => {
    if (editGeneralInsurance) {
      setValue(
        "client_id",
        editGeneralInsurance?.GeneralInsurance[0]?.client_id
      );
    }
    if (
      editGeneralInsurance &&
      editGeneralInsurance.GeneralInsurance.length > 0
    ) {
      remove();
      // Append data from editGeneralInsurance to the form dynamically
      editGeneralInsurance.GeneralInsurance.forEach((insurance, index) => {
        // Append empty mediclaim data first
        append({
          client_id: insurance.client_id,
          family_member_id: insurance.family_member_id || "", // if you have a family_member_id, otherwise ""
          vehicle: insurance.vehicle || "",
          fire: insurance.fire || "",
          society: insurance.society || "",
          workman: insurance.workman || "",
          personal_accident: insurance.personal_accident || "",
          others: insurance.others || "",
        });
      });
    }

    if (showClientData) {
      setFamilyMembers(showClientData?.Client?.Family_members);
    }
  }, [editGeneralInsurance, append, showClientData]); // Make sure to include append in the dependency array

  useEffect(() => {
    // if (showClientData) {
    //   remove();
    //   setClientData(showClientData?.Client);
    //   setFamilyMembers(showClientData?.Client?.Family_members);
    //   // Add an initial form for the client
    //   append({
    //     client_id: showClientData?.Client?.id,
    //     family_member_id: "", // client doesn't have a family_member_id
    //     company_name: "",
    //     broker_name: "",
    //     proposal_date: "",
    //     premium_payment_mode: "",
    //     sum_insured: "",
    //     end_date: "",
    //   });
    //   // Append forms for each family member
    //   showClientData?.Client?.Family_members?.forEach((familyMember) => {
    //     append({
    //       client_id: showClientData?.Client?.id,
    //       family_member_id: familyMember.id || "",
    //       company_name: "",
    //       broker_name: "",
    //       proposal_date: "",
    //       premium_payment_mode: "",
    //       sum_insured: "",
    //       end_date: "",
    //     });
    //   });
    // }
  }, [showClientData, append]);

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
      queryClient.invalidateQueries("general_insurances");

      toast.success("General Insurance Updated Successfully");
      setIsLoading(false);
      navigate("/general_insurances");
    },
    onError: (error) => {
      setIsLoading(false);
      if (error.response && error.response.data.errors) {
        const serverStatus = error.response.data.status;
        const serverErrors = error.response.data.errors;
        if (serverStatus === false) {
          if (serverErrors.vehicle) {
            setError("vehicle", {
              type: "manual",
              message: serverErrors.vehicle[0], // The error message from the server
            });
            // toast.error("The poo has already been taken.");
          }
        } else {
          toast.error("Failed to update General insurance details.");
        }
      } else {
        toast.error("Failed to update General insurance details.");
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
                onClick={() => navigate("/general_insurances")}
                className="p-0 text-blue-700 text-sm font-light"
                variant="link"
              >
                General Insurances
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
            <div className="w-full mb-5 grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-4">
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
                          disabled
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
                            disabled
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
              // const isClient = index === 0;
              // const familyMember = !isClient ? familyMembers[index - 1] : null;
              const isClient = !item.family_member_id;
              // For family members, find the matching member from the familyMembers state
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
                  {/* <h3 className="font-bold tracking-wide">
                    {isClient ? "Client" : familyMember?.family_member_name}
                  </h3> */}
                  <h3 className="font-bold tracking-wide">{heading}</h3>

                  <div className="w-full mb-5 grid grid-cols-1 md:grid-cols-6 gap-7 md:gap-4">
                    <div className="relative flex gap-2 md:pt-6 md:pl-2 ">
                      <Controller
                        name={`general_insurance_data[${index}].vehicle`}
                        control={control}
                        render={({ field }) => (
                          <input
                            id={`general_insurance_data[${index}].vehicle`}
                            {...field}
                            checked={field.value === 1}
                            onChange={(e) => {
                              field.onChange(e.target.checked ? 1 : 0);
                            }}
                            type="checkbox"
                            className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                          />
                        )}
                      />
                      <Label
                        className="font-normal"
                        htmlFor={`general_insurance_data[${index}].vehicle`}
                      >
                        Vehicle Insurance
                      </Label>
                      {errors.general_insurance_data?.[index]?.vehicle && (
                        <p className="absolute text-red-500 text-sm mt-1 left-0">
                          {
                            errors.general_insurance_data[index]?.vehicle
                              .message
                          }
                        </p>
                      )}
                    </div>

                    <div className="relative flex gap-2 md:pt-6 md:pl-2 ">
                      <Controller
                        name={`general_insurance_data[${index}].fire`}
                        control={control}
                        render={({ field }) => (
                          <input
                            id={`general_insurance_data[${index}].fire`}
                            {...field}
                            checked={field.value === 1}
                            onChange={(e) => {
                              field.onChange(e.target.checked ? 1 : 0);
                            }}
                            type="checkbox"
                            className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                          />
                        )}
                      />
                      <Label
                        className="font-normal"
                        htmlFor={`general_insurance_data[${index}].fire`}
                      >
                        Fire Insurance
                      </Label>
                      {errors.general_insurance_data?.[index]?.fire && (
                        <p className="absolute text-red-500 text-sm mt-1 left-0">
                          {errors.general_insurance_data[index]?.fire.message}
                        </p>
                      )}
                    </div>

                    <div className="relative flex gap-2 md:pt-6 md:pl-2 ">
                      <Controller
                        name={`general_insurance_data[${index}].society`}
                        control={control}
                        render={({ field }) => (
                          <input
                            id={`general_insurance_data[${index}].society`}
                            {...field}
                            checked={field.value === 1}
                            onChange={(e) => {
                              field.onChange(e.target.checked ? 1 : 0);
                            }}
                            type="checkbox"
                            className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                          />
                        )}
                      />
                      <Label
                        className="font-normal"
                        htmlFor={`general_insurance_data[${index}].society`}
                      >
                        Society
                      </Label>
                      {errors.general_insurance_data?.[index]?.society && (
                        <p className="absolute text-red-500 text-sm mt-1 left-0">
                          {
                            errors.general_insurance_data[index]?.society
                              .message
                          }
                        </p>
                      )}
                    </div>

                    <div className="relative flex gap-2 md:pt-6 md:pl-2 ">
                      <Controller
                        name={`general_insurance_data[${index}].workman`}
                        control={control}
                        render={({ field }) => (
                          <input
                            id={`general_insurance_data[${index}].workman`}
                            {...field}
                            checked={field.value === 1}
                            onChange={(e) => {
                              field.onChange(e.target.checked ? 1 : 0);
                            }}
                            type="checkbox"
                            className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                          />
                        )}
                      />
                      <Label
                        className="font-normal"
                        htmlFor={`general_insurance_data[${index}].workman`}
                      >
                        Workman
                      </Label>
                      {errors.general_insurance_data?.[index]?.workman && (
                        <p className="absolute text-red-500 text-sm mt-1 left-0">
                          {
                            errors.general_insurance_data[index]?.workman
                              .message
                          }
                        </p>
                      )}
                    </div>

                    <div className="relative flex gap-2 md:pt-6 md:pl-2 ">
                      <Controller
                        name={`general_insurance_data[${index}].personal_accident`}
                        control={control}
                        render={({ field }) => (
                          <input
                            id={`general_insurance_data[${index}].personal_accident`}
                            {...field}
                            checked={field.value === 1}
                            onChange={(e) => {
                              field.onChange(e.target.checked ? 1 : 0);
                            }}
                            type="checkbox"
                            className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                          />
                        )}
                      />
                      <Label
                        className="font-normal"
                        htmlFor={`general_insurance_data[${index}].personal_accident`}
                      >
                        Personal Accident
                      </Label>
                      {errors.general_insurance_data?.[index]
                        ?.personal_accident && (
                        <p className="absolute text-red-500 text-sm mt-1 left-0">
                          {
                            errors.general_insurance_data[index]
                              ?.personal_accident.message
                          }
                        </p>
                      )}
                    </div>

                    <div className="relative flex gap-2 md:pt-6 md:pl-2 ">
                      <Controller
                        name={`general_insurance_data[${index}].others`}
                        control={control}
                        render={({ field }) => (
                          <input
                            id={`general_insurance_data[${index}].others`}
                            {...field}
                            checked={field.value === 1}
                            onChange={(e) => {
                              field.onChange(e.target.checked ? 1 : 0);
                            }}
                            type="checkbox"
                            className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                          />
                        )}
                      />
                      <Label
                        className="font-normal"
                        htmlFor={`general_insurance_data[${index}].others`}
                      >
                        Others
                      </Label>
                      {errors.general_insurance_data?.[index]?.others && (
                        <p className="absolute text-red-500 text-sm mt-1 left-0">
                          {errors.general_insurance_data[index]?.others.message}
                        </p>
                      )}
                    </div>
                    {/* <Button
                      type="button"
                      onClick={() => remove(index)} // Remove family member
                      className="mt-  bg-red-600 hover:bg-red-700 text-white"
                    >
                      Remove
                    </Button> */}
                  </div>
                </div>
              );
            })}

            {/* row ends */}
            <div className="w-full gap-4 mt-4 flex justify-end items-center">
              <Button
                type="button"
                className="dark:text-white shadow-xl bg-red-600 hover:bg-red-700"
                onClick={() => navigate("/general_insurances")}
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
