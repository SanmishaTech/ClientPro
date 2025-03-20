import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  File,
  PlusCircle,
  Search,
  Pencil,
  Trash,
  MoreHorizontal,
  ListFilter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// new
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";

import { Loader2, CircleX } from "lucide-react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css"; // Import styles for the phone input
import { toTitleCase } from "../../lib/titleCase.js";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  // temp: z
  //   .any() // Allow any type initially
  //   .refine(
  //     (val) => {
  //       // Custom check to validate the file
  //       return val;
  //     },
  //     {
  //       message: "A valid file is required", // Custom message
  //     }
  //   ), // Check if the field is a valid
  client_documents: z
    .array(
      z
        .object({
          client_name: z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must be at max 100 characters")
            .regex(
              /^[A-Za-z\s\u0900-\u097F]+$/,
              "Name can only contain letters."
            ), // Allow letters and spaces, including Marathi
          client_file: z
            .any() // Allow any type initially
            .refine(
              (val) => {
                // Custom check to validate the file
                return (
                  val && val[0] && val[0].size > 0 && val[0] instanceof Blob
                );
              },
              {
                message: "A valid file is required", // Custom message
              }
            ), // Check if the field is a valid
        })
        .optional()
    )
    .min(1, "At least one document is required"), // Ensure the array has at least one document
});
const UploadImage = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const navigate = useNavigate();
  //   const defaultValues = {
  //     client_name: "",
  //     client_file: "",

  //   };
  const defaultValues = {
    // temp: "",
    client_documents: [
      {
        client_name: "",
        client_file: "", // Initially empty, will be replaced when the file is selected
      },
    ],
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm({ resolver: zodResolver(formSchema), defaultValues });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "client_documents", // The name for the family members array
  });

  const storeMutation = useMutation({
    mutationFn: async (formData) => {
      //   const formData = new FormData();
      //   formData.append("_method", "put");
      //   data.client_documents.forEach((doc, index) => {
      //     formData.append(
      //       `client_documents[${index}].client_name`,
      //       doc.client_name
      //     );
      //     formData.append(
      //       `client_documents[${index}].client_file`,
      //       doc.client_file
      //     ); // Assuming it's an array of files
      //   });
      const response = await axios.post(`/api/get_client/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Include the Bearer token
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("users");
      toast.success("Client details added Successfully");
      setIsLoading(false);
      navigate("/clients");
    },
    onError: (error) => {
      setIsLoading(false);
      if (error.response && error.response.data.errors) {
        const serverStatus = error.response.data.status;
        const serverErrors = error.response.data.errors;
        if (serverStatus === false) {
          if (serverErrors.email) {
            setError("email", {
              type: "manual",
              message: serverErrors.email[0], // The error message from the server
            });
            toast.error("Email has already been taken.");
          }
          if (serverErrors.mobile) {
            setError("mobile", {
              type: "manual",
              message: serverErrors.mobile[0], // The error message from the server
            });
            toast.error("mobile number has already been taken.");
          }
          if (serverErrors.mobile_2) {
            setError("mobile_2", {
              type: "manual",
              message: serverErrors.mobile_2[0], // The error message from the server
            });
            toast.error("mobile number has already been taken.");
          }
          if (serverErrors.client_name) {
            setError("client_name", {
              type: "manual",
              message: serverErrors.client_name[0], // The error message from the server
            });
            toast.error("Client Name has already been taken.");
          }
        } else {
          toast.error("Failed to Add Client details 1.");
        }
      } else {
        console.log(error);
        toast.error("Failed to Add Client details 2.");
      }
    },
  });

  // const onSubmit = (data) => {
  //   setIsLoading(true);

  //   // Create a new FormData object
  //   const formData = new FormData();
  //   formData.append("_method", "put");
  //   formData.append("temp", data.temp);

  //   // Loop through the client_documents array
  //   data.client_documents.forEach((doc, index) => {
  //     // Append the client_name as usual
  //     formData.append(
  //       `client_documents[${index}].client_name`,
  //       doc.client_name
  //     );

  //     // Append the file directly (it will be sent in binary)
  //     if (doc.client_file) {
  //       formData.append(
  //         `client_documents[${index}].client_file`,
  //         doc.client_file // The browser will send this in binary format automatically
  //       );
  //     }
  //   });

  //   // Send the FormData via mutation
  //   storeMutation.mutate(formData);
  // };

  const onSubmit = (data) => {
    setIsLoading(true);

    // Create a new FormData object
    const formData = new FormData();

    // Append the method and other necessary data
    formData.append("_method", "put");

    // Loop through the client_documents array and append both client_name and client_file together
    data.client_documents.forEach((doc, index) => {
      // Ensure both client_name and client_file are added together under the same index
      formData.append(
        `client_documents[${index}].client_name`,
        doc.client_name
      );

      // Append the file for the current document if it exists
      if (doc.client_file) {
        formData.append(
          `client_documents[${index}].client_file`,
          doc.client_file // File will be sent in binary automatically
        );
      }
    });

    // Send the FormData via your mutation or API call
    storeMutation.mutate(formData);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          {/* <Button variant="outline">Edit Profile</Button> */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-sm justify-start"
          >
            <File /> Upload Image
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[100%]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Upload Documents</DialogTitle>
              <DialogDescription>
                Upload the documents of clients and its family members.
              </DialogDescription>
            </DialogHeader>

            {fields &&
              fields.map((item, index) => (
                <div
                  key={item.id}
                  className=" dark:border-b dark:border-gray-600"
                >
                  <div className="w-full mb-8 grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-4">
                    <div className="relative">
                      <Label
                        className="font-normal"
                        htmlFor={`client_documents[${index}].client_name`}
                      >
                        File Name:
                        <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`client_documents[${index}].client_name`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id={`client_documents[${index}].client_name`}
                            className="mt-1"
                            placeholder="Enter name"
                            onChange={(e) => {
                              const formatedValue = toTitleCase(e.target.value);
                              field.onChange(formatedValue);
                            }}
                          />
                        )}
                      />
                      {errors.client_documents?.[index]?.client_name && (
                        <p className=" text-red-500 text-sm mt-1 left-0">
                          {errors.client_documents[index].client_name.message}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <Label
                        className="font-normal"
                        htmlFor={`client_documents[${index}].client_file`}
                      >
                        File:
                        <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`client_documents[${index}].client_file`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            id={`client_documents[${index}].client_file`}
                            type="file"
                            onChange={(e) => {
                              // Access the selected file directly from event and update form
                              if (e.target.files && e.target.files[0]) {
                                field.onChange(e.target.files[0]); // Pass the file as a File object
                              }
                            }}
                            className="mt-1"
                            placeholder="Enter client_file"
                          />
                        )}
                      />
                      {errors.client_documents?.[index]?.client_file && (
                        <p className="text-red-500 text-sm mt-1 left-0">
                          {errors.client_documents[index].client_file.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* <div className="relative">
                    <Label className="font-normal" htmlFor="temp">
                      File:
                      <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="temp"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="temp"
                          type="file"
                          onChange={(e) => {
                            // Access the selected file directly from event and update form
                            if (e.target.files && e.target.files[0]) {
                              field.onChange(e.target.files[0]); // Pass the file as a File object
                            }
                          }}
                          className="mt-1"
                          placeholder="Enter client_file"
                        />
                      )}
                    />
                    {errors.client_documents?.[index]?.client_file && (
                      <p className="text-red-500 text-sm mt-1 left-0">
                        {errors.client_documents[index].client_file.message}
                      </p>
                    )}
                  </div> */}

                  <Button
                    type="button"
                    onClick={() => remove(index)} // Remove family member
                    variant="ghost"
                    className="text-sm  bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 hover:dark:bg-gray-900"
                  >
                    <CircleX size={16} color="#fa0000" />
                  </Button>
                </div>
              ))}
            {/* Add Family Member Button */}
            {/* <div className="flex"> */}
            <div className="flex justify-start">
              <Button
                type="button"
                onClick={() =>
                  append({
                    client_name: "",
                    client_file: "",
                  })
                } // Add new family member
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                +
              </Button>
            </div>

            <DialogFooter>
              <Button type="button" className="bg-red-500">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-500">
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UploadImage;
