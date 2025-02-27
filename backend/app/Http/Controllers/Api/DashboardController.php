<?php

namespace App\Http\Controllers\Api;

use App\Models\Client;
use App\Models\Receipt;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
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
        $clients = Client::whereDate('date_of_birth', today())->get();
    
        // Return the response with the client data
        return $this->sendResponse(
            ["Clients" => ClientResource::collection($clients)],
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