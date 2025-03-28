<?php

namespace App\Http\Controllers\Api;

use App\Models\MutualFund;
use App\Models\DematAccount;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\MutualFundResource;
use App\Http\Controllers\Api\BaseController;
use App\Http\Resources\DematAccountResource;
use App\Http\Requests\StoreMutualFundRequest;
use App\Http\Requests\UpdateMutualFundRequest;


class MutualFundController extends BaseController
{
    /**
     * All Mutual Fund.
     */
    public function index(Request $request): JsonResponse
    {
        $query = MutualFund::with('client');
        if ($request->query('search')) {
            $searchTerm = $request->query('search');
    
            $query->where(function ($query) use ($searchTerm) {
                $query->where('service_provider', 'like', '%' . $searchTerm . '%')
                ->orWhere('account_number', 'like', '%' . $searchTerm . '%')
                ->orWhereHas('client', function($query) use($searchTerm){
                    $query->where('client_name','like', '%' . $searchTerm . '%');
                })
                ->orWhereHas('familyMember', function($query) use($searchTerm){
                    $query->where('family_member_name','like', '%' . $searchTerm . '%');
                });

            });
        }
        $mutualFunds = $query->Orderby('id', 'desc')->paginate(20);

        return $this->sendResponse(["MutualFunds"=>MutualFundResource::collection($mutualFunds),
        'pagination' => [
            'current_page' => $mutualFunds->currentPage(),
            'last_page' => $mutualFunds->lastPage(),
            'per_page' => $mutualFunds->perPage(),
            'total' => $mutualFunds->total(),
        ]], "Mutual Funds details retrieved successfully");
    }

    /**
     * Store Mutual Fund.
     */
    public function store(StoreMutualFundRequest $request): JsonResponse
    {
      
        $mutualFundData = $request->input('mutual_fund_data'); // Array containing client and family member data

        foreach ($mutualFundData as $data) {
            $mutualFunds = new MutualFund();
            $mutualFunds->client_id = $data['client_id'];
            $mutualFunds->family_member_id = $data['family_member_id'] ?? null;
            $mutualFunds->mutual_fund_name = $data['mutual_fund_name'];
            $mutualFunds->reference_name = $data['reference_name'];
            $mutualFunds->start_date = $data['start_date'];
            $mutualFunds->account_number = $data['account_number'];
            $mutualFunds->service_provider = $data['service_provider'];
            $mutualFunds->save();
        }
     
        return $this->sendResponse(['MutualFund'=> new MutualFundResource($mutualFunds)], 'Mutual Fund Created Successfully');
    }

   

    /**
     * Show Mutual Fund.
     */
    // public function show(string $id): JsonResponse
    // {
    //     $mutualFunds = MutualFund::find($id);

    //     if(!$mutualFunds){
    //         return $this->sendError("Mutual Fund Details not found", ['error'=>'Mutual Fund Details not found']);
    //     }

    //     $mutualFundData = MutualFund::where('client_id',$mutualFunds->client_id)->get();

    //     if(!$mutualFundData){
    //         return $this->sendError("Mutual Fund not found", ['error'=>'Mutual Fund not found']);
    //     }
    //     return $this->sendResponse(['MutualFund'=> MutualFundResource::collection($mutualFundData)], "Mutual Fund details retrieved successfully");
    // }

    public function show(string $id): JsonResponse
    {
        $mutualFund = MutualFund::find($id);

        if(!$mutualFund){
            return $this->sendError("Mutual Fund Details not found", ['error'=>'Mutual Fund Details not found']);
        }
        return $this->sendResponse(['MutualFund'=> new MutualFundResource($mutualFund)], "Mutual Fund details retrieved successfully");
    }


    /**
     * Update Mutual Fund.
     */
    // public function update(UpdateMutualFundRequest $request, string $id): JsonResponse
    // {
    //     $mutualFunds = MutualFund::find($id);
    //     if(!$mutualFunds){
    //         return $this->sendError("Mutual Fund details not found", ['error'=>'Mutual Fund details not found']);
    //     }

    //     $mutualFundData = $request->input('mutual_fund_data'); // Array containing client and family member data

    //     if($mutualFundData){
    //         foreach($mutualFundData as $mutual){
         
    //        $mutual_fund = MutualFund::updateOrCreate(
    //            ['id' => $mutual['mutual_id'], 'client_id' => $mutual['client_id']], // Condition to check existing member
    //            [
    //                'family_member_id' => $mutual['family_member_id'] ?? null,
    //                'mutual_fund_name' => $mutual['mutual_fund_name'],
    //                'reference_name' => $mutual['reference_name'],
    //                'account_number' => $mutual['account_number'],
    //                'start_date' => $mutual['start_date'],
    //                'service_provider' => $mutual['service_provider'],
    //            ]
    //        );
    //         }
    //    }
        
    //     return $this->sendResponse(['MutualFund'=> new MutualFundResource($mutual_fund)], "Mutual Fund details updated successfully");
    // }

    public function update(UpdateMutualFundRequest $request, string $id): JsonResponse
    {
        $mutualFund = MutualFund::find($id);
        if(!$mutualFund){
            return $this->sendError("Mutual Fund details not found", ['error'=>'Mutual Fund details not found']);
        }
        
        $mutualFund->client_id = $request->input("client_id");
        $mutualFund->family_member_id = $request->input("family_member_id");
        $mutualFund->mutual_fund_name = $request->input("mutual_fund_name");
        $mutualFund->reference_name = $request->input("reference_name");
        $mutualFund->account_number = $request->input("account_number");
        $mutualFund->start_date = $request->input("start_date");
        $mutualFund->service_provider = $request->input("service_provider");
        $mutualFund->save();
       
        return $this->sendResponse(['MutualFund'=> new MutualFundResource($mutualFund)], "Mutual Fund details updated successfully");
    }

    /**
     * Remove Mutual Fund.
     */
    public function destroy(string $id): JsonResponse
    {
        $mutualFunds = MutualFund::find($id);
        if(!$mutualFunds){
            return $this->sendError("Mutual Funds details not found", ['error'=>'Mutual Funds details not found']);
        }
        
        $mutualFunds->delete();
        return $this->sendResponse([], "Mutual Funds details deleted successfully");
    }

    public function cancelMutualFund(string $id): JsonResponse
    {
        $mutualFunds = MutualFund::find($id);
        if(!$mutualFunds){
            return $this->sendError("mutual Funds not found", ['error'=>'mutual Funds not found']);
        }
        $val = 1;
        $mutualFunds->cancelled = $val;
        $mutualFunds->cancelled_by = auth()->user()->profile->id;
        $mutualFunds->save();
        return $this->sendResponse([], "mutual Funds Cancelled successfully");
    }
}