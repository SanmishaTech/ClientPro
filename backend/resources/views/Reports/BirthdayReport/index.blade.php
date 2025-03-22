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
                            @endphp
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
                         @endphp
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
                        </td>
                    </tr>
                @endif
            @endforeach
        </tbody>
    </table>
    </body>



</html>