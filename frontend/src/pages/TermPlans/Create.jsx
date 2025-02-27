import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Check, ChevronsUpDown, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";
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

  term_plan_data: z
    .array(
      z.object({
        // Client validation (this can be at index 0)
        client_id: z.coerce.number().min(1, "Client ID field is required."),

        // Family member validation (for family members, the `family_member_id` is required)
        // family_member_id: z.unionstring().number().optional(),
        family_member_id: z.union([z.string(), z.number()]).optional(),
        // Fields common for both client and family members
        term_company_name: z
          .string()
          .min(2, "Company name must be at least 2 characters.")
          .max(100, "Company name must not exceed 100 characters.")
          .regex(
            /^[A-Za-z\s\u0900-\u097F]+$/,
            "Company name can only contain letters."
          ),

        broker_name: z
          .string()
          .min(2, "Broker name must be at least 2 characters.")
          .max(100, "Broker name must not exceed 100 characters.")
          .regex(
            /^[A-Za-z\s\u0900-\u097F]+$/,
            "Broker name can only contain letters."
          ),

        proposal_date: z.string().min(1, "Proposal date field is required."),

        premium_payment_mode: z
          .string()
          .min(1, "Premium payment mode field is required.")
          .max(
            100,
            "Premium payment mode field must not exceed 100 characters."
          ),

        sum_insured: z.coerce
          .number()
          .min(1, "Sum Insured field is required.")
          .max(99999999, "Sum Insured must not exceed 9,99,99,999."),

        end_date: z
          .string()
          .optional()
          .refine(
            (val) => !val || !isNaN(Date.parse(val)),
            "End date must be a valid date if provided."
          ),
      })
    )
    .min(1, "At least one mediclaim entry is required.") // Ensure at least one entry
    .optional(), // Optional so it can be dynamically added or removed
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
    family_member_id: "",
    term_company_name: "",
    broker_name: "",
    proposal_date: "",
    premium_payment_mode: "",
    sum_insured: "",
    end_date: "",
    term_plan_data: [],
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
    setError,
    setValue,
    watch,
  } = useForm({ resolver: zodResolver(formSchema), defaultValues });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "term_plan_data", // This will store all mediclaim data including client and family members
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
        term_company_name: "",
        broker_name: "",
        proposal_date: "",
        premium_payment_mode: "",
        sum_insured: "",
        end_date: "",
      });

      // Append forms for each family member
      showClientData?.Client?.Family_members?.forEach((familyMember) => {
        append({
          client_id: showClientData?.Client?.id,
          family_member_id: familyMember.id || "",
          term_company_name: "",
          broker_name: "",
          proposal_date: "",
          premium_payment_mode: "",
          sum_insured: "",
          end_date: "",
        });
      });
    }
  }, [showClientData, append]);

  const storeMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post("/api/term_plans", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the Bearer token
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("term_plans");
      toast.success("Term Plan details Added Successfully");
      setIsLoading(false);
      navigate("/term_plans");
    },
    onError: (error) => {
      setIsLoading(false);
      if (error.response && error.response.data.errors) {
        const serverStatus = error.response.data.status;
        const serverErrors = error.response.data.errors;
        if (serverStatus === false) {
          if (serverErrors.term_company_name) {
            setError("term_company_name", {
              type: "manual",
              message: serverErrors.term_company_name[0], // The error message from the server
            });
            // toast.error("The poo has already been taken.");
          }
        } else {
          toast.error("Failed to add Term Plan details.");
        }
      } else {
        toast.error("Failed to add Term Plan details.");
      }
    },
  });
  const onSubmit = (data) => {
    setIsLoading(true);
    storeMutation.mutate(data);
  };

  useEffect(() => {
    console.log(errors); // Log errors
  }, [errors]);

  return (
    <>
      <div className="p-5">
        {/* breadcrumb start */}
        <div className=" mb-7 text-sm">
          <div className="flex items-center space-x-2 text-gray-700">
            <span className="">
              <Button
                onClick={() => navigate("/term_plans")}
                className="p-0 text-blue-700 text-sm font-light"
                variant="link"
              >
                Term Plans
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
            <h2 className="text-lg  font-normal">Add Term Plan</h2>
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
              // const isClient = index === 0;
              // const familyMember = !isClient ? familyMembers[index - 1] : null;
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
                  {/* <h3>
                    {isClient ? "Client" : familyMember?.family_member_name}
                  </h3> */}
                  {/* <h3 className="font-bold tracking-wide">
                    {isClient
                      ? // For the first form, show "Client"
                        "Client"
                      : // After removing the client, family members should be properly indexed
                        familyMember?.family_member_name || "Family Member"}
                  </h3> */}
                  <h3 className="font-bold tracking-wide">{heading}</h3>

                  <div className="w-full mb-5 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
                    {/* Company Name */}
                    <div className="relative">
                      <Label
                        className="font-normal"
                        htmlFor={`term_plan_data[${index}].term_company_name`}
                      >
                        Company Name: <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`term_plan_data[${index}].term_company_name`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id={`term_plan_data[${index}].term_company_name`}
                            className="mt-1"
                            type="text"
                            placeholder="Enter company name"
                          />
                        )}
                      />
                      {errors.term_plan_data?.[index]?.term_company_name && (
                        <p className="absolute text-red-500 text-sm mt-1 left-0">
                          {
                            errors.term_plan_data[index].term_company_name
                              ?.message
                          }
                        </p>
                      )}
                    </div>

                    {/* Broker Name */}
                    <div className="relative">
                      <Label
                        className="font-normal"
                        htmlFor={`term_plan_data[${index}].broker_name`}
                      >
                        Broker Name: <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`term_plan_data[${index}].broker_name`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id={`term_plan_data[${index}].broker_name`}
                            className="mt-1"
                            type="text"
                            placeholder="Enter broker name"
                          />
                        )}
                      />
                      {errors.term_plan_data?.[index]?.broker_name && (
                        <p className="absolute text-red-500 text-sm mt-1 left-0">
                          {errors.term_plan_data[index].broker_name?.message}
                        </p>
                      )}
                    </div>

                    {/* Proposal Date */}
                    <div className="relative">
                      <Label
                        className="font-normal"
                        htmlFor={`term_plan_data[${index}].proposal_date`}
                      >
                        Proposal Date: <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`term_plan_data[${index}].proposal_date`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            id={`term_plan_data[${index}].proposal_date`}
                            className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                            type="date"
                            placeholder="Enter proposal date"
                          />
                        )}
                      />
                      {errors.term_plan_data?.[index]?.proposal_date && (
                        <p className="absolute text-red-500 text-sm mt-1 left-0">
                          {errors.term_plan_data[index].proposal_date?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="w-full mb-5 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
                    {/* Sum Insured */}
                    <div className="relative">
                      <Label
                        className="font-normal"
                        htmlFor={`term_plan_data[${index}].sum_insured`}
                      >
                        Sum Insured: <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`term_plan_data[${index}].sum_insured`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id={`term_plan_data[${index}].sum_insured`}
                            className="mt-1"
                            type="number"
                            placeholder="Enter sum insured"
                          />
                        )}
                      />
                      {errors.term_plan_data?.[index]?.sum_insured && (
                        <p className="absolute text-red-500 text-sm mt-1 left-0">
                          {errors.term_plan_data[index].sum_insured?.message}
                        </p>
                      )}
                    </div>

                    {/* Premium Payment Mode */}
                    <div className="relative">
                      <Label
                        className="font-normal"
                        htmlFor={`term_plan_data[${index}].premium_payment_mode`}
                      >
                        Premium Payment Mode:{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`term_plan_data[${index}].premium_payment_mode`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue className="" placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Select</SelectLabel>
                                <SelectItem value="Monthly">Monthly</SelectItem>
                                <SelectItem value="Quarterly">
                                  Quarterly
                                </SelectItem>
                                <SelectItem value="Semi-Annual">
                                  Semi-Annual
                                </SelectItem>
                                <SelectItem value="Annual">Annual</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.term_plan_data?.[index]?.premium_payment_mode && (
                        <p className="absolute text-red-500 text-sm mt-1 left-0">
                          {
                            errors.term_plan_data[index].premium_payment_mode
                              ?.message
                          }
                        </p>
                      )}
                    </div>

                    {/* End Date */}
                    <div className="relative">
                      <Label
                        className="font-normal"
                        htmlFor={`term_plan_data[${index}].end_date`}
                      >
                        End Date:
                      </Label>
                      <Controller
                        name={`term_plan_data[${index}].end_date`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            id={`term_plan_data[${index}].end_date`}
                            className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                            type="date"
                            placeholder="Enter end date"
                          />
                        )}
                      />
                      {errors.term_plan_data?.[index]?.end_date && (
                        <p className="absolute text-red-500 text-sm mt-1 left-0">
                          {errors.term_plan_data[index].end_date?.message}
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
                  <div className="w-full mb-5 grid grid-cols-1 md:grid-cols-9 gap-7 md:gap-4">
                    {/* <Button
                      type="button"
                      onClick={() => {
                        remove(index); // Remove the family member or client form

                        if (index === 0) {
                          // If the client is removed, remove the client from the familyMembers array
                          setFamilyMembers(familyMembers.slice(1)); // Remove the client (first element)
                        } else {
                          // If a family member is removed, just remove that member
                          setFamilyMembers((prevMembers) => {
                            const updatedMembers = [...prevMembers];
                            updatedMembers.splice(index - 1, 1); // Remove the family member corresponding to the index
                            return updatedMembers;
                          });
                        }
                      }}
                      className="mt-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      Remove
                    </Button> */}
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
                onClick={() => navigate("/term_plans")}
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
