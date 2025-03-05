<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
    body {
        font-family: "freeserif";
        margin-bottom: 50px;

    }
    table{
        margin-bottom: 50px;
    }

    table,
    th,
    td {
        border: 1px solid black;
    }
    th,
    td {
        padding: 5px;
        margin: 5px;
    }
    thead {
            display: table-header-group;
        }
   
    </style>
</head>

<body>
  
    @if($mediclaim_insurance)
    <table style="width: 100%">
        <thead>
            <tr>
                <th colspan="6" style="text-align: center; font-size: 16px; font-weight: bold;">Mediclaim Insurance</th>
            </tr>
            <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Broker Name</th>
                <th>End Date</th>
            </tr>
        </thead>
        <tbody>
            @foreach($mediclaimClients as $client)
                @foreach($client->mediclaimInsurances as $mediclaim) <!-- Iterate over each LIC for the client -->
                    @if (\Carbon\Carbon::parse($mediclaim->created_at)->between($from_date, $to_date) && 
                        $mediclaim->family_member_id === null)  <!-- Check if the LIC record is within the date range and family_member_id is null -->
                        <tr>
                            <td>{{ \Carbon\Carbon::parse($mediclaim->created_at)->format('d/m/Y') }}</td>
                            <td>{{ $client->client_name }}</td>
                            <td>{{ $client->email }}</td>
                            <td>{{ $client->mobile }}</td>
                            <td>{{ $mediclaim->broker_name ?? "N/A" }}</td>
                            <td>{{ \Carbon\Carbon::parse($mediclaim->end_date)->format('d/m/Y') ?? "N/A" }}</td>
                        </tr>
                    @endif
                @endforeach
    
                <!-- Display family members details -->
                @foreach($client->familyMembers as $familyMember)
                    @foreach($familyMember->mediclaimInsurances as $mediclaim) <!-- Iterate over each LIC for the family member -->
                        @if (\Carbon\Carbon::parse($mediclaim->created_at)->between($from_date, $to_date))
                            <tr>
                                <td>{{ \Carbon\Carbon::parse($mediclaim->created_at)->format('d/m/Y') }}</td>
                                <td>{{ $familyMember->family_member_name }}</td>
                                <td>{{ $familyMember->member_email }}</td>
                                <td>{{ $familyMember->member_mobile }}</td>
                                <td>{{ $mediclaim->broker_name ?? N/A }}</td>
                                <td>{{ \Carbon\Carbon::parse($mediclaim->end_date)->format('d/m/Y') ?? "N/A" }}</td>
                            </tr>
                        @endif
                    @endforeach
                @endforeach
            @endforeach
        </tbody>
    </table>
    
    @endif

    @if($term_plan)
    <table style="width: 100%">
        <thead>
            <tr>
                <th colspan="4" style="text-align: center; font-size: 16px; font-weight: bold;">Term Plan</th>
            </tr>
            <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
            </tr>
        </thead>
        <tbody>
            @foreach($termPlanClients as $client)
                @foreach($client->termPlans as $term) <!-- Iterate over each LIC for the client -->
                    @if (\Carbon\Carbon::parse($term->created_at)->between($from_date, $to_date) && 
                        $term->family_member_id === null)  <!-- Check if the LIC record is within the date range and family_member_id is null -->
                        <tr>
                            <td>{{ \Carbon\Carbon::parse($term->created_at)->format('d/m/Y') }}</td>
                            <td>{{ $client->client_name }}</td>
                            <td>{{ $client->email }}</td>
                            <td>{{ $client->mobile }}</td>
                        </tr>
                    @endif
                @endforeach
    
                <!-- Display family members details -->
                @foreach($client->familyMembers as $familyMember)
                    @foreach($familyMember->termPlans as $term) <!-- Iterate over each LIC for the family member -->
                        @if (\Carbon\Carbon::parse($term->created_at)->between($from_date, $to_date))
                            <tr>
                                <td>{{ \Carbon\Carbon::parse($term->created_at)->format('d/m/Y') }}</td>
                                <td>{{ $familyMember->family_member_name }}</td>
                                <td>{{ $familyMember->member_email }}</td>
                                <td>{{ $familyMember->member_mobile }}</td>
                            </tr>
                        @endif
                    @endforeach
                @endforeach
            @endforeach
        </tbody>
    </table>
    
    @endif

    @if($lic)
    <table style="width: 100%">
        <thead>
            <tr>
                <th colspan="4" style="text-align: center; font-size: 16px; font-weight: bold;">LIC</th>
            </tr>
            <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
            </tr>
        </thead>
        <tbody>
            @foreach($licClients as $client)
                @foreach($client->lics as $lic) <!-- Iterate over each LIC for the client -->
                    @if (\Carbon\Carbon::parse($lic->created_at)->between($from_date, $to_date) && 
                        $lic->family_member_id === null)  <!-- Check if the LIC record is within the date range and family_member_id is null -->
                        <tr>
                            <td>{{ \Carbon\Carbon::parse($lic->created_at)->format('d/m/Y') }}</td>
                            <td>{{ $client->client_name }}</td>
                            <td>{{ $client->email }}</td>
                            <td>{{ $client->mobile }}</td>
                        </tr>
                    @endif
                @endforeach
    
                <!-- Display family members details -->
                @foreach($client->familyMembers as $familyMember)
                    @foreach($familyMember->lics as $lic) <!-- Iterate over each LIC for the family member -->
                        @if (\Carbon\Carbon::parse($lic->created_at)->between($from_date, $to_date))
                            <tr>
                                <td>{{ \Carbon\Carbon::parse($lic->created_at)->format('d/m/Y') }}</td>
                                <td>{{ $familyMember->family_member_name }}</td>
                                <td>{{ $familyMember->member_email }}</td>
                                <td>{{ $familyMember->member_mobile }}</td>
                            </tr>
                        @endif
                    @endforeach
                @endforeach
            @endforeach
        </tbody>
    </table>
    @endif


    {{-- general insurance start --}}
    @if($general_insurance)
    <table style="width: 100%">
        <thead>
            <tr>
                <th colspan="4" style="text-align: center; font-size: 16px; font-weight: bold;">General Insurance</th>
            </tr>
            <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
            </tr>
        </thead>
        <tbody>
            @foreach($generalInsuranceClients as $client)
                @foreach($client->generalInsurances as $general) <!-- Iterate over each LIC for the client -->
                    @if (\Carbon\Carbon::parse($general->created_at)->between($from_date, $to_date) && 
                        $general->family_member_id === null)  <!-- Check if the LIC record is within the date range and family_member_id is null -->
                        <tr>
                            <td>{{ \Carbon\Carbon::parse($general->created_at)->format('d/m/Y') }}</td>
                            <td>{{ $client->client_name }}</td>
                            <td>{{ $client->email }}</td>
                            <td>{{ $client->mobile }}</td>
                        </tr>
                    @endif
                @endforeach
    
                <!-- Display family members details -->
                @foreach($client->familyMembers as $familyMember)
                    @foreach($familyMember->generalInsurances as $general) <!-- Iterate over each LIC for the family member -->
                        @if (\Carbon\Carbon::parse($general->created_at)->between($from_date, $to_date))
                            <tr>
                                <td>{{ \Carbon\Carbon::parse($general->created_at)->format('d/m/Y') }}</td>
                                <td>{{ $familyMember->family_member_name }}</td>
                                <td>{{ $familyMember->member_email }}</td>
                                <td>{{ $familyMember->member_mobile }}</td>
                            </tr>
                        @endif
                    @endforeach
                @endforeach
            @endforeach
        </tbody>
    </table>
    @endif
    {{-- general insurance end --}}


     {{-- demat Account start --}}
     @if($demat_account)
     <table style="width: 100%">
         <thead>
             <tr>
                 <th colspan="4" style="text-align: center; font-size: 16px; font-weight: bold;">Demat Account</th>
             </tr>
             <tr>
                 <th>Date</th>
                 <th>Name</th>
                 <th>Email</th>
                 <th>Mobile</th>
             </tr>
         </thead>
         <tbody>
             @foreach($dematAccountClients as $client)
                 @foreach($client->dematAccounts as $demat) <!-- Iterate over each LIC for the client -->
                     @if (\Carbon\Carbon::parse($demat->created_at)->between($from_date, $to_date) && 
                         $demat->family_member_id === null)  <!-- Check if the LIC record is within the date range and family_member_id is null -->
                         <tr>
                             <td>{{ \Carbon\Carbon::parse($demat->created_at)->format('d/m/Y') }}</td>
                             <td>{{ $client->client_name }}</td>
                             <td>{{ $client->email }}</td>
                             <td>{{ $client->mobile }}</td>
                         </tr>
                     @endif
                 @endforeach
     
                 <!-- Display family members details -->
                 @foreach($client->familyMembers as $familyMember)
                     @foreach($familyMember->dematAccounts as $demat) <!-- Iterate over each LIC for the family member -->
                         @if (\Carbon\Carbon::parse($demat->created_at)->between($from_date, $to_date))
                             <tr>
                                 <td>{{ \Carbon\Carbon::parse($demat->created_at)->format('d/m/Y') }}</td>
                                 <td>{{ $familyMember->family_member_name }}</td>
                                 <td>{{ $familyMember->member_email }}</td>
                                 <td>{{ $familyMember->member_mobile }}</td>
                             </tr>
                         @endif
                     @endforeach
                 @endforeach
             @endforeach
         </tbody>
     </table>
     @endif
     {{-- demat account end --}}

      {{-- loan start --}}
      @if($loan)
      <table style="width: 100%">
          <thead>
              <tr>
                  <th colspan="5" style="text-align: center; font-size: 16px; font-weight: bold;">Loan</th>
              </tr>
              <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Family Member Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
              </tr>
          </thead>
          <tbody>
              @foreach($loanClients as $client)
                  @foreach($client->loans as $loan) <!-- Iterate over each LIC for the client -->
                      @if (\Carbon\Carbon::parse($loan->created_at)->between($from_date, $to_date))
                          <tr>
                              <td>{{ \Carbon\Carbon::parse($loan->created_at)->format('d/m/Y') }}</td>
                              <td>{{ $client->client_name }}</td>
                              <td>@if($loan->family_member_id){{ $loan->familymember->family_member_name }}@else 
                                N/A
                                @endif</td>
                              <td>{{ $client->email }}</td>
                              <td>{{ $client->mobile }}</td>
                          </tr>
                      @endif
                  @endforeach               
              @endforeach
          </tbody>
      </table>
      @endif
      {{-- loan end --}}

       {{-- mutual fund --}}
      @if($mutual_fund)
      <table style="width: 100%">
          <thead>
              <tr>
                  <th colspan="4" style="text-align: center; font-size: 16px; font-weight: bold;">Mutual Fund</th>
              </tr>
              <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
              </tr>
          </thead>
          <tbody>
              @foreach($mutualFundClients as $client)
                  @foreach($client->mutualFunds as $mutual) <!-- Iterate over each LIC for the client -->
                      @if (\Carbon\Carbon::parse($mutual->created_at)->between($from_date, $to_date) && 
                          $mutual->family_member_id === null)  <!-- Check if the LIC record is within the date range and family_member_id is null -->
                          <tr>
                              <td>{{ \Carbon\Carbon::parse($mutual->created_at)->format('d/m/Y') }}</td>
                              <td>{{ $client->client_name }}</td>
                              <td>{{ $client->email }}</td>
                              <td>{{ $client->mobile }}</td>
                          </tr>
                      @endif
                  @endforeach
      
                  <!-- Display family members details -->
                  @foreach($client->familyMembers as $familyMember)
                      @foreach($familyMember->mutualFunds as $mutual) <!-- Iterate over each LIC for the family member -->
                          @if (\Carbon\Carbon::parse($mutual->created_at)->between($from_date, $to_date))
                              <tr>
                                  <td>{{ \Carbon\Carbon::parse($mutual->created_at)->format('d/m/Y') }}</td>
                                  <td>{{ $familyMember->family_member_name }}</td>
                                  <td>{{ $familyMember->member_email }}</td>
                                  <td>{{ $familyMember->member_mobile }}</td>
                              </tr>
                          @endif
                      @endforeach
                  @endforeach
              @endforeach
          </tbody>
      </table>
      @endif
      {{-- demat account end --}}

    </body>
</html>