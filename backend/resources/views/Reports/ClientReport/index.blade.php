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
    <table style="width: 100%">
        <thead>
        <tr>
            <th>Created At</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
        </tr>
    </thead>
        <tbody>
            @foreach($clients as $client)
            <!-- Display client details (if their birthday is within the range) -->
            @if ((\Carbon\Carbon::parse($client->created_at)->between($from_date, $to_date))
              && $client->whereHas('mediclaimInsurances') && $client->mediclaimInsurances->contains('familly_member_id',null))
                <tr>
                    <td>{{ \Carbon\Carbon::parse($client->created_at)->format('d/m/Y') }}</td>
                    <td>{{ $client->client_name }}</td>
                    <td>{{ $client->email }}</td>
                    <td>{{ $client->mobile }}</td>
                </tr>
            @endif

            <!-- Display family members details -->
            @foreach($client->familyMembers as $familyMember)
                @if ((\Carbon\Carbon::parse($familyMember->created_at)->between($from_date, $to_date))
                && $familyMember->whereHas('mediclaimInsurances'))
                    <tr>
                        <td>{{ \Carbon\Carbon::parse($familyMember->created_at)->format('d/m/Y') }}</td>
                        <td>{{ $familyMember->family_member_name }}</td> <!-- Assuming 'name' is a field in familyMembers -->
                        <td>{{ $familyMember->member_email }}</td>
                        <td>{{ $familyMember->member_mobile }}</td>
                    </tr>
                @endif
            @endforeach
        @endforeach
        </tbody>
    </table>
    </body>



</html>