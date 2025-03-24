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

    table {
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

    {{-- <h4 style="margin:0px; padding:0px;">श्री गणेश मंदिर संस्थान - सर्व पावत्या {{ \Carbon\Carbon::parse($from_date)->format('d/m/Y') }}
    ते {{ \Carbon\Carbon::parse($to_date)->format('d/m/Y') }}</h4>
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
            @if (\Carbon\Carbon::parse($client->date_of_birth)->format('m-d') >= $fromMonthDay &&
            \Carbon\Carbon::parse($client->date_of_birth)->format('m-d') <= $toMonthDay) <tr>
                <td>{{ \Carbon\Carbon::parse($client->date_of_birth)->format('d/m/Y') }}</td>
                <td>{{ $client->client_name }}</td>
                <td>{{ $client->email }}</td>
                <td>{{ $client->mobile }}</td>
                <td>
                    @php
                    $categories = []; // Initialize an empty array to hold category names

                    // Mediclaim Insurance
                    if ($is_mediclaim_insurance && $client->mediclaimInsurances->isNotEmpty()) {
                    foreach ($client->mediclaimInsurances as $mediclaim) {
                    if ($mediclaim->family_member_id == null && $mediclaim->cancelled == 0 && !in_array('Mediclaim
                    Insurance', $categories)) {
                    $categories[] = 'Mediclaim Insurance'; // Add to categories array
                    }
                    }
                    }

                    // Term Plan
                    if ($is_term_plan && $client->termPlans->isNotEmpty()) {
                    foreach ($client->termPlans as $term) {
                    if ($term->family_member_id == null && $term->cancelled == 0 && !in_array('Term Plan', $categories))
                    {
                    $categories[] = 'Term Plan'; // Add to categories array
                    }
                    }
                    }

                    // LIC
                    if ($is_lic && $client->lics->isNotEmpty()) {
                    foreach ($client->lics as $lic) {
                    if ($lic->family_member_id == null && $lic->cancelled == 0 && !in_array('LIC', $categories)) {
                    $categories[] = 'LIC'; // Add to categories array
                    }
                    }
                    }

                    // Loan
                    if ($is_loan && $client->loans->isNotEmpty()) {
                    foreach ($client->loans as $loan) {
                    if ($loan->cancelled == 0 && !in_array('Loan', $categories)) {
                    $categories[] = 'Loan'; // Add to categories array
                    }
                    }
                    }

                    // General Insurance
                    if ($is_general_insurance && $client->generalInsurances->isNotEmpty()) {
                    foreach ($client->generalInsurances as $insurance) {
                    if ($insurance->family_member_id == null && $insurance->cancelled == 0 && !in_array('General
                    Insurance', $categories)) {
                    $categories[] = 'General Insurance'; // Add to categories array
                    }
                    }
                    }

                    // Demat Account
                    if ($is_demat_account && $client->dematAccounts->isNotEmpty()) {
                    foreach ($client->dematAccounts as $demat) {
                    if ($demat->family_member_id == null && $demat->cancelled == 0 && !in_array('Demat Account',
                    $categories)) {
                    $categories[] = 'Demat Account'; // Add to categories array
                    }
                    }
                    }

                    // Mutual Fund
                    if ($is_mutual_fund && $client->mutualFunds->isNotEmpty()) {
                    foreach ($client->mutualFunds as $mutual) {
                    if ($mutual->family_member_id == null && $mutual->cancelled == 0 && !in_array('Mutual Fund',
                    $categories)) {
                    $categories[] = 'Mutual Fund'; // Add to categories array
                    }
                    }
                    }

                    // Join categories with commas
                    $categoryString = implode(', ', $categories); // Join the categories with commas
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
            @if (\Carbon\Carbon::parse($member->family_member_dob)->format('m-d') >= $fromMonthDay &&
            \Carbon\Carbon::parse($member->family_member_dob)->format('m-d') <= $toMonthDay) <tr>
                <td>{{ \Carbon\Carbon::parse($member->family_member_dob)->format('d/m/Y') }}</td>
                <td>{{ $member->family_member_name }}</td>
                <td>{{ $member->member_email }}</td>
                <td>{{ $member->member_mobile }}</td>
                <td>
                    @php
                    $categories = []; // Initialize an empty array to store the categories

                    // Family Mediclaim Insurance
                    if ($is_mediclaim_insurance) {
                    if ($member->mediclaimInsurances->isNotEmpty()) {
                    foreach ($member->mediclaimInsurances as $mediclaim) {
                    if ($mediclaim->cancelled == 0 && !in_array('Mediclaim Insurance', $categories)) {
                    $categories[] = 'Mediclaim Insurance'; // Add to categories array
                    }
                    }
                    }
                    }

                    // Family Term Plan
                    if ($is_term_plan) {
                    if ($member->termPlans->isNotEmpty()) {
                    foreach ($member->termPlans as $term) {
                    if ($term->cancelled == 0 && !in_array('Term Plan', $categories)) {
                    $categories[] = 'Term Plan'; // Add to categories array
                    }
                    }
                    }
                    }

                    // Family LIC
                    if ($is_lic) {
                    if ($member->lics->isNotEmpty()) {
                    foreach ($member->lics as $lic) {
                    if ($lic->cancelled == 0 && !in_array('LIC', $categories)) {
                    $categories[] = 'LIC'; // Add to categories array
                    }
                    }
                    }
                    }

                    // Family Loan
                    if ($is_loan) {
                    if ($member->loans->isNotEmpty()) {
                    foreach ($member->loans as $loan) {
                    if ($loan->cancelled == 0 && !in_array('Loan', $categories)) {
                    $categories[] = 'Loan'; // Add to categories array
                    }
                    }
                    }
                    }

                    // Family General Insurance
                    if ($is_general_insurance) {
                    if ($member->generalInsurances->isNotEmpty()) {
                    foreach ($member->generalInsurances as $insurance) {
                    if ($insurance->cancelled == 0 && !in_array('General Insurance', $categories)) {
                    $categories[] = 'General Insurance'; // Add to categories array
                    }
                    }
                    }
                    }

                    // Family Demat Account
                    if ($is_demat_account) {
                    if ($member->dematAccounts->isNotEmpty()) {
                    foreach ($member->dematAccounts as $demat) {
                    if ($demat->cancelled == 0 && !in_array('Demat Account', $categories)) {
                    $categories[] = 'Demat Account'; // Add to categories array
                    }
                    }
                    }
                    }

                    // Family Mutual Fund
                    if ($is_mutual_fund) {
                    if ($member->mutualFunds->isNotEmpty()) {
                    foreach ($member->mutualFunds as $mutual) {
                    if ($mutual->cancelled == 0 && !in_array('Mutual Fund', $categories)) {
                    $categories[] = 'Mutual Fund'; // Add to categories array
                    }
                    }
                    }
                    }

                    // Join the categories with commas
                    $categoryString = implode(', ', $categories);
                    @endphp
                    {{ $categoryString }}
                </td>

                </tr>
                @endif
                @endforeach
        </tbody>
    </table>
</body>



</html>