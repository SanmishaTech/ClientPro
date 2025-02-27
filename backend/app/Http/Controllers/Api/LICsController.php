<?php

namespace App\Http\Controllers\Api;

use App\Models\LIC;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\LICResource;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLICRequest;
use App\Http\Requests\UpdateLICRequest;
use App\Http\Controllers\Api\BaseController;

class LICsController extends BaseController
{
     /**
     * All LIC.
     */
    public function index(Request $request): JsonResponse
    {
        $query = LIC::with('client');
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
        $lic = $query->Orderby('id', 'desc')->paginate(20);

        return $this->sendResponse(["LICs"=>LICResource::collection($lic),
        'pagination' => [
            'current_page' => $lic->currentPage(),
            'last_page' => $lic->lastPage(),
            'per_page' => $lic->perPage(),
            'total' => $lic->total(),
        ]], "LICs retrieved successfully");
    }

    /**
     * Store LIC.
     */
    public function store(StoreLICRequest $request): JsonResponse
    {
        
        $lic = new LIC();
        $lic->client_id = $request->input("client_id");
        $lic->company_name = $request->input("company_name");
        $lic->broker_name = $request->input("broker_name");
        $lic->proposal_date = $request->input("proposal_date");
        $lic->end_date = $request->input("end_date");
        $lic->premium_payment_mode = $request->input("premium_payment_mode");
        $lic->sum_insured = $request->input("sum_insured");
        $lic->save();
     
        return $this->sendResponse(['LIC'=> new LICResource($lic)], 'LIC Created Successfully');
   
    }

   

    /**
     * Show LIC.
     */
    public function show(string $id): JsonResponse
    {
        $lic = LIC::find($id);

        if(!$lic){
            return $this->sendError("LIC Details not found", ['error'=>'lic Details not found']);
        }
        return $this->sendResponse(['LIC'=> new LICResource($lic)], "LIC details retrieved successfully");
    }

    /**
     * Update LIC.
     */
    public function update(UpdateLICRequest $request, string $id): JsonResponse
    {
        $lic = LIC::find($id);
        if(!$lic){
            return $this->sendError("LIC details not found", ['error'=>'LIC details not found']);
        }
        
        $lic->client_id = $request->input("client_id");
        $lic->company_name = $request->input("company_name");
        $lic->broker_name = $request->input("broker_name");
        $lic->proposal_date = $request->input("proposal_date");
        $lic->end_date = $request->input("end_date");
        $lic->premium_payment_mode = $request->input("premium_payment_mode");
        $lic->sum_insured = $request->input("sum_insured");
        $lic->save();
       
        return $this->sendResponse(['LIC'=> new LICResource($lic)], "LIC details updated successfully");
    }

    /**
     * Remove LIC.
     */
    public function destroy(string $id): JsonResponse
    {
        $lic = LIC::find($id);
        if(!$lic){
            return $this->sendError("LIC details not found", ['error'=>'LIC details not found']);
        }
        
        $lic->delete();
        return $this->sendResponse([], "LIC details deleted successfully");
    }

}