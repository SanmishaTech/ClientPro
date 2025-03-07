import React, { useState } from "react";
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
import Pagination from "@/customComponents/Pagination/Pagination";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "lucide-react";
import ColorDisplay from "./ColorDisplay";
import {
  IndianRupee,
  AlignStartVertical,
  AlignVerticalDistributeCenter,
  Droplet,
  AlignHorizontalSpaceAround,
  AlignStartHorizontal,
  Users,
  HandCoins,
} from "lucide-react";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
const Homepage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: DashboardData,
    isLoading: isDashboardDataLoading,
    isError: isDashboardDataError,
    error,
  } = useQuery({
    queryKey: ["dashboards", currentPage], // This is the query key
    queryFn: async () => {
      try {
        const response = await axios.get("/api/dashboards", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: currentPage,
            // search: search,
          },
        });
        return response.data?.data; // Return the fetched data
      } catch (error) {
        // throw new Error(error.message);
        throw error;
      }
    },
    keepPreviousData: true, // Keep previous data until the new data is available
  });

  const {
    Clients,
    totalMediclaimInsurances,
    totalTermPlans,
    totalLic,
    totalLoan,
    totalgeneralInsurance,
    totalDematAccount,
    totalMutualFund,
    totalClients,
    birthdayUsers,
    pagination,
  } = DashboardData || {};

  const { current_page, last_page, total, per_page } = pagination || {};

  if (isDashboardDataError) {
    return (
      <div className="m-5">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Error Loading Data.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div className="w-full p-5">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {isDashboardDataLoading ? (
                <Skeleton className=" h-28 w-auto md:h-28 md:w-[245px]" />
              ) : (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Clients
                    </CardTitle>

                    <Users size={16} color="#716f6f" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalClients}</div>
                    <p className="text-xs text-muted-foreground">
                      {/* +20.1% from last month */}
                    </p>
                  </CardContent>
                </Card>
              )}

              {isDashboardDataLoading ? (
                <Skeleton className="h-28 w-auto md:h-28 md:w-[245px]" />
              ) : (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Mediclaim Insurances
                    </CardTitle>

                    <AlignStartVertical size={16} color="#716f6f" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {totalMediclaimInsurances}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {/* +20.1% from last month */}
                    </p>
                  </CardContent>
                </Card>
              )}
              {isDashboardDataLoading ? (
                <Skeleton className="h-28 w-auto md:h-28 md:w-[245px]" />
              ) : (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Term Plans
                    </CardTitle>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalTermPlans}</div>
                    <p className="text-xs text-muted-foreground">
                      {/* +180.1% from last month */}
                    </p>
                  </CardContent>
                </Card>
              )}
              {isDashboardDataLoading ? (
                <Skeleton className="h-28 w-auto md:h-28 md:w-[245px]" />
              ) : (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">LIC</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalLic}</div>
                    <p className="text-xs text-muted-foreground">
                      {/* +201 since last hour */}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
        <Tabs defaultValue="overview" className="space-y-4 pt-2">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {isDashboardDataLoading ? (
                <Skeleton className="h-28 w-auto md:h-28 md:w-[245px]" />
              ) : (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Loan</CardTitle>
                    <HandCoins size={16} color="#716f6f" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalLoan}</div>
                    <p className="text-xs text-muted-foreground">
                      {/* +201 since last hour */}
                    </p>
                  </CardContent>
                </Card>
              )}
              {isDashboardDataLoading ? (
                <Skeleton className="h-28 w-auto md:h-28 md:w-[245px]" />
              ) : (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      General Insurance
                    </CardTitle>

                    <AlignVerticalDistributeCenter size={16} color="#716f6f" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {totalgeneralInsurance}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {/* +20.1% from last month */}
                    </p>
                  </CardContent>
                </Card>
              )}
              {isDashboardDataLoading ? (
                <Skeleton className="h-28 w-auto md:h-28 md:w-[245px]" />
              ) : (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Demat Accounts
                    </CardTitle>

                    <AlignHorizontalSpaceAround size={16} color="#716f6f" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {totalDematAccount}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {/* +180.1% from last month */}
                    </p>
                  </CardContent>
                </Card>
              )}
              {isDashboardDataLoading ? (
                <Skeleton className="h-28 w-auto md:h-28 md:w-[245px] w-full" />
              ) : (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Mutual Funds
                    </CardTitle>
                    <AlignStartHorizontal size={16} color="#716f6f" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalMutualFund}</div>
                    <p className="text-xs text-muted-foreground">
                      {/* +201 since last hour */}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {isDashboardDataLoading ? (
          <div className="px-5 mt-8 pb-2 dark:bg-background pt-1 w-full bg-gray-50  rounded-md">
            <div className="w-full pt-3 flex justify-start items-center">
              <h2 className="text-xl pt-2 pb-6 font-medium leading-none tracking-tight">
                <Skeleton className="h-6 w-[320px]" />
              </h2>
            </div>
            <Table className="mb-2">
              <TableCaption className="mb-2">
                <div className="flex justify-end"></div>
              </TableCaption>
              <TableHeader className="dark:bg-background bg-gray-50 rounded-md">
                <TableRow>
                  <TableHead className="w-[150px]">
                    <Skeleton className="h-6 w-full" />
                  </TableHead>
                  <TableHead className="w-[150px]">
                    <Skeleton className="h-6 w-full" />
                  </TableHead>
                  <TableHead className="w-[150px]">
                    <Skeleton className="h-6 w-full" />
                  </TableHead>
                  <TableHead className="w-[150px]">
                    <Skeleton className="h-6 w-full" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map(
                  (
                    _,
                    index // Use 5 or however many rows you want
                  ) => (
                    <TableRow
                      key={index}
                      className="dark:border-b dark:border-gray-600"
                    >
                      <TableCell className="font-medium">
                        <Skeleton className="h-6 w-[150px]" />
                      </TableCell>
                      <TableCell className="font-medium">
                        <Skeleton className="h-6 w-[150px]" />
                      </TableCell>
                      <TableCell className="font-medium">
                        <Skeleton className="h-6 w-[150px]" />
                      </TableCell>
                      <TableCell className="font-medium">
                        <Skeleton className="h-6 w-[150px]" />
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="px-5 mt-8 pb-2 dark:bg-background pt-1 w-full bg-white shadow-lg border  rounded-md">
            <div className="w-full pt-3 flex justify-start items-center">
              <h2 className="text-xl pt-2 pb-6 font-medium leading-none tracking-tight">
                Members with Birthdays This Month
              </h2>
            </div>
            <Table className="mb-2">
              <TableCaption className="mb-2">
                <div className="flex justify-end">
                  <Pagination
                    className="pagination-bar"
                    currentPage={current_page}
                    totalCount={total}
                    pageSize={per_page}
                    onPageChange={(page) => setCurrentPage(page)}
                    lastPage={last_page} // Pass the last_page value here
                  />
                </div>
              </TableCaption>
              <TableHeader className="dark:bg-background bg-gray-100  rounded-md">
                <TableRow>
                  <TableHead className="">Name</TableHead>{" "}
                  <TableHead className="">Email</TableHead>{" "}
                  <TableHead className="">Mobile</TableHead>{" "}
                  <TableHead className="">Date of Birth</TableHead>{" "}
                </TableRow>
              </TableHeader>
              <TableBody>
                {birthdayUsers &&
                  birthdayUsers.map((client) => (
                    <TableRow
                      key={client.id}
                      className=" dark:border-b dark:border-gray-600"
                    >
                      <TableCell className="font-medium ">
                        {client?.name}
                      </TableCell>
                      <TableCell className="font-medium ">
                        {client?.email}
                      </TableCell>{" "}
                      <TableCell className="font-medium ">
                        {client?.mobile || "N/A"}
                      </TableCell>
                      <TableCell className="font-medium ">
                        {new Date(client?.date_of_birth).toLocaleDateString(
                          "en-GB"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        )}
        {/* end */}
      </div>
    </>
  );
};

export default Homepage;
