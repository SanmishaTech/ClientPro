<?php

namespace App\Http\Controllers\Api;

use App\Models\LIC;
use App\Models\Loan;
use App\Models\Client;
use App\Models\Receipt;
use App\Models\TermPlan;
use App\Models\MutualFund;
use App\Models\DematAccount;
use App\Models\FamilyMember;
use Illuminate\Http\Request;
use App\Models\GeneralInsurance;
use Illuminate\Http\JsonResponse;
use App\Models\MediclaimInsurance;
use App\Http\Controllers\Controller;
use App\Http\Resources\ClientResource;
use App\Http\Controllers\Api\BaseController;

class DashboardController extends BaseController
{
     /**
     * Dashboard
     */
    public function index(Request $request): JsonResponse
    {
        // Get clients whose 'date_of_birth' is today's date
        $clients = Client::count();
        $familyMembers = FamilyMember::count();
        $totalMediclaimInsurances = MediclaimInsurance::count();
        $totalTermPlans = TermPlan::count();
        $totalLic = LIC::count();
        $totalLoan = Loan::count();
        $totalgeneralInsurance = GeneralInsurance::count();
        $totalDematAccount = DematAccount::count();
        $totalMutualFund = MutualFund::count();
        
        $currentDate = now()->startOfDay(); // Current date
        $threeMonthsLater = $currentDate->copy()->addMonths(3)->endOfDay(); // Date 3 months from today

        // $birthdayClients = Client::whereBetween('date_of_birth', [$currentDate, $threeMonthsLater])->get();

        // $birthdayFamilyMembers = FamilyMember::whereBetween('family_member_dob', [$currentDate, $threeMonthsLater])->get();

        // $birthdayClients = $birthdayClients->flatMap(function ($record) {
        //     return [
        //         'name'  => $record->client_name,
        //         'email' => $record->email,
        //         'mobile' => $record->mobile,
        //         'date_of_birth' => $record->date_of_birth
        //     ];
        // });

        // $birthdayFamilyMembers = $birthdayFamilyMembers->flatMap(function ($record) {
        //     return [
        //         'name'  => $record->family_member_name,
        //         'email' => $record->member_email,
        //         'mobile' => $record->member_mobile,
        //         'date_of_birth' => $record->family_member_dob
        //     ];
        // });
        
        // $mergedRecords = $birthdayClients->merge($birthdayFamilyMembers);
        $birthdayClients = Client::whereBetween('date_of_birth', [$currentDate, $threeMonthsLater])->get();

// Get Family Members whose birthday is within the next 3 months
$birthdayFamilyMembers = FamilyMember::whereBetween('family_member_dob', [$currentDate, $threeMonthsLater])->get();

// Use map to extract specific fields like name, email, and others
$birthdayClients = $birthdayClients->map(function ($record) {
    // Assuming both Client and FamilyMember have 'name' and 'email' attributes
    return [
        'name'  => $record->client_name,
        'email' => $record->email,
        'mobile' => $record->mobile,
        'date_of_birth' => $record->date_of_birth
    ];
});

$birthdayFamilyMembers = $birthdayFamilyMembers->map(function ($record) {
    // Assuming FamilyMember has 'name', 'email', and 'mobile' attributes
    return [
        'name'  => $record->family_member_name,
        'email' => $record->member_email,
        'mobile' => $record->member_mobile,
        'date_of_birth' => $record->family_member_dob
    ];
});

// Merge both records into one collection
$mergedRecords = $birthdayClients->merge($birthdayFamilyMembers);

// Optionally, you can use flatMap if you want to further flatten the records (but this is not required in your case)


        

        // Return the response with the client data
        return $this->sendResponse(
            ["totalClients" =>$clients,
             "totalMediclaimInsurances"=>$totalMediclaimInsurances,
             "totalTermPlans"=>$totalTermPlans,
             "totalLic"=>$totalLic,
             "totalLoan"=>$totalLoan,
             "totalgeneralInsurance"=>$totalgeneralInsurance,
             "totalDematAccount"=>$totalDematAccount,
             "totalMutualFund"=>$totalMutualFund,
             "birthdayUsers" =>$mergedRecords,
            ],
            "Dashboard data retrieved successfully"
        );
    }
    

















    
//     public function todaysPooja(): JsonResponse
//     {
//         // Get today's date
//     $date = now()->toDateString();  // Using `now()` instead of Date() for simplicity

//     // Retrieve receipts with their poojas, pooja types, and devta information
//     $receipts = Receipt::with(['poojas.poojaType.devta'])  // Eager load devta info through poojaType
//         ->where("cancelled", false)
//         ->whereHas('poojas', function ($query) use ($date) {
//             // Filter poojas where the date matches today's date
//             $query->where('date', $date);
//         })
//         ->get();
    
//     // Flatten and map over the poojas to get the relevant information
//     $poojaDetails = $receipts->flatMap(function ($receipt) use ($date) {
//         // Filter the poojas to match today's date
//         return $receipt->poojas->filter(function ($pooja) use ($date) {
//             return $pooja->date == $date;  // Match pooja's date with today's date
//         })->map(function ($pooja) use ($receipt) {
//             return [
//                 'name' => $receipt->name,  // User's name from receipt
//                 'email' => $receipt->email, // Email from receipt
//                 'mobile' => $receipt->mobile, // Mobile from receipt
//                 'poojaType' => $pooja->poojaType->pooja_type,  // Name of the pooja type
//                 'devtaName' => $pooja->poojaType->devta->devta_name, // Devta name from the related devta model
//                 'date' => $pooja->date,  // Date of the pooja (today's date)
//             ];
//         });
//     });

//     // Return the list of pooja details as a JSON response
//     return response()->json($poojaDetails);
//     return $this->sendResponse(["PoojaDetails"=>$poojaDetails, 'ReceiptCount'=>$receiptCountToday, 'ReceiptAmount'=>$totalAmountToday,'CancelledReceiptCount'=>$cancelledReceipts], "Todays Pooja Details retrieved successfully");
// }

}