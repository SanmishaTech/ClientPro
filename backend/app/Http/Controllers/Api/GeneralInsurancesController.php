<?php

namespace App\Http\Controllers\Api;

use App\Models\TermPlan;
use Illuminate\Http\Request;
use App\Models\GeneralInsurance;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\BaseController;
use App\Http\Resources\GeneralInsuranceResource;

class GeneralInsurancesController extends BaseController
{
    /**
     * All General Insurance.
     */
    public function index(Request $request): JsonResponse
    {
        $query = GeneralInsurance::with('client');
        if ($request->query('search')) {
            $searchTerm = $request->query('search');
    
            $query->where(function ($query) use ($searchTerm) {
                $query->where('company_name', 'like', '%' . $searchTerm . '%')
                ->orWhere('insurance_type', 'like', '%' . $searchTerm . '%')
                ->orWhere('premium',$searchTerm )
                ->orWhereHas('client', function($query) use($searchTerm){
                    $query->where('client_name','like', '%' . $searchTerm . '%');
                });
            });
        }
        $generalInsurances = $query->Orderby('id', 'desc')->paginate(20);

        return $this->sendResponse(["GeneralInsurances"=>GeneralInsuranceResource::collection($generalInsurances),
        'pagination' => [
            'current_page' => $generalInsurances->currentPage(),
            'last_page' => $generalInsurances->lastPage(),
            'per_page' => $generalInsurances->perPage(),
            'total' => $generalInsurances->total(),
        ]], "General Insurances details retrieved successfully");
    }

    /**
     * Store General Insurance.
     */
    public function store(Request $request): JsonResponse
    {
        $generalInsuranceData = $request->input('general_insurance_data'); // Array containing client and family member data

        foreach ($generalInsuranceData as $data) {
            $generalInsurance = new GeneralInsurance();
            $generalInsurance->client_id = $data['client_id'];
            $generalInsurance->family_member_id = $data['family_member_id'] ?? null;
            $generalInsurance->company_name = $data['company_name'];
            $generalInsurance->premium = $data['premium'];
            $generalInsurance->start_date = $data['start_date'];
            $generalInsurance->end_date = $data['end_date'];
            $generalInsurance->insurance_type = $data['insurance_type'];
            $generalInsurance->save();
        }
        
        return $this->sendResponse(['GeneralInsurance'=> new GeneralInsuranceResource($generalInsurance)], 'General Insurance Created Successfully');
    }

   

    /**
     * Show General Insurance.
     */
    public function show(string $id): JsonResponse
    {
        $generalInsurance = GeneralInsurance::find($id);
        if(!$generalInsurance){
            return $this->sendError("General Insurance Details not found", ['error'=>'General Insurance Details not found']);
        }

        $generalInsuranceData = GeneralInsurance::where('client_id',$generalInsurance->client_id)->get();
        if(!$generalInsuranceData){
            return $this->sendError("General Insurance not found", ['error'=>'General Insurance not found']);
        }
        
        return $this->sendResponse(['GeneralInsurance'=> GeneralInsuranceResource::collection($generalInsuranceData)], "General Insurance details retrieved successfully");
    }

    /**
     * Update General Insurance.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $generalInsurance = GeneralInsurance::find($id);
        if(!$generalInsurance){
            return $this->sendError("General Insurance details not found", ['error'=>'General Insurance details not found']);
        }

        $generalInsuranceData = $request->input('general_insurance_data'); // Array containing client and family member data

        $removeGeneralInsurance = GeneralInsurance::where('client_id',$generalInsurance->client_id)->get();
        if(!$removeGeneralInsurance){
            return $this->sendError("General Insurance not found", ['error'=>'General Insurance not found']);
        }
        $removeGeneralInsurance->each(function($familyMember) {
            $familyMember->delete();
        });
    
        foreach ($generalInsuranceData as $data) {
        $general_insurance = new GeneralInsurance();
        $general_insurance->client_id = $data['client_id'];
        $general_insurance->family_member_id = $data['family_member_id'] ?? null;
        $general_insurance->company_name = $data['company_name'];
        $general_insurance->premium = $data['premium'];
        $general_insurance->start_date = $data['start_date'];
        $general_insurance->end_date = $data['end_date'];
        $general_insurance->insurance_type = $data['insurance_type'];
        $general_insurance->save();
       }
        
        return $this->sendResponse(['GeneralInsurance'=> new GeneralInsuranceResource($general_insurance)], "General Insurance details updated successfully");
    }

    /**
     * Remove General Insurance.
     */
    public function destroy(string $id): JsonResponse
    {
        $generalInsurance = GeneralInsurance::find($id);
        if(!$generalInsurance){
            return $this->sendError("General Insurance details not found", ['error'=>'General Insurance details not found']);
        }
        
        $generalInsurance->delete();
        return $this->sendResponse([], "General Insurance details deleted successfully");
    }
}