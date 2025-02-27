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
        $dematAccounts = new DematAccount();
        $dematAccounts->client_id = $request->input("client_id");
        $dematAccounts->have_demat_account = $request->input("have_demat_account");
        $dematAccounts->account_number = $request->input("account_number");
        $dematAccounts->service_provider = $request->input("service_provider");
        $dematAccounts->save();
     
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
        return $this->sendResponse(['DematAccount'=> new DematAccountResource($dematAccounts)], "Demat Account details retrieved successfully");
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
        
        $dematAccounts->client_id = $request->input("client_id");
        $dematAccounts->account_number = $request->input("account_number");
        $dematAccounts->have_demat_account = $request->input("have_demat_account");
        $dematAccounts->service_provider = $request->input("service_provider");
        $dematAccounts->save();
       
        return $this->sendResponse(['DematAccount'=> new DematAccountResource($dematAccounts)], "Demat Account details updated successfully");
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