import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2, Check, ChevronsUpDown, CircleX } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

import axios from "axios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const formSchema = z.object({
  client_id: z.coerce.number().min(1, "Client ID field is required."),
});

const index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const [openClient, setOpenClient] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const navigate = useNavigate();
  const defaultValues = {
    client_id: "",
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm({ resolver: zodResolver(formSchema), defaultValues });

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

  const handlePrint = async (data) => {
    try {
      const response = await axios.post(`/api/client_report`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Ensure the response is a blob (PDF file)
      });

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      // link.download = `AllReceiptReport-${Date.now()}.pdf`; // Use current timestamp for unique file name
      const currentDate = new Date();
      const day = ("0" + currentDate.getDate()).slice(-2); // Ensure two digits for day
      const month = ("0" + (currentDate.getMonth() + 1)).slice(-2); // Ensure two digits for month
      const year = currentDate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;
      link.href = url;
      link.download = `ClientPortfolio_${formattedDate}.pdf`; // Use formatted date in the filename

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Invalidate the queries related to the "lead" data
      toast.success("Report Printed Successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorData = error.response.data;
          if (error.response.status === 401 && errorData.status === false) {
            toast.error(errorData.errors.error);
          } else {
            toast.error("Failed to generate Report.");
          }
        } else {
          console.error("Error:", error);
          toast.error("Failed to generate Report.");
        }
      } else {
        console.error("Unexpected error:", error);
        toast.error("Failed to generate Report.");
      }
    }
  };

  //   const storeMutation = useMutation({
  //     mutationFn: async (data) => {
  //       const response = await axios.post("/api/all_receipt_report", data, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`, // Include the Bearer token
  //         },
  //       });
  //       return response.data;
  //     },
  //     onSuccess: (data) => {
  //       toast.success("Report Generated Successfully");
  //       setIsLoading(false);
  //     },
  //     onError: (error) => {
  //       setIsLoading(false);
  //       if (error.response && error.response.data.errors) {
  //         const serverStatus = error.response.data.status;
  //         const serverErrors = error.response.data.errors;
  //         if (serverStatus === false) {
  //           toast.error("Failed to Generate report.");
  //         } else {
  //           toast.error("Failed to Generate report.");
  //         }
  //       } else {
  //         toast.error("Failed to Generate report.");
  //       }
  //     },
  //   });

  const onSubmit = (data) => {
    setIsLoading(true);
    // storeMutation.mutate(data);

    handlePrint(data);
    setIsLoading(false);
  };

  return (
    <>
      <div className="p-5">
        <div className="w-full mb-7">
          <h1 className="text-4xl">Report</h1>
        </div>
        <div className="px-5 pb-7 dark:bg-background pt-1 w-full bg-white shadow-lg border  rounded-md">
          <div className="w-full py-3 flex justify-start items-center">
            <h2 className="text-lg  font-normal">Client Portfolio</h2>
          </div>
          {/* row starts */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full mb-6 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
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
            {/* <h2 className="text-2xl mb-2">categories</h2> */}

            <div className="w-full gap-4 mt-4 flex justify-end items-center">
              <Button
                type="button"
                className="dark:text-white shadow-xl bg-red-600 hover:bg-red-700"
                onClick={() => navigate("/")}
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

export default index;
