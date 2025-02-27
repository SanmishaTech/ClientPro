import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Homepage from "./pages/HomePage/Homepage";
import Projects from "./pages/Projects/Projects";
import Roles from "./pages/Roles/index";
import UpdateRoles from "./pages/Roles/Update";

import Users from "./pages/Users/index";
import CreateUsers from "./pages/Users/Create";
import UpdateUsers from "./pages/Users/Update";

import Clients from "./pages/Clients/index";
import CreateClients from "./pages/Clients/Create";
import UpdateClients from "./pages/Clients/Update";
import MutualFunds from "./pages/MutualFunds/index";
import CreateMutualFunds from "./pages/MutualFunds/Create";
import UpdateMutualFunds from "./pages/MutualFunds/Update";
import DematAccounts from "./pages/DematAccounts/index";
import CreateDematAccounts from "./pages/DematAccounts/Create";
import UpdateDematAccounts from "./pages/DematAccounts/Update";
import GeneralInsurances from "./pages/GeneralInsurances/index";
import CreateGeneralInsurances from "./pages/GeneralInsurances/Create";
import UpdateGeneralInsurances from "./pages/GeneralInsurances/Update";
import LICs from "./pages/LICs/index";
import CreateLICs from "./pages/LICs/Create";
import UpdateLICs from "./pages/LICs/Update";
import Devtas from "./pages/Devtas/index";
import CreateDevtas from "./pages/Devtas/Create";
import UpdateDevtas from "./pages/Devtas/Update";
import MediclaimInsurances from "./pages/MediclaimInsurances/index";
import CreateMediclaimInsurances from "./pages/MediclaimInsurances/Create";
import UpdateMediclaimInsurances from "./pages/MediclaimInsurances/Update";
import TermPlans from "./pages/TermPlans/index";
import CreateTermPlans from "./pages/TermPlans/Create";
import UpdateTermPlans from "./pages/TermPlans/Update";
import Loans from "./pages/Loans/index";
import CreateLoans from "./pages/Loans/Create";
import UpdateLoans from "./pages/Loans/Update";
import AnteshteeAmounts from "./pages/AnteshteeAmounts/index";
import CreateAnteshtee from "./pages/AnteshteeAmounts/Create";
import UpdateAnteshtee from "./pages/AnteshteeAmounts/Update";
import Gurujis from "./pages/Gurujis/index";
import CreateGurujis from "./pages/Gurujis/Create";
import UpdateGurujis from "./pages/Gurujis/Update";
import ReceiptTypes from "./pages/ReceiptTypes/index";
import CreateReceiptTypes from "./pages/ReceiptTypes/Create";
import UpdateReceiptTypes from "./pages/ReceiptTypes/Update";
import PoojaTypes from "./pages/PoojaTypes/index";
import CreatePoojaType from "./pages/PoojaTypes/Create";
import UpdatePoojaType from "./pages/PoojaTypes/Update";
import PoojaDates from "./pages/PoojaDates/index";
import CreatePoojaDate from "./pages/PoojaDates/Create";
import UpdatePoojaDate from "./pages/PoojaDates/Update";
import Denominations from "./pages/Denominations/index";
import CreateDenominations from "./pages/Denominations/Create";
import UpdateDenominations from "./pages/Denominations/Update";
import Receipts from "./pages/Receipts/index";
import CreateReceipts from "./pages/Receipts/Create";
import UpdateReceipts from "./pages/Receipts/Update";
import Permissions from "./pages/Permissions/index";
import AllReceipts from "./pages/Reports/AllReceipts/index";
import ReceiptSummary from "./pages/Reports/ReceiptSummary/index";
import ChequeCollectionReport from "./pages/Reports/ChequeCollectionReport/index";
import UPICollectionReport from "./pages/Reports/UPICollectionReport/index";
import KhatReport from "./pages/Reports/KhatReport/index";
import NaralReport from "./pages/Reports/NaralReport/index";
import CancelledReceiptReport from "./pages/Reports/CancelledReceiptReport/index";
import ReceiptsReport from "./pages/Reports/ReceiptsReport/index";
import GotravaliSummaryReport from "./pages/Reports/GotravaliSummaryReport/index";
import GotravaliReport from "./pages/Reports/GotravaliReport/index";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Error from "./customComponents/Error/Error";
import ProtectedRoute from "./customComponents/ProtectedRoute/ProtectedRoute";
import GuestRoute from "./customComponents/GuestRoute/GuestRoute";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          errorElement={<Error />}
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Homepage />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/roles/:id/edit" element={<UpdateRoles />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/create" element={<CreateUsers />} />
          <Route path="/users/:id/edit" element={<UpdateUsers />} />
          <Route path="/mutual_funds" element={<MutualFunds />} />
          <Route path="/mutual_funds/create" element={<CreateMutualFunds />} />
          <Route
            path="/mutual_funds/:id/edit"
            element={<UpdateMutualFunds />}
          />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/create" element={<CreateClients />} />
          <Route path="/clients/:id/edit" element={<UpdateClients />} />
          <Route path="/lics" element={<LICs />} />
          <Route path="/lics/create" element={<CreateLICs />} />
          <Route path="/lics/:id/edit" element={<UpdateLICs />} />
          <Route path="/devtas" element={<Devtas />} />
          <Route path="/devtas/create" element={<CreateDevtas />} />
          <Route path="/devtas/:id/edit" element={<UpdateDevtas />} />
          <Route
            path="/mediclaim_insurances"
            element={<MediclaimInsurances />}
          />
          <Route
            path="/mediclaim_insurances/create"
            element={<CreateMediclaimInsurances />}
          />
          <Route
            path="/mediclaim_insurances/:id/edit"
            element={<UpdateMediclaimInsurances />}
          />
          <Route path="/term_plans" element={<TermPlans />} />
          <Route path="/term_plans/create" element={<CreateTermPlans />} />
          <Route path="/term_plans/:id/edit" element={<UpdateTermPlans />} />
          <Route path="/demat_accounts" element={<DematAccounts />} />
          <Route
            path="/demat_accounts/create"
            element={<CreateDematAccounts />}
          />
          <Route
            path="/demat_accounts/:id/edit"
            element={<UpdateDematAccounts />}
          />
          <Route path="/general_insurances" element={<GeneralInsurances />} />
          <Route
            path="/general_insurances/create"
            element={<CreateGeneralInsurances />}
          />
          <Route
            path="/general_insurances/:id/edit"
            element={<UpdateGeneralInsurances />}
          />
          <Route path="/loans" element={<Loans />} />
          <Route path="/loans/create" element={<CreateLoans />} />
          <Route path="/loans/:id/edit" element={<UpdateLoans />} />
          <Route path="/anteshtees" element={<AnteshteeAmounts />} />
          <Route path="/anteshtees/create" element={<CreateAnteshtee />} />
          <Route path="/anteshtees/:id/edit" element={<UpdateAnteshtee />} />
          <Route path="/gurujis" element={<Gurujis />} />
          <Route path="/gurujis/create" element={<CreateGurujis />} />
          <Route path="/gurujis/:id/edit" element={<UpdateGurujis />} />
          <Route path="/pooja_types" element={<PoojaTypes />} />
          <Route path="/pooja_types/create" element={<CreatePoojaType />} />
          <Route path="/pooja_types/:id/edit" element={<UpdatePoojaType />} />
          <Route path="/receipt_types" element={<ReceiptTypes />} />
          <Route
            path="/receipt_types/create"
            element={<CreateReceiptTypes />}
          />
          <Route
            path="/receipt_types/:id/edit"
            element={<UpdateReceiptTypes />}
          />
          <Route path="/pooja_dates" element={<PoojaDates />} />
          <Route path="/pooja_dates/create" element={<CreatePoojaDate />} />
          <Route path="/pooja_dates/:id/edit" element={<UpdatePoojaDate />} />
          <Route path="/denominations" element={<Denominations />} />
          <Route
            path="/denominations/create"
            element={<CreateDenominations />}
          />
          <Route
            path="/denominations/:id/edit"
            element={<UpdateDenominations />}
          />
          <Route path="/receipts" element={<Receipts />} />
          <Route path="/receipts/create" element={<CreateReceipts />} />
          <Route path="/receipts/:id/edit" element={<UpdateReceipts />} />
          <Route path="/permissions" element={<Permissions />} />
          <Route path="/all_receipts" element={<AllReceipts />} />
          <Route path="/receipt_summary" element={<ReceiptSummary />} />
          <Route
            path="/cheque_collection_report"
            element={<ChequeCollectionReport />}
          />
          <Route
            path="/upi_collection_report"
            element={<UPICollectionReport />}
          />
          <Route path="/khat_report" element={<KhatReport />} />
          <Route path="/naral_report" element={<NaralReport />} />
          <Route
            path="/cancelled_receipt_report"
            element={<CancelledReceiptReport />}
          />
          <Route path="/receipts_report" element={<ReceiptsReport />} />
          <Route
            path="/gotravali_summary_report"
            element={<GotravaliSummaryReport />}
          />
          <Route path="/gotravali_report" element={<GotravaliReport />} />
        </Route>
        <Route
          errorElement={<Error />}
          path="/login"
          element={
            <GuestRoute>
              {" "}
              <Login />
            </GuestRoute>
          }
        />
        <Route
          errorElement={<Error />}
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
      </>
    )
  );

  return (
    <>
      <Toaster closeButton position="top-right" />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
