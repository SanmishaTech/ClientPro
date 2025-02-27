<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\MediclaimInsurance;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\BaseController;
use App\Http\Resources\MediclaimInsuranceResource;
use App\Http\Requests\StoreMediclaimInsuranceRequest;
use App\Http\Requests\UpdateMediclaimInsuranceRequest;

class MediclaimInsurancesController extends BaseController
{
    /**
     * All Mediclaim Insurance.
     */
    public function index(Request $request): JsonResponse
    {
        $query = MediclaimInsurance::with('client');
        if ($request->query('search')) {
            $searchTerm = $request->query('search');
    
            $query->where(function ($query) use ($searchTerm) {
                $query->where('company_name', 'like', '%' . $searchTerm . '%')
                ->orWhere('broker_name', 'like', '%' . $searchTerm . '%')
                ->orWhere('sum_insured', 'like', '%' . $searchTerm . '%')
                ->orWhereHas('client', function($query) use($searchTerm){
                    $query->where('client_name','like', '%' . $searchTerm . '%');
                });

            });
        }
        $mediclaimInsurances = $query->Orderby('id', 'desc')->paginate(20);

        return $this->sendResponse(["MediclaimInsurances"=>MediclaimInsuranceResource::collection($mediclaimInsurances),
        'pagination' => [
            'current_page' => $mediclaimInsurances->currentPage(),
            'last_page' => $mediclaimInsurances->lastPage(),
            'per_page' => $mediclaimInsurances->perPage(),
            'total' => $mediclaimInsurances->total(),
        ]], "Mediclaim Insurances retrieved successfully");
    }

    /**
     * Store Mediclaim Insurance.
     */
    public function store(StoreMediclaimInsuranceRequest $request): JsonResponse
    {
        
        $mediclaimData = $request->input('mediclaim_data'); // Array containing client and family member data

    foreach ($mediclaimData as $data) {
        $mediclaimInsurance = new MediclaimInsurance();
        $mediclaimInsurance->client_id = $data['client_id'];
        $mediclaimInsurance->family_member_id = $data['family_member_id'] ?? null;
        $mediclaimInsurance->company_name = $data['company_name'];
        $mediclaimInsurance->broker_name = $data['broker_name'];
        $mediclaimInsurance->proposal_date = $data['proposal_date'];
        $mediclaimInsurance->end_date = $data['end_date'];
        $mediclaimInsurance->premium_payment_mode = $data['premium_payment_mode'];
        $mediclaimInsurance->sum_insured = $data['sum_insured'];
        $mediclaimInsurance->save();
    }
     
        return $this->sendResponse(['MediclaimInsurance'=> new MediclaimInsuranceResource($mediclaimInsurance)], 'Mediclaim Insurance Created Successfully');
   
    }

   

    /**
     * Show Mediclaim Insurance.
     */
    public function show(string $id): JsonResponse
    {
        $mediclaimInsurance = MediclaimInsurance::find($id);
        
        if(!$mediclaimInsurance){
            return $this->sendError("Mediclaim Insurance not found", ['error'=>'Mediclaim Insurance not found']);
        }

        $mediclaimInsuranceData = MediclaimInsurance::where('client_id',$mediclaimInsurance->client_id)->get();

        if(!$mediclaimInsuranceData){
            return $this->sendError("Mediclaim Insurance not found", ['error'=>'Mediclaim Insurance not found']);
        }
        return $this->sendResponse(['MediclaimInsurance'=> MediclaimInsuranceResource::collection($mediclaimInsuranceData)], "Mediclaim Insurance retrieved successfully");
    }

    /**
     * Update Mediclaim Insurance.
     */
    public function update(UpdateMediclaimInsuranceRequest $request, string $id): JsonResponse
    {
      
        $mediclaimData = $request->input('mediclaim_data'); // Array containing client and family member data

        // foreach ($mediclaimData as $data) {

        $removeFamilyMediclaim = MediclaimInsurance::where('client_id',$mediclaimData[0]['client_id'])->get();
        $removeFamilyMediclaim->each(function($familyMember) {
            $familyMember->delete();
        });
    // }

        foreach ($mediclaimData as $data) {
        $mediclaimInsurance = new MediclaimInsurance();
        $mediclaimInsurance->client_id = $data['client_id'];
        $mediclaimInsurance->family_member_id = $data['family_member_id'] ?? null;
        $mediclaimInsurance->company_name = $data['company_name'];
        $mediclaimInsurance->broker_name = $data['broker_name'];
        $mediclaimInsurance->proposal_date = $data['proposal_date'];
        $mediclaimInsurance->end_date = $data['end_date'];
        $mediclaimInsurance->premium_payment_mode = $data['premium_payment_mode'];
        $mediclaimInsurance->sum_insured = $data['sum_insured'];
        $mediclaimInsurance->save();
       }
       
        return $this->sendResponse(['MediclaimInsurance'=> new MediclaimInsuranceResource($mediclaimInsurance)], "Mediclaim Insurance updated successfully");
    }

    /**
     * Remove Mediclaim Insurance.
     */
    public function destroy(string $id): JsonResponse
    {
        $mediclaimInsurance = MediclaimInsurance::find($id);
        if(!$mediclaimInsurance){
            return $this->sendError("Mediclaim Insurance not found", ['error'=>'Mediclaim Insurance not found']);
        }
        
        $mediclaimInsurance->delete();
        return $this->sendResponse([], "Mediclaim Insurance deleted successfully");
    }

    /**
     * Fetch All Mediclaim Insurance.
     */
    public function allMediclaimInsurance(): JsonResponse
    {
        $client = MediclaimInsurance::all();

        return $this->sendResponse(["MediclaimInsurances"=>MediclaimInsuranceResource::collection($client),
        ], "Mediclaim Insurances retrieved successfully");

    }
}