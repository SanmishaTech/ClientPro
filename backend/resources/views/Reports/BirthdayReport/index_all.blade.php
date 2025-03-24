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
                              // Initialize an empty array to store the categories
                              $categories = [];
                      
                              // Mediclaim Insurance
                              if ($client->mediclaimInsurances->isNotEmpty()) {
                                  foreach ($client->mediclaimInsurances as $mediclaim) {
                                      if ($mediclaim->family_member_id == null && $mediclaim->cancelled == 0 && !in_array('Mediclaim Insurance', $categories)) {
                                          $categories[] = 'Mediclaim Insurance'; // Add category to array
                                      }
                                  }
                              }
                      
                              // Term Plan
                              if ($client->termPlans->isNotEmpty()) {
                                  foreach ($client->termPlans as $term) {
                                      if ($term->family_member_id == null && $term->cancelled == 0 && !in_array('Term Plan', $categories)) {
                                          $categories[] = 'Term Plan'; // Add category to array
                                      }
                                  }
                              }
                      
                              // LIC
                              if ($client->lics->isNotEmpty()) {
                                  foreach ($client->lics as $lic) {
                                      if ($lic->family_member_id == null && $lic->cancelled == 0 && !in_array('LIC', $categories)) {
                                          $categories[] = 'LIC'; // Add category to array
                                      }
                                  }
                              }
                      
                              // Loan
                              if ($client->loans->isNotEmpty()) {
                                  foreach ($client->loans as $loan) {
                                      if ($loan->cancelled == 0 && !in_array('Loan', $categories)) {
                                          $categories[] = 'Loan'; // Add category to array
                                      }
                                  }
                              }
                      
                              // General Insurance
                              if ($client->generalInsurances->isNotEmpty()) {
                                  foreach ($client->generalInsurances as $insurance) {
                                      if ($insurance->family_member_id == null && $insurance->cancelled == 0 && !in_array('General Insurance', $categories)) {
                                          $categories[] = 'General Insurance'; // Add category to array
                                      }
                                  }
                              }
                      
                              // Demat Account
                              if ($client->dematAccounts->isNotEmpty()) {
                                  foreach ($client->dematAccounts as $demat) {
                                      if ($demat->family_member_id == null && $demat->cancelled == 0 && !in_array('Demat Account', $categories)) {
                                          $categories[] = 'Demat Account'; // Add category to array
                                      }
                                  }
                              }
                      
                              // Mutual Fund
                              if ($client->mutualFunds->isNotEmpty()) {
                                  foreach ($client->mutualFunds as $mutual) {
                                      if ($mutual->family_member_id == null && $mutual->cancelled == 0 && !in_array('Mutual Fund', $categories)) {
                                          $categories[] = 'Mutual Fund'; // Add category to array
                                      }
                                  }
                              }
                      
                              // Join categories with commas
                              $categoryString = implode(', ', $categories);
                          @endphp
                          {{ $categoryString }}
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
                              // Initialize an empty array to store the categories
                              $categories = [];
                      
                              // Family Mediclaim Insurance
                              if ($member->mediclaimInsurances->isNotEmpty()) {
                                  foreach ($member->mediclaimInsurances as $mediclaim) {
                                      if ($mediclaim->cancelled == 0 && !in_array('Mediclaim Insurance', $categories)) {
                                          $categories[] = 'Mediclaim Insurance'; // Add category to array
                                      }
                                  }
                              }
                      
                              // Family Term Plan
                              if ($member->termPlans->isNotEmpty()) {
                                  foreach ($member->termPlans as $term) {
                                      if ($term->cancelled == 0 && !in_array('Term Plan', $categories)) {
                                          $categories[] = 'Term Plan'; // Add category to array
                                      }
                                  }
                              }
                      
                              // Family LIC
                              if ($member->lics->isNotEmpty()) {
                                  foreach ($member->lics as $lic) {
                                      if ($lic->cancelled == 0 && !in_array('LIC', $categories)) {
                                          $categories[] = 'LIC'; // Add category to array
                                      }
                                  }
                              }
                      
                              // Family Loan
                              if ($member->loans->isNotEmpty()) {
                                  foreach ($member->loans as $loan) {
                                      if ($loan->cancelled == 0 && !in_array('Loan', $categories)) {
                                          $categories[] = 'Loan'; // Add category to array
                                      }
                                  }
                              }
                      
                              // Family General Insurance
                              if ($member->generalInsurances->isNotEmpty()) {
                                  foreach ($member->generalInsurances as $insurance) {
                                      if ($insurance->cancelled == 0 && !in_array('General Insurance', $categories)) {
                                          $categories[] = 'General Insurance'; // Add category to array
                                      }
                                  }
                              }
                      
                              // Family Demat Account
                              if ($member->dematAccounts->isNotEmpty()) {
                                  foreach ($member->dematAccounts as $demat) {
                                      if ($demat->cancelled == 0 && !in_array('Demat Account', $categories)) {
                                          $categories[] = 'Demat Account'; // Add category to array
                                      }
                                  }
                              }
                      
                              // Family Mutual Fund
                              if ($member->mutualFunds->isNotEmpty()) {
                                  foreach ($member->mutualFunds as $mutual) {
                                      if ($mutual->cancelled == 0 && !in_array('Mutual Fund', $categories)) {
                                          $categories[] = 'Mutual Fund'; // Add category to array
                                      }
                                  }
                              }
                      
                              // Join categories with commas
                              $categoryString = implode(', ', $categories);
                          @endphp
                      
                          <!-- Output the category string -->
                          {{ $categoryString }}
                      </td>
                      
                    </tr>
                @endif
            @endforeach
        </tbody>
    </table>
    </body>



</html>