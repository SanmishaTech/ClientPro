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
        $totalClientsCount = $clients + $familyMembers;
        $totalMediclaimInsurances = MediclaimInsurance::where("cancelled",false)->count();
        $totalTermPlans = TermPlan::where("cancelled",false)->count();
        $totalLic = LIC::where("cancelled",false)->count();
        $totalLoan = Loan::where("cancelled",false)->count();
        $totalgeneralInsurance = GeneralInsurance::where("cancelled",false)->count();
        $totalDematAccount = DematAccount::where("cancelled",false)->count();
        $totalMutualFund = MutualFund::where("cancelled",false)->count();
        
        $currentMonth = now()->month; 

        // Fetch clients and family members with birthdays in the current month
        $clients = Client::whereMonth('date_of_birth', $currentMonth)->get();
        $familyMembers = FamilyMember::whereMonth('family_member_dob', $currentMonth)->get();
    
        // Format the data
        $formattedClients = $clients->map(function ($record) {
            return [
                'name'  => $record->client_name,
                'email' => $record->email,
                'mobile' => $record->mobile,
                'date_of_birth' => $record->date_of_birth
            ];
        });
    
        $formattedFamilyMembers = $familyMembers->map(function ($record) {
            return [
                'name'  => $record->family_member_name,
                'email' => $record->member_email,
                'mobile' => $record->member_mobile,
                'date_of_birth' => $record->family_member_dob
            ];
        });
    
        // Merge and sort by date_of_birth (ignoring year)
        $mergedCollection = $formattedClients->merge($formattedFamilyMembers)
            ->sortBy(fn($item) => \Carbon\Carbon::parse($item['date_of_birth'])->format('m-d'))
            ->values();
    
        // Apply pagination
        $perPage = 5;
        $currentPage = $request->query('page', 1);
        $totalItems = $mergedCollection->count();
    
        $pagedData = $mergedCollection->slice(($currentPage - 1) * $perPage, $perPage)->values();
    
        $paginatedResults = new \Illuminate\Pagination\LengthAwarePaginator(
            $pagedData,
            $totalItems,
            $perPage,
            $currentPage,
            ['path' => $request->url()]
        );

        // Return the response with the client data
        return $this->sendResponse(
            ["totalClients" =>$totalClientsCount,
             "totalMediclaimInsurances"=>$totalMediclaimInsurances,
             "totalTermPlans"=>$totalTermPlans,
             "totalLic"=>$totalLic,
             "totalLoan"=>$totalLoan,
             "totalgeneralInsurance"=>$totalgeneralInsurance,
             "totalDematAccount"=>$totalDematAccount,
             "totalMutualFund"=>$totalMutualFund,
             "birthdayUsers" =>$paginatedResults->items(),
             'pagination' => [
                'current_page' => $paginatedResults->currentPage(),
                'last_page' => $paginatedResults->lastPage(),
                'per_page' => $paginatedResults->perPage(),
                'total' => $paginatedResults->total(),
            ]
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