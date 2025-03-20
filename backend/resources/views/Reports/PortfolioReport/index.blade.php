<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            margin: 0;
            padding: 0;
        }
        .header, .footer {
            text-align: center;
        }
        .section-title {
            font-weight: bold;
            margin-top: 20px;
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .details-table th, .details-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .details-table th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>

    <div class="header">
        <h2>Portfolio Report</h2>
    </div>

    <div class="content">

        <!-- Client Personal Details -->
        <div class="section-title">Personal Details</div>
        <table class="details-table">
            <tr>
                <th>Name</th>
                <td>{{ $client->client_name }}</td>
            </tr>
            <tr>
                <th>Email</th>
                <td>{{ $client->email }}</td>
            </tr>
            <tr>
                <th>Phone</th>
                <td>{{ $client->mobile }}</td>
            </tr>
            <tr>
                <th>Phone 2</th>
                <td>{{ $client->mobile_2 }}</td>
            </tr>
            <tr>
                <th>Date of Birth</th>
                <td>{{ \Carbon\Carbon::parse($client->date_of_birth)->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <th>Height (cm)</th>
                <td>{{ $client->height }}</td>
            </tr>
            <tr>
                <th>Weight (kg)</th>
                <td>{{ $client->weight }}</td>
            </tr>
            <tr>
                <th>PED (Pre-existing Disease)</th>
                <td>{{ $client->existing_ped }}</td>
            </tr>
            <tr>
                <th>Residential Address</th>
                <td>{{ $client->residential_address }}, {{$client->residential_address_pincode}}</td>
            </tr>
            <tr>
                <th>Office Address</th>
                <td>{{ $client->office_address }}</td>
            </tr>
            <!-- Add more personal details as needed -->
        </table>

        <!-- Mediclaim Insurances -->
        @if($client->mediclaimInsurances->where('family_member_id', null)->count() > 0)

            <div class="section-title">Mediclaim Insurances</div>
            <table class="details-table">
                <thead>
                    <tr>
                        <th>Company Name</th>
                        <th>Broker Name</th>
                        <th>Policy Number</th>
                        <th>Plan Name</th>
                        <th>Premium</th>
                        <th>Proposal Date</th>
                        <th>End Date</th>
                        <th>Premium Payment Mode</th>
                        <th>Sum Insured</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($client->mediclaimInsurances->where('family_member_id', null) as $insurance)
                        <tr>
                            <td>{{ $insurance->company_name }}</td>
                            <td>{{ $insurance->broker_name }}</td>
                            <td>{{ $insurance->policy_number }}</td>
                            <td>{{ $insurance->plan_name }}</td>
                            <td>{{ $insurance->premium }}</td>
                            <td>{{ \Carbon\Carbon::parse($insurance->proposal_date)->format('d/m/Y') }}</td>
                            <td>{{ \Carbon\Carbon::parse($insurance->end_date)->format('d/m/Y') }}</td>
                            <td>{{ $insurance->premium_payment_mode }}</td>
                            <td>{{ $insurance->sum_insured }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif

         <!-- term Plans -->
         @if($client->termPlans->where('family_member_id', null)->count() > 0)

         <div class="section-title">Term Plan</div>
         <table class="details-table">
             <thead>
                 <tr>
                     <th>Company Name</th>
                     <th>Broker Name</th>
                     <th>Policy Number</th>
                     <th>Plan Name</th>
                     <th>Premium (without gst)</th>
                     <th>Proposal Date</th>
                     <th>End Date</th>
                     <th>Premium Payment Mode</th>
                     <th>Sum Insured</th>
                 </tr>
             </thead>
             <tbody>
                 @foreach($client->termPlans->where('family_member_id', null) as $term)
                     <tr>
                         <td>{{ $term->term_company_name }}</td>
                         <td>{{ $term->broker_name }}</td>
                         <td>{{ $term->policy_number }}</td>
                         <td>{{ $term->plan_name }}</td>
                         <td>{{ $term->premium_without_gst }}</td>
                         <td>{{ \Carbon\Carbon::parse($term->proposal_date)->format('d/m/Y') }}</td>
                         <td>{{ \Carbon\Carbon::parse($term->end_date)->format('d/m/Y') }}</td>
                         <td>{{ $term->premium_payment_mode }}</td>
                         <td>{{ $term->sum_insured }}</td>
                     </tr>
                 @endforeach
             </tbody>
         </table>
     @endif

      <!-- LIC -->
      @if($client->lics->where('family_member_id', null)->count() > 0)

      <div class="section-title">LIC</div>
      <table class="details-table">
          <thead>
              <tr>
                  <th>Company Name</th>
                  <th>Broker Name</th>
                  <th>Policy Number</th>
                  <th>Plan Name</th>
                  <th>Premium (without gst)</th>
                  <th>Commencement Date</th>
                  <th>Term</th>
                  <th>ppt</th>
                  <th>Proposal Date</th>
                  <th>End Date</th>
                  <th>Premium Payment Mode</th>
                  <th>Sum Insured</th>
              </tr>
          </thead>
          <tbody>
              @foreach($client->lics->where('family_member_id', null) as $lic)
                  <tr>
                      <td>{{ $lic->company_name }}</td>
                      <td>{{ $lic->broker_name }}</td>
                      <td>{{ $lic->policy_number }}</td>
                      <td>{{ $lic->plan_name }}</td>
                      <td>{{ $lic->premium_without_gst }}</td>
                      <td>{{ \Carbon\Carbon::parse($lic->commencement_date)->format('d/m/Y') }}</td>
                      <td>{{ $lic->term }}</td>
                      <td>{{ $lic->ppt }}</td>
                      <td>{{ \Carbon\Carbon::parse($lic->proposal_date)->format('d/m/Y') }}</td>
                      <td>{{ \Carbon\Carbon::parse($lic->end_date)->format('d/m/Y') }}</td>
                      <td>{{ $lic->premium_payment_mode }}</td>
                      <td>{{ $lic->sum_insured }}</td>
                  </tr>
              @endforeach
          </tbody>
      </table>
  @endif

        <!-- Loans -->
        @if($client->loans->where("family_member_id", null)->count() > 0)
            <div class="section-title">Loans</div>
            <table class="details-table">
                <thead>
                    <tr>
                        <th>bank Name</th>
                        <th>Loan Type</th>
                        <th>Loan Amount</th>
                        <th>Term</th>
                        <th>EMI</th>
                        <th>ROI</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($client->loans->where('family_member_id', null) as $loan)
                        <tr>
                            <td>{{ $loan->bank_name }}</td>
                            <td>{{ $loan->loan_type }}</td>
                            <td>{{ $loan->loan_amount }}</td>
                            <td>{{ $loan->term }}</td>
                            <td>{{ $loan->emi }}</td>
                            <td>{{ $loan->roi }}</td>
                            <td>{{ \Carbon\Carbon::parse($loan->start_date)->format('d/m/Y') }}</td>
                            <td>{{ \Carbon\Carbon::parse($loan->end_date)->format('d/m/Y') }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif

        <!-- General Insurance -->
      @if($client->generalInsurances->where('family_member_id', null)->count() > 0)

      <div class="section-title">General Insurance</div>
      <table class="details-table">
          <thead>
              <tr>
                  <th>Insurance Type</th>
                  <th>Company Name</th>
                  <th>Premium</th>
                  <th>Start Date</th>
                  <th>End Date</th>
              </tr>
          </thead>
          <tbody>
              @foreach($client->generalInsurances->where('family_member_id', null) as $insurance)
                  <tr>
                      <td>{{ $insurance->insurance_type }}</td>
                      <td>{{ $insurance->company_name }}</td>
                      <td>{{ $insurance->premium }}</td>
                      <td>{{ \Carbon\Carbon::parse($insurance->start_date)->format('d/m/Y') }}</td>
                      <td>{{ \Carbon\Carbon::parse($insurance->end_date)->format('d/m/Y') }}</td>
                  </tr>
              @endforeach
          </tbody>
      </table>
  @endif


   <!-- demat Account -->
   @if($client->dematAccounts->where('family_member_id', null)->count() > 0)

   <div class="section-title">General Insurance</div>
   <table class="details-table">
       <thead>
           <tr>
               <th>Company Name</th>
               <th>Account Number</th>
               <th>Service Provider</th>
               <th>Plan Name</th>
               <th>Start Date</th>
           </tr>
       </thead>
       <tbody>
           @foreach($client->dematAccounts->where('family_member_id', null) as $demat)
               <tr>
                   <td>{{ $demat->company_name }}</td>
                   <td>{{ $demat->account_number }}</td>
                   <td>{{ $demat->service_provider }}</td>
                   <td>{{ $demat->plan_name }}</td>
                   <td>{{ \Carbon\Carbon::parse($demat->start_date)->format('d/m/Y') }}</td>
               </tr>
           @endforeach
       </tbody>
   </table>
@endif


        <!-- Mutual Fund -->
        @if($client->mutualFunds->where('family_member_id', null)->count() > 0)

        <div class="section-title">Mutual Fund</div>
        <table class="details-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Account Number</th>
                    <th>Service Provider</th>
                    <th>Reference Name</th>
                    <th>Start Date</th>
                </tr>
            </thead>
            <tbody>
                @foreach($client->mutualFunds->where('family_member_id', null) as $mutual)
                    <tr>
                        <td>{{ $mutual->mutual_fund_name }}</td>
                        <td>{{ $mutual->account_number }}</td>
                        <td>{{ $mutual->service_provider }}</td>
                        <td>{{ $mutual->reference_name }}</td>
                        <td>{{ \Carbon\Carbon::parse($mutual->start_date)->format('d/m/Y') }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        @endif

        <!-- Family Members and Their Details -->
        @if($client->familyMembers->count() > 0)
            <div class="section-title">Family Members</div>
            @foreach($client->familyMembers as $familyMember)
                <div class="section-title">Family Member: {{ $familyMember->name }}</div>
                <table class="details-table">
                    <tr>
                        <th>Relationship</th>
                        <td>{{ $familyMember->relationship }}</td>
                    </tr>
                    <tr>
                        <th>Age</th>
                        <td>{{ $familyMember->age }}</td>
                    </tr>
                    <tr>
                        <th>Phone</th>
                        <td>{{ $familyMember->phone }}</td>
                    </tr>
                    <!-- Add other family member details as needed -->
                </table>

                <!-- Family Member's Mediclaim Insurances -->
                @if($familyMember->mediclaimInsurances->count() > 0)
                    <div class="section-title">Mediclaim Insurances</div>
                    <table class="details-table">
                        <thead>
                            <tr>
                                <th>Policy Number</th>
                                <th>Policy Name</th>
                                <th>Coverage Amount</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($familyMember->mediclaimInsurances as $insurance)
                                <tr>
                                    <td>{{ $insurance->policy_number }}</td>
                                    <td>{{ $insurance->policy_name }}</td>
                                    <td>{{ $insurance->coverage_amount }}</td>
                                    <td>{{ \Carbon\Carbon::parse($insurance->start_date)->format('d/m/Y') }}</td>
                                    <td>{{ \Carbon\Carbon::parse($insurance->end_date)->format('d/m/Y') }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                @endif

                <!-- Family Member's Loans -->
                @if($familyMember->loans->count() > 0)
                    <div class="section-title">Loans</div>
                    <table class="details-table">
                        <thead>
                            <tr>
                                <th>Loan Type</th>
                                <th>Amount</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($familyMember->loans as $loan)
                                <tr>
                                    <td>{{ $loan->loan_type }}</td>
                                    <td>{{ $loan->amount }}</td>
                                    <td>{{ \Carbon\Carbon::parse($loan->start_date)->format('d/m/Y') }}</td>
                                    <td>{{ \Carbon\Carbon::parse($loan->end_date)->format('d/m/Y') }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                @endif
            @endforeach
        @endif

        <!-- Add more sections as needed -->

    </div>

    <div class="footer">
        <p>Printed on {{ \Carbon\Carbon::now()->format('d/m/Y h:i A') }}</p>
        <p>Page {PAGENO} of {nb}</p>
    </div>

</body>
</html>
