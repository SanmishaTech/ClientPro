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
        $mutualFunds = new MutualFund();
        $mutualFunds->client_id = $request->input("client_id");
        $mutualFunds->have_mutual_fund_account = $request->input("have_mutual_fund_account");
        $mutualFunds->account_number = $request->input("account_number");
        $mutualFunds->service_provider = $request->input("service_provider");
        $mutualFunds->save();
     
        return $this->sendResponse(['MutualFund'=> new MutualFundResource($mutualFunds)], 'Mutual Fund Created Successfully');
    }

   

    /**
     * Show Mutual Fund.
     */
    public function show(string $id): JsonResponse
    {
        $mutualFunds = MutualFund::find($id);

        if(!$mutualFunds){
            return $this->sendError("Mutual Fund Details not found", ['error'=>'Mutual Fund Details not found']);
        }
        return $this->sendResponse(['MutualFund'=> new MutualFundResource($mutualFunds)], "Mutual Fund details retrieved successfully");
    }

    /**
     * Update Mutual Fund.
     */
    public function update(UpdateMutualFundRequest $request, string $id): JsonResponse
    {
        $mutualFunds = MutualFund::find($id);
        if(!$mutualFunds){
            return $this->sendError("Mutual Fund details not found", ['error'=>'Mutual Fund details not found']);
        }
        
        $mutualFunds->client_id = $request->input("client_id");
        $mutualFunds->account_number = $request->input("account_number");
        $mutualFunds->have_mutual_fund_account = $request->input("have_mutual_fund_account");
        $mutualFunds->service_provider = $request->input("service_provider");
        $mutualFunds->save();
       
        return $this->sendResponse(['MutualFund'=> new MutualFundResource($mutualFunds)], "Mutual Fund details updated successfully");
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
}