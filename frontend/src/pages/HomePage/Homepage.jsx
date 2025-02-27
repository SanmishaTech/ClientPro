import React from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { User } from "lucide-react";
import ColorDisplay from "./ColorDisplay";
import {
  IndianRupee,
  AlignStartVertical,
  AlignVerticalDistributeCenter,
  Droplet,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
const Homepage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const navigate = useNavigate();

  const {
    data: DashboardData,
    isLoading: isDashboardDataLoading,
    isError: isDashboardDataError,
  } = useQuery({
    queryKey: ["dashboards"], // This is the query key
    queryFn: async () => {
      try {
        const response = await axios.get("/api/dashboards", {
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

  const { Clients } = DashboardData || {};

  // if (isDashboardDataError) {
  //   return <p>Error</p>;
  // }
  return (
    <>
      <div className="w-full p-5">
        <h1 className="text-2xl">Dashboard</h1>
      </div>
    </>
  );
};

export default Homepage;
