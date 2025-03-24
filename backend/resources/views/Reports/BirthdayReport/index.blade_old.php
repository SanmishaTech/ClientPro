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
  
    {{-- <h4 style="margin:0px; padding:0px;">श्री गणेश मंदिर संस्थान - सर्व पावत्या {{ \Carbon\Carbon::parse($from_date)->format('d/m/Y') }} ते {{ \Carbon\Carbon::parse($to_date)->format('d/m/Y') }}</h4>
    <p style="border: 1px solid black; width:100%; margin:0px; padding:0px; margin-bottom:5px;"></p> --}}
    <h2>Clients</h2>

    <table style="width: 100%">
        <thead>
        <tr>
            <th>Date of Birth</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Categories</th>
        </tr>
    </thead>
       
        <tbody>
            @foreach($clients as $client)
                @if (\Carbon\Carbon::parse($client->date_of_birth)->format('m-d') >= $fromMonthDay && \Carbon\Carbon::parse($client->date_of_birth)->format('m-d') <= $toMonthDay)
                    <tr>
                        <td>{{ \Carbon\Carbon::parse($client->date_of_birth)->format('d/m/Y') }}</td>
                        <td>{{ $client->client_name }}</td>
                        <td>{{ $client->email }}</td>
                        <td>{{ $client->mobile }}</td>
                        <td>
                            @php
                            $MediclaimPrinted = false;
                            $TermPrinted = false;
                            $LicPrinted = false;
                            $LoanPrinted = false;
                            $GeneralInsurancePrinted = false;
                            $DematPrinted = false;
                            $MutualPrinted = false;
                            @endphp

                            {{-- mediclaim --}}
                            @if($is_mediclaim_insurance)
                            @if($client->mediclaimInsurances->isNotEmpty())
                              @foreach($client->mediclaimInsurances as $mediclaim)
                               @if($mediclaim->family_member_id == null && $mediclaim->cancelled == 0
                                && !$MediclaimPrinted)
                                 Mediclaim Insurance

                                 @php
                                 $MediclaimPrinted = true;
                             @endphp
                               @endif
                              @endforeach
                            @endif
                            @endif

                            {{-- term plan --}}
                              @if($is_term_plan)
                             @if($client->termPlans->isNotEmpty())
                              @foreach($client->termPlans as $term)
                               @if($term->family_member_id == null && $term->cancelled == 0
                                && !$TermPrinted)
                                 Term Plan
                                 @php
                                 $TermPrinted = true;
                             @endphp
                               @endif
                              @endforeach
                            @endif
                            @endif

                             {{-- lic --}}
                            @if($is_lic)
                             @if($client->lics->isNotEmpty())
                              @foreach($client->lics as $lic)
                               @if($lic->family_member_id == null && $lic->cancelled == 0
                                && !$LicPrinted)
                                 LIC
                                 @php
                                 $LicPrinted = true;
                             @endphp
                               @endif
                              @endforeach
                            @endif
                            @endif


                             {{-- loan --}}
                             @if($is_loan)
                             @if($client->loans->isNotEmpty())
                              @foreach($client->loans as $loan)
                               @if($loan->cancelled == 0
                                && !$LoanPrinted)
                                 Loan
                                 @php
                                 $LoanPrinted = true;
                             @endphp
                               @endif
                              @endforeach
                            @endif
                            @endif


                             {{-- General Insurance --}}
                             @if($is_general_insurance)
                             @if($client->generalInsurances->isNotEmpty())
                              @foreach($client->generalInsurances as $insurance)
                               @if($insurance->family_member_id == null && $insurance->cancelled == 0
                                && !$GeneralInsurancePrinted)
                                 General Insurance
                                 @php
                                 $GeneralInsurancePrinted = true;
                             @endphp
                               @endif
                              @endforeach
                            @endif
                            @endif


                            {{-- Demat account --}}
                            @if($is_demat_account)
                             @if($client->dematAccounts->isNotEmpty())
                              @foreach($client->dematAccounts as $demat)
                               @if($demat->family_member_id == null && $demat->cancelled == 0
                                && !$DematPrinted)
                                  Demat Account
                                 @php
                                 $DematPrinted = true;
                             @endphp
                               @endif
                              @endforeach
                            @endif
                            @endif


                             {{-- Mutual Fund --}}
                             @if($is_mutual_fund)
                             @if($client->mutualFunds->isNotEmpty())
                              @foreach($client->mutualFunds as $mutual)
                               @if($mutual->family_member_id == null && $mutual->cancelled == 0
                                && !$MutualPrinted)
                                  Mutual Fund
                                 @php
                                 $MutualPrinted = true;
                             @endphp
                               @endif
                              @endforeach
                            @endif
                            @endif

                        </td>
                    </tr>
                @endif
            @endforeach
        </tbody>
        
    </table>

   <h2>Family members</h2>

    <table style="width: 100%">
        <thead>
        <tr>
            <th>Date of Birth</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Categories</th>
        </tr>
    </thead>
       
        <tbody>
            @foreach($familyMembers as $member)
                @if (\Carbon\Carbon::parse($member->family_member_dob)->format('m-d') >= $fromMonthDay && \Carbon\Carbon::parse($member->family_member_dob)->format('m-d') <= $toMonthDay)
                    <tr>
                        <td>{{ \Carbon\Carbon::parse($member->family_member_dob)->format('d/m/Y') }}</td>
                        <td>{{ $member->family_member_name }}</td>
                        <td>{{ $member->member_email }}</td>
                        <td>{{ $member->member_mobile }}</td>
                        <td>
                            @php
                            $familyMediclaimPrinted = false;
                            $familyTermPrinted = false;
                            $familyLicPrinted = false;
                            $familyLoanPrinted = false;
                            $familyGeneralInsurancePrinted = false;
                            $familyDematPrinted = false;
                            $familyMutualPrinted = false;
                         @endphp
                         {{-- family mediclaim insurance --}}
                            @if($is_mediclaim_insurance)
                            @if($member->mediclaimInsurances->isNotEmpty())
                              @foreach($member->mediclaimInsurances as $mediclaim)
                               @if($mediclaim->cancelled == 0 && !$familyMediclaimPrinted)
                                 Mediclaim Insurance
                                 @php
                                    $familyMediclaimPrinted = true;
                                @endphp
                               @endif
                              @endforeach
                            @endif
                             @endif


                             {{-- family term plan --}}
                             @if($is_term_plan)
                             @if($member->termPlans->isNotEmpty())
                              @foreach($member->termPlans as $term)
                               @if($term->cancelled == 0 && !$familyTermPrinted)
                                 Term Plan
                                 @php
                                    $familyTermPrinted = true;
                                @endphp
                               @endif
                              @endforeach
                            @endif
                            @endif


                              {{-- family lic --}}
                              @if($is_lic)
                             @if($member->lics->isNotEmpty())
                              @foreach($member->lics as $lic)
                               @if($lic->cancelled == 0 && !$familyLicPrinted)
                                 LIC
                                 @php
                                    $familyLicPrinted = true;
                                @endphp
                               @endif
                              @endforeach
                            @endif
                            @endif

                             {{-- family loan --}}
                             @if($is_loan)
                             @if($member->loans->isNotEmpty())
                              @foreach($member->loans as $loan)
                               @if($loan->cancelled == 0 && !$familyLoanPrinted)
                                 Loan
                                 @php
                                    $familyLoanPrinted = true;
                                @endphp
                               @endif
                              @endforeach
                            @endif
                            @endif


                             {{-- family general insurance --}}
                             @if($is_general_insurance)
                             @if($member->generalInsurances->isNotEmpty())
                              @foreach($member->generalInsurances as $insurance)
                               @if($insurance->cancelled == 0 && !$familyGeneralInsurancePrinted)
                                 General Insurance
                                 @php
                                    $familyGeneralInsurancePrinted = true;
                                @endphp
                               @endif
                              @endforeach
                            @endif
                            @endif


                             {{-- family demat account --}}
                             @if($is_demat_account)
                             @if($member->dematAccounts->isNotEmpty())
                              @foreach($member->dematAccounts as $demat)
                               @if($demat->cancelled == 0 && !$familyDematPrinted)
                                 Demat Account
                                 @php
                                    $familyDematPrinted = true;
                                @endphp
                               @endif
                              @endforeach
                            @endif
                            @endif


                              {{-- family mutual fund --}}
                              @if($is_mutual_fund)
                             @if($member->mutualFunds->isNotEmpty())
                              @foreach($member->mutualFunds as $mutual)
                               @if($mutual->cancelled == 0 && !$familyMutualPrinted)
                                 Mutual Fund
                                 @php
                                    $familyMutualPrinted = true;
                                @endphp
                               @endif
                              @endforeach
                            @endif
                            @endif


                        </td>
                    </tr>
                @endif
            @endforeach
        </tbody>
    </table>
    </body>



</html>