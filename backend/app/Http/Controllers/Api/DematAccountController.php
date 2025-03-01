<?php

namespace App\Http\Controllers\Api;

use App\Models\DematAccount;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\BaseController;
use App\Http\Resources\DematAccountResource;
use App\Http\Requests\StoreDematAccountRequest;
use App\Http\Requests\UpdateDematAccountRequest;

class DematAccountController extends BaseController
{
    /**
     * All Demat Account.
     */
    public function index(Request $request): JsonResponse
    {
        $query = DematAccount::with('client');
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
        $dematAccounts = $query->Orderby('id', 'desc')->paginate(20);

        return $this->sendResponse(["DematAccounts"=>DematAccountResource::collection($dematAccounts),
        'pagination' => [
            'current_page' => $dematAccounts->currentPage(),
            'last_page' => $dematAccounts->lastPage(),
            'per_page' => $dematAccounts->perPage(),
            'total' => $dematAccounts->total(),
        ]], "Demat Account details retrieved successfully");
    }

    /**
     * Store Demat Account.
     */
    public function store(StoreDematAccountRequest $request): JsonResponse
    {
        $dematAccountData = $request->input('demat_account_data'); // Array containing client and family member data

        foreach ($dematAccountData as $data) {
            $dematAccounts = new DematAccount();
            $dematAccounts->client_id = $data['client_id'];
            $dematAccounts->family_member_id = $data['family_member_id'] ?? null;
            $dematAccounts->company_name = $data['company_name'];
            $dematAccounts->plan_name = $data['plan_name'];
            $dematAccounts->start_date = $data['start_date'];
            $dematAccounts->account_number = $data['account_number'];
            $dematAccounts->service_provider = $data['service_provider'];
            $dematAccounts->save();
        }
     
        return $this->sendResponse(['DematAccount'=> new DematAccountResource($dematAccounts)], 'Demat Account Created Successfully');
    }

   

    /**
     * Show Demat Account.
     */
    public function show(string $id): JsonResponse
    {
        $dematAccounts = DematAccount::find($id);

        if(!$dematAccounts){
            return $this->sendError("Demat Account Details not found", ['error'=>'Demat Account Details not found']);
        }

        $dematAccountData = DematAccount::where('client_id',$dematAccounts->client_id)->get();

        if(!$dematAccountData){
            return $this->sendError("Demat Account not found", ['error'=>'Demat Account not found']);
        }
        return $this->sendResponse(['DematAccount'=> DematAccountResource::collection($dematAccountData)], "Demat Account details retrieved successfully");
    }

    /**
     * Update Demat Account.
     */
    public function update(UpdateDematAccountRequest $request, string $id): JsonResponse
    {
        $dematAccounts = DematAccount::find($id);
        if(!$dematAccounts){
            return $this->sendError("Demat Accounts details not found", ['error'=>'Demat Accounts details not found']);
        }

        $dematAccountData = $request->input('demat_account_data'); // Array containing client and family member data

        $removeDematAccount = DematAccount::where('client_id',$dematAccounts->client_id)->get();
        if(!$removeDematAccount){
            return $this->sendError("Demat Account not found", ['error'=>'Demat Account not found']);
        }
        $removeDematAccount->each(function($familyMember) {
            $familyMember->delete();
        });
    
        foreach ($dematAccountData as $data) {
        $demat_account = new DematAccount();
        $demat_account->client_id = $data['client_id'];
        $demat_account->family_member_id = $data['family_member_id'] ?? null;
        $demat_account->company_name = $data['company_name'];
        $demat_account->plan_name = $data['plan_name'];
        $demat_account->start_date = $data['start_date'];
        $demat_account->account_number = $data['account_number'];
        $demat_account->service_provider = $data['service_provider'];
        $demat_account->save();
       }
       
        return $this->sendResponse(['DematAccount'=> new DematAccountResource($demat_account)], "Demat Account details updated successfully");
    }

    /**
     * Remove Demat Account.
     */
    public function destroy(string $id): JsonResponse
    {
        $dematAccounts = DematAccount::find($id);
        if(!$dematAccounts){
            return $this->sendError("Demat Accounts details not found", ['error'=>'Demat Accounts details not found']);
        }
        
        $dematAccounts->delete();
        return $this->sendResponse([], "Demat Accounts details deleted successfully");
    }
}