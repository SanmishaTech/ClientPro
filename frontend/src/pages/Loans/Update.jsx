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
  bank_name: z
    .string()
    .min(1, "Bank name field is required.")
    .max(100, "Bank name must be at max 100 characters")
    .regex(/^[A-Za-z\s\u0900-\u097F]+$/, "Bank name can only contain letters."),
  loan_type: z
    .string()
    .min(1, "Loan type field is required.")
    .max(100, "Loan Type must be at max 100 characters")
    .regex(/^[A-Za-z\s\u0900-\u097F]+$/, "Loan type can only contain letters."),
  start_date: z.string().min(1, "Start Date is required"),
  end_date: z.string().min(1, "End date is required"),
  loan_amount: z.coerce
    .number()
    .min(1, "Loan amount field is required.")
    .max(99999999, "Loan amount must not exceed 9,99,99,999."),
  term: z.coerce
    .number()
    .min(1, "Term field is required.")
    .max(50, "Term field must not exceed 50 years."),
  emi: z.coerce
    .number()
    .min(1, "Emi field is required.")
    .max(99999999, "Emi field must not exceed 9,99,99,999."),
  roi: z.coerce
    .number()
    .min(1, "ROI field is required.")
    .max(100, "ROI field must not exceed 100."),
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
    loan_type: "",
    start_date: "",
    end_date: "",
    bank_name: "",
    loan_amount: "",
    term: "",
    emi: "",
    roi: "",
    family_member_id: "",
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
    reset,
  } = useForm({ resolver: zodResolver(formSchema), defaultValues });
  const selectedClient = watch("client_id") || null;
  const {
    data: editLoan,
    isLoading: isEditLoanDataLoading,
    isError: isEditLoanDataError,
  } = useQuery({
    queryKey: ["editLoan", id], // This is the query key
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/loans/${id}`, {
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
    if (editLoan) {
      setValue("client_id", editLoan.Loan?.client_id || "");
      setValue("bank_name", editLoan.Loan?.bank_name || "");
      setValue("loan_type", editLoan.Loan?.loan_type || "");
      setValue("loan_amount", editLoan.Loan?.loan_amount || "");
      setValue("emi", editLoan.Loan?.emi || "");
      setValue("roi", editLoan.Loan?.roi || "");
      setValue("term", editLoan.Loan?.term || "");
      setValue("start_date", editLoan.Loan?.start_date || "");
      setValue("end_date", editLoan.Loan?.end_date || "");
      // setValue(
      //   "family_member_id",
      //   editLoan?.Loan?.family_member_id
      //     ? String(editLoan?.Loan?.family_member_id)
      //     : ""
      // );
      setTimeout(() => {
        setValue(
          "family_member_id",
          editLoan?.Loan?.family_member_id
            ? String(editLoan?.Loan?.family_member_id)
            : ""
        );
      }, 200); // 1000
    }
  }, [editLoan, setValue]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(`/api/loans/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the Bearer token
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("loans");

      toast.success("Loans Updated Successfully");
      setIsLoading(false);
      navigate("/loans");
    },
    onError: (error) => {
      setIsLoading(false);
      if (error.response && error.response.data.errors) {
        const serverStatus = error.response.data.status;
        const serverErrors = error.response.data.errors;
        if (serverStatus === false) {
          if (serverErrors.bank_name) {
            setError("bank_name", {
              type: "manual",
              message: serverErrors.bank_name[0], // The error message from the server
            });
            // toast.error("The poo has already been taken.");
          }
        } else {
          toast.error("Failed to Update loan details.");
        }
      } else {
        toast.error("Failed to Update loan details.");
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
                onClick={() => navigate("/loans")}
                className="p-0 text-blue-700 text-sm font-light"
                variant="link"
              >
                Loans
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
            <h2 className="text-lg  font-normal">Edit Loan</h2>
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
                  <p className=" text-red-500 text-sm mt-1 left-0">
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

            <div className="w-full mb-2 grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="bank_name">
                  Bank Name: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="bank_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="bank_name"
                      className="mt-1"
                      type="text"
                      placeholder="Enter bank name"
                    />
                  )}
                />
                {errors.bank_name && (
                  <p className=" text-red-500 text-sm mt-1 left-0">
                    {errors.bank_name.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="loan_type">
                  Loan type: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="loan_type"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue className="" placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel className="">
                            Select loan type
                          </SelectLabel>
                          <SelectItem value="Home Loan">Home Loan</SelectItem>
                          <SelectItem value="Personal Loan">
                            Personal Loan
                          </SelectItem>
                          <SelectItem value="Car Loan">Car Loan</SelectItem>
                          <SelectItem value="Business Loan">
                            Business Loan
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.loan_type && (
                  <p className=" text-red-500 text-sm mt-1 left-0">
                    {errors.loan_type.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full mb-2 grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="start_date">
                  Start Date:<span className="text-red-500">*</span>
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
                  <p className=" text-red-500 text-sm mt-1 left-0">
                    {errors.start_date.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="end_date">
                  End Date:<span className="text-red-500">*</span>
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
                  <p className=" text-red-500 text-sm mt-1 left-0">
                    {errors.end_date.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full mb-2 grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="loan_amount">
                  Loan Amount: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="loan_amount"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="loan_amount"
                      className="mt-1"
                      type="number"
                      placeholder="Enter Loan amount"
                    />
                  )}
                />
                {errors.loan_amount && (
                  <p className=" text-red-500 text-sm mt-1 left-0">
                    {errors.loan_amount.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="term">
                  Term (In Years): <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="term"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="term"
                      className="mt-1"
                      type="number"
                      placeholder="Enter term"
                    />
                  )}
                />
                {errors.term && (
                  <p className=" text-red-500 text-sm mt-1 left-0">
                    {errors.term.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full mb-2 grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="emi">
                  Emi: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="emi"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="emi"
                      className="mt-1"
                      type="number"
                      placeholder="Enter Emi amount"
                    />
                  )}
                />
                {errors.emi && (
                  <p className=" text-red-500 text-sm mt-1 left-0">
                    {errors.emi.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="roi">
                  ROI (%): <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="roi"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="roi"
                      className="mt-1"
                      type="number"
                      placeholder="Enter ROI"
                    />
                  )}
                />
                {errors.roi && (
                  <p className=" text-red-500 text-sm mt-1 left-0">
                    {errors.roi.message}
                  </p>
                )}
              </div>
            </div>

            {/* row ends */}
            <div className="w-full gap-4 mt-4 flex justify-end items-center">
              <Button
                type="button"
                className="dark:text-white shadow-xl bg-red-600 hover:bg-red-700"
                onClick={() => navigate("/loans")}
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
