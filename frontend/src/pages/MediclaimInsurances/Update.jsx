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
  // devta_name: z.string().min(2, "Name must be at least 2 characters"),
  client_id: z.coerce.number().min(1, "client field is required."),
  family_member_id: z.string().optional(),
  company_name: z
    .string()
    .min(1, "Company name field is required.")
    .max(100, "Company name must not exceed 100 characters.")
    .regex(
      /^[A-Za-z\s\u0900-\u097F]+$/,
      "Company name can only contain letters."
    ),

  broker_name: z
    .string() // ensures broker_name is a string
    .max(100, "Broker name must not exceed 100 characters.") // enforces a max length of 100 characters
    .refine((val) => val === "" || /^[A-Za-z\s\u0900-\u097F]+$/.test(val), {
      message: "Broker name can only contain letters.", // ensures only letters and spaces or Hindi characters are allowed
    })
    .optional(), // makes the broker_name field optional

  policy_number: z
    .string()
    .min(1, "Policy number field is required.")
    .max(100, "Policy number must not exceed 100 characters."),
  // plan_name: z
  //   .string()
  //   .min(1, "Plan name field is required.")
  //   .max(100, "Plan name must not exceed 100 characters."),
  plan_name: z
    .string()
    .min(1, "Plan name field is required.")
    .max(100, "Plan name must not exceed 100 characters.")
    .regex(/^[A-Za-z\s\u0900-\u097F]+$/, "Plan name can only contain letters."),
  premium: z.coerce
    .number()
    .min(1, "Premium field is required.")
    .max(99999999, "Premium field must not exceed 9,99,99,999."),

  proposal_date: z.string().min(1, "Proposal date field is required."),

  premium_payment_mode: z
    .string()
    .max(100, "Premium payment mode field must not exceed 100 characters."),

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
    broker_name: "",
    proposal_date: "",
    company_name: "",
    premium_payment_mode: "",
    sum_insured: "",
    end_date: "",
    policy_number: "",
    plan_name: "",
    premium: "",
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
    data: editMediclaim,
    isLoading: isEditMediclaimDataLoading,
    isError: isEditMediclaimDataError,
  } = useQuery({
    queryKey: ["editMediclaimInsurance", id], // This is the query key
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/mediclaim_insurances/${id}`, {
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
    if (editMediclaim) {
      setValue("client_id", editMediclaim.MediclaimInsurance?.client_id || "");
      setValue(
        "company_name",
        editMediclaim.MediclaimInsurance?.company_name || ""
      );
      setValue(
        "broker_name",
        editMediclaim.MediclaimInsurance?.broker_name || ""
      );
      setValue(
        "proposal_date",
        editMediclaim.MediclaimInsurance?.proposal_date || ""
      );
      setValue(
        "premium_payment_mode",
        editMediclaim.MediclaimInsurance?.premium_payment_mode || ""
      );
      setValue(
        "sum_insured",
        editMediclaim.MediclaimInsurance?.sum_insured || ""
      );
      setValue("end_date", editMediclaim.MediclaimInsurance?.end_date || "");
      setValue(
        "policy_number",
        editMediclaim.MediclaimInsurance?.policy_number || ""
      );
      setValue("plan_name", editMediclaim.MediclaimInsurance?.plan_name || "");
      setValue("premium", editMediclaim.MediclaimInsurance?.premium || "");

      setTimeout(() => {
        setValue(
          "family_member_id",
          editMediclaim?.MediclaimInsurance?.family_member_id
            ? String(editMediclaim?.MediclaimInsurance?.family_member_id)
            : ""
        );
      }, 200); // 1000
    }
  }, [editMediclaim, setValue]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(
        `/api/mediclaim_insurances/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the Bearer token
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("mediclaim_insurances");

      toast.success("Mediclaim Insurance Updated Successfully");
      setIsLoading(false);
      navigate("/mediclaim_insurances");
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
          toast.error("Failed to update Mediclaim insurance details.");
        }
      } else {
        toast.error("Failed to update Mediclaim insurance details.");
      }
    },
  });
  const onSubmit = (data) => {
    setIsLoading(true);
    const isCancelled = editMediclaim?.MediclaimInsurance?.cancelled === 0;
    if (isCancelled) {
      updateMutation.mutate(data);
    } else {
      setIsLoading(false);
      toast.error("Cannot Update Cancelled Mediclaim Insurance.");
      navigate("/mediclaim_insurances");
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
                onClick={() => navigate("/mediclaim_insurances")}
                className="p-0 text-blue-700 text-sm font-light"
                variant="link"
              >
                Mediclaim Insurances
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
            <h2 className="text-lg  font-normal">Edit Mediclaim Insurance</h2>
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
            </div>
            <div className="w-full mb-5 grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-4">
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
              <div className="relative">
                <Label className="font-normal" htmlFor="broker_name">
                  Broker Name:
                </Label>
                <Controller
                  name="broker_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="broker_name"
                      className="mt-1"
                      type="text"
                      placeholder="Enter broker name"
                    />
                  )}
                />
                {errors.broker_name && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.broker_name.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full mb-5 grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="proposal_date">
                  Proposal Date: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="proposal_date"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="proposal_date"
                      className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                      type="date"
                      placeholder="Enter to date"
                    />
                  )}
                />
                {errors.proposal_date && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.proposal_date.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="sum_insured">
                  Sum Insured: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="sum_insured"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="sum_insured"
                      className="mt-1"
                      type="number"
                      placeholder="Enter amount"
                    />
                  )}
                />
                {errors.sum_insured && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.sum_insured.message}
                  </p>
                )}
              </div>

              {/* <div className="relative">
                <Label className="font-normal" htmlFor="premium_payment_mode">
                  Premium Payment Mode: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="premium_payment_mode"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="premium_payment_mode"
                      className="mt-1"
                      type="text"
                      placeholder="Enter mode"
                    />
                  )}
                />
                {errors.premium_payment_mode && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.premium_payment_mode.message}
                  </p>
                )}
              </div> */}
            </div>
            <div className="w-full mb-5 grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="premium_payment_mode">
                  Premium Payment Mode:
                </Label>
                <Controller
                  name="premium_payment_mode"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue className="" placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel className="">Select</SelectLabel>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="Quarterly">Quarterly</SelectItem>
                          <SelectItem value="Semi-Annual">
                            Semi-Annual
                          </SelectItem>
                          <SelectItem value="Annual">Annual</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.premium_payment_mode && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.premium_payment_mode.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="end_date">
                  End Date:
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
            <div className="w-full mb-5 grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="policy_number">
                  Policy Number: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="policy_number"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="policy_number"
                      className="mt-1"
                      type="text"
                      placeholder="Enter policy number"
                    />
                  )}
                />
                {errors.policy_number && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.policy_number.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="plan_name">
                  Plan Name: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="plan_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="plan_name"
                      className="mt-1"
                      type="text"
                      placeholder="Enter plan name"
                    />
                  )}
                />
                {errors.plan_name && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.plan_name.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full mb-5 grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-4">
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
                      placeholder="Enter company name"
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
                onClick={() => navigate("/mediclaim_insurances")}
              >
                Cancel
              </Button>
              {editMediclaim?.MediclaimInsurance?.cancelled === 1 ? (
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
