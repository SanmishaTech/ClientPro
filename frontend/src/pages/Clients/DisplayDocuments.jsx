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
              <DialogTitle>Upload Documents</DialogTitle>
              <DialogDescription>
                Upload the documents of clients and its family members.
              </DialogDescription>
            </DialogHeader>

            {/* display the names */}
            {/* Display the documents here */}
            {editClient?.Client?.client_documents &&
            editClient?.Client?.client_documents?.length > 0 ? (
              <div className="space-y-4">
                <table className="w-full table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Document Name</th>
                      <th className="px-4 py-2 text-left">Documents</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editClient?.Client?.client_documents?.map((document) => (
                      <tr key={document.id}>
                        <td className="px-4 py-2">{document.document_name}</td>
                        <td className="px-4 py-2">
                          <Button
                            onClick={() =>
                              handleViewDocument(document.document)
                            }
                            type="button"
                            className="bg-blue-500"
                          >
                            view Document
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No documents available for this client.</p>
            )}

            <h1>Member Documents</h1>

            {editClient?.Client?.Family_members?.length > 0 ? (
              editClient?.Client?.Family_members.map((member) => (
                <div key={member.id}>
                  <h1>{member.family_member_name}</h1>
                  {member?.member_documents?.length > 0 ? (
                    member.member_documents.map((document) => (
                      <div key={document.id} className="space-y-4">
                        <table className="w-full table-auto">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-left">
                                Document Name
                              </th>
                              <th className="px-4 py-2 text-left">Documents</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr key={document.id}>
                              <td className="px-4 py-2">
                                {document.document_name}
                              </td>
                              <td className="px-4 py-2">
                                <Button
                                  onClick={() =>
                                    handleViewDocument(document.document)
                                  }
                                  type="button"
                                  className="bg-blue-500"
                                >
                                  View Document
                                </Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ))
                  ) : (
                    <p>No documents available for this family member.</p>
                  )}
                </div>
              ))
            ) : (
              <p>No family members available for this client.</p>
            )}

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
