import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css"; // Import styles for the phone input
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
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const formSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .max(100, "Email must be at max 100 characters")
    .nonempty("Email field is required"),
  client_name: z
    .string()
    .min(1, "Name field is required.")
    .max(100, "Name must be at max 100 characters")
    .regex(/^[A-Za-z\s\u0900-\u097F]+$/, "Name can only contain letters."), // Allow letters and spaces, including Marathi
  office_address: z
    .string()
    .max(200, "Office address must be at max 200 characters")
    .optional(),
  office_address_pincode: z
    .string()
    .refine((val) => val === "" || /^\d{6}$/.test(val), {
      message: "Pincode must be of 6 digits.",
    })
    .optional(),
  residential_address: z
    .string()
    .min(1, "Residential address field is required.")
    .max(200, "Residential address must be at max 200 characters"),
  residential_address_pincode: z
    .string()
    .refine((val) => /^\d{6}$/.test(val), {
      message: "Pincode must be of 6 digits.",
    })
    .optional(),
  mobile: z.string().refine((val) => /^[0-9]{10}$/.test(val), {
    message: "Mobile number must contain exact 10 digits.",
  }),
  date_of_birth: z.string().min(1, "Date of birth field is required."),
  family_members: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, "Name field is required")
          .max(100, "Name must be at max 100 characters")
          .regex(
            /^[A-Za-z\s\u0900-\u097F]+$/,
            "Name can only contain letters."
          ),
        relation: z
          .string()
          .min(1, "Relation field is required")
          .max(100, "Relation must be at max 100 characters")
          .regex(
            /^[A-Za-z\s\u0900-\u097F]+$/,
            "Relation can only contain letters."
          ),
        date_of_birth: z.string().min(1, "Date of birth is required"),
      })
    )
    .optional(),
});
const Create = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const navigate = useNavigate();
  const defaultValues = {
    email: "",
    client_name: "",
    mobile: "",
    date_of_birth: "",
    office_address: "",
    office_address_pincode: "",
    residential_address: "",
    residential_address_pincode: "",
    family_members: [],
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
    name: "family_members", // The name for the family members array
  });

  const storeMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post("/api/clients", data, {
        headers: {
          "Content-Type": "application/json",
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
          if (serverErrors.client_name) {
            setError("client_name", {
              type: "manual",
              message: serverErrors.client_name[0], // The error message from the server
            });
            toast.error("Client Name has already been taken.");
          }
        } else {
          toast.error("Failed to Add Client details.");
        }
      } else {
        toast.error("Failed to Add Client details.");
      }
    },
  });
  const onSubmit = (data) => {
    setIsLoading(true);
    storeMutation.mutate(data);
  };

  return (
    <>
      <div className="p-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* breadcrumb start */}
          <div className=" mb-7 text-sm">
            <div className="flex items-center space-x-2 text-gray-700">
              <span className="">
                {/* Users */}
                <Button
                  onClick={() => navigate("/clients")}
                  className="p-0 text-blue-700 text-sm font-light"
                  variant="link"
                  type="button"
                >
                  Clients
                </Button>
              </span>
              <span className="text-gray-400">/</span>
              <span className="dark:text-gray-300">Add</span>
            </div>
          </div>
          {/* breadcrumb ends */}
          {/* form style strat */}
          <div className="px-5 pb-7 dark:bg-background pt-1 w-full bg-white shadow-lg border  rounded-md">
            <div className="w-full pt-3 pb-1 flex justify-start items-center">
              <h2 className="text-lg  font-normal">Personal Information</h2>
            </div>
            {/* row starts */}
            <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="client_name">
                  Client Name: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="client_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="client_name"
                      className="mt-1"
                      type="text"
                      placeholder="Enter name"
                    />
                  )}
                />
                {errors.client_name && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.client_name.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <Label className="font-normal" htmlFor="email">
                  Email: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="email"
                      className="mt-1"
                      type="email"
                      placeholder="Enter email"
                    />
                  )}
                />
                {errors.email && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="date_of_birth">
                  Date of Birth:<span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="date_of_birth"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="date_of_birth"
                      className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                      type="date"
                      placeholder="Enter to date"
                    />
                  )}
                />
                {errors.date_of_birth && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.date_of_birth.message}
                  </p>
                )}
              </div>
            </div>
            {/* row ends */}
            {/* row starts */}
            <div className="w-full mb-2 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="mobile">
                  Mobile:<span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="mobile"
                  control={control}
                  rules={{
                    required: "Mobile number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Mobile number must be exact 10 digits",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="mobile"
                      className="mt-1"
                      type="text"
                      placeholder="Enter mobile"
                      maxLength={10} // Enforce max length of 10 digits
                    />
                  )}
                />
                {errors.mobile && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.mobile.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full pt-3 pb-1 flex justify-start items-center">
              <h2 className="text-lg  font-normal">Address Information</h2>
            </div>
            <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
              <div className="relative col-span-2">
                <Label className="font-normal" htmlFor="residential_address">
                  Residential Address:<span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="residential_address"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="residential_address"
                      className="mt-1"
                      type="text"
                      placeholder="Enter residential address"
                    />
                  )}
                />
                {errors.residential_address && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.residential_address.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label
                  className="font-normal"
                  htmlFor="residential_address_pincode"
                >
                  Pincode:<span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="residential_address_pincode"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="residential_address_pincode"
                      className="mt-1"
                      type="number"
                      placeholder="Enter pincode"
                    />
                  )}
                />
                {errors.residential_address_pincode && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.residential_address_pincode.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
              <div className="relative col-span-2">
                <Label className="font-normal" htmlFor="office_address">
                  Office Address:
                </Label>
                <Controller
                  name="office_address"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="office_address"
                      className="mt-1"
                      type="text"
                      placeholder="Enter office address"
                    />
                  )}
                />
                {errors.office_address && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.office_address.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="office_address_pincode">
                  Pincode:
                </Label>
                <Controller
                  name="office_address_pincode"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="office_address_pincode"
                      className="mt-1"
                      type="number"
                      placeholder="Enter pincode"
                    />
                  )}
                />
                {errors.office_address_pincode && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.office_address_pincode.message}
                  </p>
                )}
              </div>
            </div>

            {/* start */}
            {/* {fields.map((item, index) => (
              <div
                className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4"
                key={item.id}
              >
                <div className="relative">
                  <Label
                    className="font-normal"
                    htmlFor={`family_members[${index}].name`}
                  >
                    Family Member Name:<span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name={`family_members[${index}].name`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id={`family_members[${index}].name`}
                        className="mt-1"
                        placeholder="Enter family member name"
                      />
                    )}
                  />
                  {errors.family_members?.[index]?.name && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.family_members[index].name.message}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <Label
                    className="font-normal"
                    htmlFor={`family_members[${index}].relation`}
                  >
                    Relation:<span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name={`family_members[${index}].relation`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id={`family_members[${index}].relation`}
                        className="mt-1"
                        placeholder="Enter relation"
                      />
                    )}
                  />
                  {errors.family_members?.[index]?.relation && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.family_members[index].relation.message}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <Label
                    className="font-normal"
                    htmlFor={`family_members[${index}].date_of_birth`}
                  >
                    Date of Birth:<span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name={`family_members[${index}].date_of_birth`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id={`family_members[${index}].date_of_birth`}
                        className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                        type="date"
                        placeholder="Enter date of birth"
                      />
                    )}
                  />
                  {errors.family_members?.[index]?.date_of_birth && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.family_members[index].date_of_birth.message}
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  onClick={() => remove(index)} // Remove family member
                  className="mt-5 bg-red-500 hover:bg-red-600 text-white"
                >
                  Remove
                </Button>
              </div>
            ))} */}

            {/* </div> */}
            {/* end */}
            {/* row ends */}
          </div>
          <div className="px-5 mt-2 pb-7 dark:bg-background pt-1 w-full bg-white shadow-lg border  rounded-md">
            <div className="w-full pt-3 flex justify-start items-center">
              <h2 className="text-lg  font-normal">Add Family Members</h2>
            </div>
            <Table className=" mt-3">
              <TableCaption className="mb-2">
                <div className="flex justify-end"></div>
              </TableCaption>
              <TableHeader className="dark:bg-background bg-gray-100  rounded-md">
                <TableRow>
                  <TableHead className="">Name</TableHead>{" "}
                  <TableHead className="">Relation</TableHead>{" "}
                  <TableHead className="">Date of Birth</TableHead>{" "}
                  {/*removed w-[100px] from here */}
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields &&
                  fields.map((item, index) => (
                    <TableRow
                      key={item.id}
                      className=" dark:border-b dark:border-gray-600"
                    >
                      <TableCell className="font-medium p-2">
                        <div className="relative">
                          {/* <Label
                          className="font-normal"
                          htmlFor={`family_members[${index}].name`}
                        >
                          Family Member Name:
                          <span className="text-red-500">*</span>
                        </Label> */}
                          <Controller
                            name={`family_members[${index}].name`}
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id={`family_members[${index}].name`}
                                className="mt-1"
                                placeholder="Enter name"
                              />
                            )}
                          />
                          {errors.family_members?.[index]?.name && (
                            <p className="absolute text-red-500 text-sm mt-1 left-0">
                              {errors.family_members[index].name.message}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium p-2">
                        <div className="relative">
                          {/* <Label
                          className="font-normal"
                          htmlFor={`family_members[${index}].relation`}
                        >
                          Relation:<span className="text-red-500">*</span>
                        </Label> */}
                          <Controller
                            name={`family_members[${index}].relation`}
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id={`family_members[${index}].relation`}
                                className="mt-1"
                                placeholder="Enter relation"
                              />
                            )}
                          />
                          {errors.family_members?.[index]?.relation && (
                            <p className="absolute text-red-500 text-sm mt-1 left-0">
                              {errors.family_members[index].relation.message}
                            </p>
                          )}
                        </div>
                      </TableCell>{" "}
                      <TableCell className="font-medium p-2">
                        <div className="relative">
                          {/* <Label
                          className="font-normal"
                          htmlFor={`family_members[${index}].date_of_birth`}
                        >
                          Date of Birth:<span className="text-red-500">*</span>
                        </Label> */}
                          <Controller
                            name={`family_members[${index}].date_of_birth`}
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                id={`family_members[${index}].date_of_birth`}
                                className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                                type="date"
                                placeholder="Enter date of birth"
                              />
                            )}
                          />
                          {errors.family_members?.[index]?.date_of_birth && (
                            <p className="absolute text-red-500 text-sm mt-1 left-0">
                              {
                                errors.family_members[index].date_of_birth
                                  .message
                              }
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right p-2 pr-5">
                        <Button
                          type="button"
                          onClick={() => remove(index)} // Remove family member
                          className="mt-  bg-red-600 hover:bg-red-700 text-white"
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {/* Add Family Member Button */}
            {/* <div className="flex"> */}
            <div className="flex justify-start">
              <Button
                type="button"
                onClick={() =>
                  append({ name: "", relation: "", date_of_birth: "" })
                } // Add new family member
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                +
              </Button>
            </div>
            <div className="w-full gap-4 mt-4 flex justify-end items-center">
              <Button
                type="button"
                className="dark:text-white shadow-xl bg-red-600 hover:bg-red-700"
                onClick={() => navigate("/clients")}
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
            {/* </div> */}
          </div>
        </form>
      </div>
    </>
  );
};

export default Create;
