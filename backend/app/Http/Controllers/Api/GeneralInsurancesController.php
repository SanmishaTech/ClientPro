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
                })
                ->orWhereHas('familyMember', function($query) use($searchTerm){
                    $query->where('family_member_name','like', '%' . $searchTerm . '%');
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


        if($generalInsuranceData){
            foreach($generalInsuranceData as $general){
         
           $general_insurance = GeneralInsurance::updateOrCreate(
               ['id' => $general['general_id'], 'client_id' => $general['client_id']], // Condition to check existing member
               [
                   'family_member_id' => $general['family_member_id'] ?? null,
                   'insurance_type' => $general['insurance_type'],
                   'company_name' => $general['company_name'],
                   'premium' => $general['premium'],
                   'start_date' => $general['start_date'],
                   'end_date' => $general['end_date'],
               ]
           );
            }
       }

             
        return $this->sendResponse(['GeneralInsurance'=> new GeneralInsuranceResource($general_insurance)], "General Insurance details updated successfully");
    }

    /**
     * Remove General Insurance.
     */
    // public function destroy(string $id): JsonResponse
    // {
    //     $generalInsurance = GeneralInsurance::find($id);
    //     if(!$generalInsurance){
    //         return $this->sendError("General Insurance details not found", ['error'=>'General Insurance details not found']);
    //     }
        
    //     $generalInsurance->delete();
    //     return $this->sendResponse([], "General Insurance details deleted successfully");
    // }

    public function cancelGeneralInsurance(string $id): JsonResponse
    {
        $generalInsurance = GeneralInsurance::find($id);
        if(!$generalInsurance){
            return $this->sendError("general Insurance not found", ['error'=>'general Insurance not found']);
        }
        $val = 1;
        $generalInsurance->cancelled = $val;
        $generalInsurance->cancelled_by = auth()->user()->profile->id;
        $generalInsurance->save();
        return $this->sendResponse([], "general Insurance Cancelled successfully");
    }
}