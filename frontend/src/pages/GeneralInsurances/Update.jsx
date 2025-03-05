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
        general_id: z.string().optional(),

        // Family member validation (for family members, the `family_member_id` is required)
        // family_member_id: z.unionstring().number().optional(),
        family_member_id: z.union([z.string(), z.number()]).optional(),
        // Fields common for both client and family members
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
      })
    )
    .min(1, "At least one General Insurance is required.") // Ensure at least one entry
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
    general_id: "",
    client_id: "",
    insurance_type: "",
    company_name: "",
    start_date: "",
    end_date: "",
    premium: "",
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
          general_id: insurance.id.toString(),
          client_id: insurance.client_id,
          family_member_id: insurance.family_member_id || "", // if you have a family_member_id, otherwise ""
          insurance_type: insurance.insurance_type || "",
          company_name: insurance.company_name || "",
          premium: insurance.premium || "",
          start_date: insurance.start_date || "",
          end_date: insurance.end_date || "",
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
          if (serverErrors.company_name) {
            setError("company_name", {
              type: "manual",
              message: serverErrors.company_name[0], // The error message from the server
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

                  <div className="w-full mb-2 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
                    <div className="relative">
                      <Label
                        className="font-normal"
                        htmlFor={`general_insurance_data[${index}].insurance_type`}
                      >
                        Insurance Type: <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`general_insurance_data[${index}].insurance_type`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue
                                className=""
                                placeholder="Select type"
                              />
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
                      {errors.general_insurance_data?.[index]
                        ?.insurance_type && (
                        <p className=" text-red-500 text-sm mt-1 left-0">
                          {
                            errors.general_insurance_data[index]?.insurance_type
                              .message
                          }
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <Label
                        className="font-normal"
                        htmlFor={`general_insurance_data[${index}].company_name`}
                      >
                        Company Name: <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`general_insurance_data[${index}].company_name`}
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
                      {errors.general_insurance_data?.[index]?.company_name && (
                        <p className=" text-red-500 text-sm mt-1 left-0">
                          {
                            errors.general_insurance_data?.[index]?.company_name
                              .message
                          }
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <Label
                        className="font-normal"
                        htmlFor={`general_insurance_data[${index}].premium`}
                      >
                        Sum Insured: <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`general_insurance_data[${index}].premium`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id={`general_insurance_data[${index}].premium`}
                            className="mt-1"
                            type="number"
                            placeholder="Enter premium amount"
                          />
                        )}
                      />
                      {errors.general_insurance_data?.[index]?.premium && (
                        <p className=" text-red-500 text-sm mt-1 left-0">
                          {
                            errors.general_insurance_data[index].premium
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="w-full mb-2 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
                    <div className="relative">
                      <Label
                        className="font-normal"
                        htmlFor={`general_insurance_data[${index}].start_date`}
                      >
                        Start Date: <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`general_insurance_data[${index}].start_date`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            id={`general_insurance_data[${index}].start_date`}
                            className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                            type="date"
                            placeholder="Enter start date"
                          />
                        )}
                      />
                      {errors.general_insurance_data?.[index]?.start_date && (
                        <p className=" text-red-500 text-sm mt-1 left-0">
                          {
                            errors.general_insurance_data[index].start_date
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <Label
                        className="font-normal"
                        htmlFor={`general_insurance_data[${index}].end_date`}
                      >
                        End Date: <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`general_insurance_data[${index}].end_date`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            id={`general_insurance_data[${index}].end_date`}
                            className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                            type="date"
                            placeholder="Enter end date"
                          />
                        )}
                      />
                      {errors.general_insurance_data?.[index]?.end_date && (
                        <p className=" text-red-500 text-sm mt-1 left-0">
                          {
                            errors.general_insurance_data[index].end_date
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <Controller
                        name="general_id"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="general_id"
                            className="mt-1"
                            type="hidden"
                            placeholder="Enter pincode"
                          />
                        )}
                      />
                      {errors.general_id && (
                        <p className=" text-red-500 text-sm mt-1 left-0">
                          {errors.general_id.message}
                        </p>
                      )}
                    </div>
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
