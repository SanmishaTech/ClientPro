import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

const Update = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]); // Local state for permissions
  const queryClient = useQueryClient();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: zodResolver(formSchema), defaultValues: { name: "" } });

  const {
    data: editRole,
    isLoading: isEditRoleDataLoading,
    isError: isEditRoleDataError,
  } = useQuery({
    queryKey: ["editRole", id],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/roles/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data?.data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    keepPreviousData: true,
  });

  useEffect(() => {
    if (editRole) {
      setValue("name", editRole.Role?.name);

      // Set the permissions based on the RolePermissions
      const selectedPermissions = editRole.Permissions?.filter((permission) =>
        editRole.RolePermissions?.includes(permission.name)
      ).map((permission) => permission.id);

      setSelectedPermissions(selectedPermissions || []); // Initialize selectedPermissions state
    }
  }, [editRole, setValue]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(`/api/roles/${id}`, {
        ...data,
        permissions: selectedPermissions, // Use the selected permissions from local state
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("roles");
      toast.success("Role Updated Successfully");
      setIsLoading(false);
      navigate("/roles");
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error("Failed to update Role details.");
    },
  });

  const onSubmit = (data) => {
    if (selectedPermissions.length === 0) {
      toast.error("Please select at least one permission.");
      return;
    }
    setIsLoading(true);
    updateMutation.mutate({
      name: data.name,
    });
  };

  return (
    <div className="p-5">
      <div className="mb-7 text-sm">
        <div className="flex items-center space-x-2 text-gray-700">
          <span>
            <Button
              onClick={() => navigate("/roles")}
              className="p-0 text-blue-700 text-sm font-light"
              variant="link"
            >
              Roles
            </Button>
          </span>
          <span className="text-gray-400">/</span>
          <span className="dark:text-gray-500">Edit</span>
        </div>
      </div>

      <div className="px-5 pb-7 pt-1 w-full dark:bg-background bg-white shadow-lg border rounded-md">
        <div className="w-full py-3 flex justify-start items-center">
          <h2 className="text-lg font-normal">Update Role</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full mb-8 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
            <div className="relative">
              <Label className="font-normal" htmlFor="name">
                Name: <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="name"
                    className="mt-1"
                    type="text"
                    placeholder="Enter name"
                  />
                )}
              />
              {errors.name && (
                <p className="absolute text-red-500 text-sm mt-1 left-0">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          <div className="w-full mb-8 grid grid-cols-1 md:grid-cols-4 items-center gap-7 md:gap-4">
            {editRole?.Permissions?.map((permission) => (
              <div key={permission.id} className="relative flex gap-2 md:pt-10 md:pl-2">
                <input
                  type="checkbox"
                  id={permission.name}
                  checked={selectedPermissions.includes(permission.id)}
                  onChange={(e) => {
                    const updatedPermissions = [...selectedPermissions];
                    if (e.target.checked) {
                      updatedPermissions.push(permission.id);
                    } else {
                      const index = updatedPermissions.indexOf(permission.id);
                      if (index > -1) {
                        updatedPermissions.splice(index, 1);
                      }
                    }
                    setSelectedPermissions(updatedPermissions);
                  }}
                  className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Label className="font-normal" htmlFor={permission.name}>
                  {permission.name}
                </Label>
              </div>
            ))}
          </div>

          <div className="w-full gap-4 mt-4 flex justify-end items-center">
            <Button
              type="button"
              className=" shadow-xl dark:text-white bg-red-600 hover:bg-red-700"
              onClick={() => navigate("/roles")}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="shadow-xl dark:text-white bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" /> Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Update;
