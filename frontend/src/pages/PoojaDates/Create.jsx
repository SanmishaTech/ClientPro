import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, CircleX } from "lucide-react";

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

const formSchema = z.object({
  // pooja_date: z.array(z.string().min(1, "Pooja date is required.")),
  // pooja_date: z
  //   .array(
  //     z.string().refine((val) => !isNaN(Date.parse(val)), {
  //       message: "Invalid date format",
  //     })
  //   )
  //   .min(1, "At least one pooja date is required."),
  pooja_type_id: z.coerce.number().min(1, "pooja type field is required"),
});
const Create = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const [poojaDates, setPoojaDates] = useState([{ pooja_date: "" }]); // Initialize with one empty date

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const navigate = useNavigate();
  const defaultValues = {
    pooja_type_id: "",
    // pooja_date: "",
    pooja_date: poojaDates.map((dateObj) => dateObj.pooja_date), // Map the pooja dates to defaultValues
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ resolver: zodResolver(formSchema), defaultValues });

  const {
    data: allPoojaTypesData,
    isLoading: isAllPoojaTypeDataLoading,
    isError: isAllPoojaTypeDataError,
  } = useQuery({
    queryKey: ["allPoojaType"], // This is the query key
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/all_pooja_types_multiple`, {
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

  const storeMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post("/api/pooja_dates", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the Bearer token
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("poojaDates");
      toast.success("Pooja Date Added Successfully");
      setIsLoading(false);
      navigate("/pooja_dates");
    },
    onError: (error) => {
      setIsLoading(false);
      if (error.response && error.response.data.errors) {
        const serverStatus = error.response.data.status;
        const serverErrors = error.response.data.errors;
        if (serverStatus === false) {
          if (serverErrors.date) {
            toast.error(
              `Date ${serverErrors.Date} already exists for this pooja type.`
            );
          }
        } else {
          toast.error("Failed to add Pooja Date.");
        }
      } else {
        toast.error("Failed to add Pooja Date.");
      }
    },
  });
  const onSubmit = (data) => {
    setIsLoading(true);
    const poojaTypeId = data.pooja_type_id; // Assuming `pooja_type_id` is passed in form data

    // Extract the pooja dates (this assumes that poojaDates state has been updated accordingly)
    const poojaDatesArray = poojaDates.map((dateObj) => dateObj.pooja_date);

    // Check for any invalid date entries
    const invalidDates = poojaDatesArray.filter(
      (date) => !date || isNaN(Date.parse(date))
    );

    if (invalidDates.length > 0) {
      toast.error("Please fill in all the pooja dates with valid formats.");
      setIsLoading(false);
      return;
    }

    // Prepare the payload with only the dates
    const poojaData = {
      pooja_type_id: poojaTypeId, // Include pooja_type_id
      pooja_dates: poojaDatesArray, // Only send the pooja dates array
    };

    // Send the mutation request
    storeMutation.mutate(poojaData);
  };

  // Handle adding new date field
  const addDateField = () => {
    setPoojaDates([...poojaDates, { pooja_date: "" }]);
  };

  const handleDateChange = (index, value) => {
    const updatedPoojaDates = [...poojaDates];
    updatedPoojaDates[index].pooja_date = value;
    setPoojaDates(updatedPoojaDates);
  };

  const removeDateField = (index) => {
    const updatedPoojaDates = poojaDates.filter((_, i) => i !== index); // Remove the date at the given index
    setPoojaDates(updatedPoojaDates);
  };

  return (
    <>
      <div className="p-5">
        {/* breadcrumb start */}
        <div className=" mb-7 text-sm">
          <div className="flex items-center space-x-2 text-gray-700">
            <span className="">
              <Button
                onClick={() => navigate("/pooja_dates")}
                className="p-0 text-blue-700 text-sm font-light"
                variant="link"
              >
                Pooja Dates
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
            <h2 className="text-lg  font-normal">Add Pooja Date</h2>
          </div>
          {/* row starts */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full mb-8 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="pooja_type_id">
                  Pooja Type: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="pooja_type_id"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select Pooja Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select Pooja Type</SelectLabel>
                          {allPoojaTypesData?.PoojaTypes &&
                            allPoojaTypesData?.PoojaTypes.map((poojaType) => (
                              <SelectItem value={String(poojaType.id)}>
                                {poojaType.pooja_type}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.pooja_type_id && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.pooja_type_id.message}
                  </p>
                )}
              </div>
              {poojaDates.map((dateField, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center space-x-2"
                >
                  {" "}
                  {/* Use flex and space-x-4 to create space between items */}
                  <div className="flex-1">
                    {" "}
                    {/* This will make the input take all available space */}
                    <Label
                      className="font-normal"
                      htmlFor={`pooja_date_${index}`}
                    >
                      Pooja Date {index + 1}:{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <input
                      id={`pooja_date_${index}`}
                      className="mt-1 dark:bg-[var(--foreground)] text-sm w-full p-2 rounded-md border border-1"
                      type="date"
                      value={dateField.pooja_date}
                      onChange={(e) => handleDateChange(index, e.target.value)}
                      placeholder="Enter pooja date"
                    />
                  </div>
                  {errors.pooja_date && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.pooja_date.message}
                    </p>
                  )}
                  {/* Remove Button */}
                  {poojaDates.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-sm mt-[23px] bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 hover:dark:bg-gray-900"
                      onClick={() => removeDateField(index)}
                    >
                      <CircleX size={16} color="#fa0000" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {/* row ends */}
            <div className="w-full gap-4 mt-4 flex justify-end items-center">
              <Button
                type="button"
                className="dark:text-white shadow-xl bg-blue-600 hover:bg-blue-700"
                onClick={addDateField}
              >
                Add Another Date
              </Button>
              <Button
                type="button"
                className="dark:text-white shadow-xl bg-red-600 hover:bg-red-700"
                onClick={() => navigate("/pooja_dates")}
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
