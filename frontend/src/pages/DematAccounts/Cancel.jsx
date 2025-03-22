import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  File,
  PlusCircle,
  Search,
  Pencil,
  Trash,
  MoreHorizontal,
  ListFilter,
} from "lucide-react";
import { Loader2 } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const Delete = ({ id }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const cancelMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.get(`/api/cancel_demat_account/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the Bearer token
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("demat_accounts");
      queryClient.invalidateQueries("dashboards");
      toast.success("Demat Account Cancelled Successfully");
      setIsLoading(false);
    },
    onError: (error) => {
      setIsLoading(false);
    },
  });
  const onCancel = () => {
    setIsLoading(true);
    cancelMutation.mutate();
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-sm justify-start"
          >
            <Trash size={16} /> Cancel
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              By proceeding, you will Cancel "Demat Account Details".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onCancel()}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" /> {/* Spinner */}
                  loading...
                </>
              ) : (
                "Continue"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Delete;
