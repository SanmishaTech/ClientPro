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
import { useQuery } from "@tanstack/react-query";

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
import { ScrollArea } from "@/components/ui/scroll-area";

const DisplayDocuments = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const navigate = useNavigate();

  const {
    data: editClient,
    isLoading: isEditClientDataLoading,
    isError: isEditClientDataError,
  } = useQuery({
    queryKey: ["editClient", id], // This is the query key
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/clients/${id}`, {
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

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const handleCancel = () => {
    closeDialog(); // Close the dialog when cancel is clicked
  };

  const handleViewDocument = (documentName) => {
    // URL to your Laravel endpoint to get the document
    const url = `/api/file/${documentName}`;

    // Trigger the API call to fetch the document and open it in a new tab
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
        responseType: "blob", // Set the response type as blob to handle binary data
      })
      .then((response) => {
        // Create a link element to open the document in a new tab
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const link = document.createElement("a");
        const objectURL = URL.createObjectURL(blob);

        // Set up the link to download the file or view it in the browser
        link.href = objectURL;
        link.target = "_blank"; // Open the file in a new tab
        link.click();
      })
      .catch((error) => {
        console.error("Error fetching the document:", error);
      });
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          {/* <Button variant="outline">Edit Profile</Button> */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-sm justify-start"
          >
            <File /> Show Documents
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full h-[90%] max-w-[800px]">
          <ScrollArea className="w-full p-2  max-w-[800px] rounded-md ">
            <DialogHeader>
              <DialogTitle>Documents</DialogTitle>
              <DialogDescription>
                View All Documents of Clients and its Family Members.
              </DialogDescription>
            </DialogHeader>

            {/* display the names */}
            {/* Display the documents here */}

            {/* start */}

            <h1 className="text-lg font-medium mt-2">
              {" "}
              Client: {editClient?.Client?.client_name}
            </h1>
            {editClient?.Client?.client_documents.length > 0 ? (
              <Table className="mb-2">
                <TableCaption className="mb-2">
                  <div className="flex justify-end"></div>
                </TableCaption>
                <TableHeader className="dark:bg-background bg-gray-100  rounded-md">
                  <TableRow>
                    <TableHead className="p-2">Document Name</TableHead>
                    <TableHead className="text-right">Documents</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editClient?.Client?.client_documents &&
                    editClient?.Client?.client_documents.map((document) => (
                      <TableRow
                        key={document.id}
                        className=" dark:border-b dark:border-gray-600"
                      >
                        <TableCell className="font-medium p-2">
                          {document.document_name}
                          {/* {new Date(denomination.deposit_date).toLocaleDateString("en-GB")} */}
                        </TableCell>
                        <TableCell className="font-medium p-2 text-right">
                          <Button
                            onClick={() =>
                              handleViewDocument(document.document)
                            }
                            type="button"
                            className=" dark:text-white  shadow-xl bg-blue-600 hover:bg-blue-700"
                          >
                            view Document
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            ) : (
              <p>No documents available for this Client.</p>
            )}
            {/* end */}

            {/* member start */}
            {editClient?.Client?.Family_members?.length > 0 ? (
              editClient?.Client?.Family_members.map((member) => (
                <div key={member.id}>
                  {/* <h1>{member.family_member_name}</h1> */}
                  <h1 className="text-lg font-medium mt-2">
                    {" "}
                    Family Member: {member.family_member_name}
                  </h1>
                  {member?.member_documents?.length > 0 ? (
                    <>
                      {/* Render the table headers once per family member */}
                      <Table className="mb-2">
                        <TableCaption className="mb-2">
                          <div className="flex justify-end"></div>
                        </TableCaption>
                        <TableHeader className="dark:bg-background bg-gray-100 rounded-md">
                          <TableRow>
                            <TableHead className="p-2">Document Name</TableHead>
                            <TableHead className="text-right">
                              Documents
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {member.member_documents.map((document) => (
                            <TableRow
                              key={document.id}
                              className="dark:border-b dark:border-gray-600"
                            >
                              <TableCell className="font-medium p-2">
                                {document.document_name}
                              </TableCell>
                              <TableCell className="font-medium p-2 text-right">
                                <Button
                                  onClick={() =>
                                    handleViewDocument(document.document)
                                  }
                                  type="button"
                                  className=" dark:text-white  shadow-xl bg-blue-600 hover:bg-blue-700"
                                >
                                  View Document
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </>
                  ) : (
                    <p>No documents available for this family member.</p>
                  )}
                </div>
              ))
            ) : (
              <p>No family members available for this client.</p>
            )}

            {/* member end */}

            <DialogFooter>
              <Button type="button" onClick={handleCancel} className="">
                Close
              </Button>
            </DialogFooter>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DisplayDocuments;
