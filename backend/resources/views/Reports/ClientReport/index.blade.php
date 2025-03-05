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
                <th colspan="4" style="text-align: center; font-size: 16px; font-weight: bold;">Mediclaim Insurance</th>
            </tr>
            <tr>
                <th>Created At</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
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
                <th>Created At</th>
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
                <th>Created At</th>
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

    </body>
</html>