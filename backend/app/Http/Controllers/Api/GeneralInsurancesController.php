<?php

namespace App\Http\Controllers\Api;

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
    
            $query->whereHas("client",function ($query) use ($searchTerm) {
                    $query->where('client_name','like', '%' . $searchTerm . '%');
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
        $generalInsurance = new GeneralInsurance();
        $generalInsurance->client_id = $request->input("client_id");
        $generalInsurance->vehicle = $request->input("vehicle");
        $generalInsurance->fire = $request->input("fire");
        $generalInsurance->society = $request->input("society");
        $generalInsurance->workman = $request->input("workman");
        $generalInsurance->personal_accident = $request->input("personal_accident");
        $generalInsurance->others = $request->input("others");
        $generalInsurance->save();
        
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
        return $this->sendResponse(['GeneralInsurance'=> new GeneralInsuranceResource($generalInsurance)], "General Insurance details retrieved successfully");
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
        
        $generalInsurance->client_id = $request->input("client_id");
        $generalInsurance->vehicle = $request->input("vehicle");
        $generalInsurance->fire = $request->input("fire");
        $generalInsurance->society = $request->input("society");
        $generalInsurance->workman = $request->input("workman");
        $generalInsurance->personal_accident = $request->input("personal_accident");
        $generalInsurance->others = $request->input("others");
        $generalInsurance->save();
       
        return $this->sendResponse(['GeneralInsurance'=> new GeneralInsuranceResource($generalInsurance)], "General Insurance details updated successfully");
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