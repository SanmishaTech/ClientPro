<?php

namespace App\Http\Controllers\Api;

use App\Models\LIC;
use App\Models\TermPlan;
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
                })
                ->orWhereHas('familyMember', function($query) use($searchTerm){
                    $query->where('family_member_name','like', '%' . $searchTerm . '%');
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
        
        $licData = $request->input('lic_data'); // Array containing client and family member data

        foreach ($licData as $data) {
            $lic = new LIC();
            $lic->client_id = $data['client_id'];
            $lic->family_member_id = $data['family_member_id'] ?? null;
            $lic->company_name = $data['company_name'];
            $lic->broker_name = $data['broker_name'];
            $lic->policy_number = $data['policy_number'];
            $lic->plan_name = $data['plan_name'];
            $lic->premium_without_gst = $data['premium_without_gst'];
            $lic->commencement_date = $data['commencement_date'];
            $lic->term = $data['term'];
            $lic->ppt = $data['ppt'];
            $lic->proposal_date = $data['proposal_date'];
            $lic->end_date = $data['end_date'];
            $lic->premium_payment_mode = $data['premium_payment_mode'];
            $lic->sum_insured = $data['sum_insured'];
            $lic->save();
        }
     
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

        $licData = LIC::where('client_id',$lic->client_id)->get();

        if(!$licData){
            return $this->sendError("LIC Details not found", ['error'=>'LIC Details not found']);
        }
        return $this->sendResponse(['LIC'=> LICResource::collection($licData)], "LIC details retrieved successfully");
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
        
        $licData = $request->input('lic_data'); // Array containing client and family member data

        if($licData){
            foreach($licData as $lic){
         
           $LIC = LIC::updateOrCreate(
               ['id' => $lic['lic_id'], 'client_id' => $lic['client_id']], // Condition to check existing member
               [
                   'family_member_id' => $lic['family_member_id'] ?? null,
                   'company_name' => $lic['company_name'],
                   'broker_name' => $lic['broker_name'],
                   'policy_number' => $lic['policy_number'],
                   'plan_name' => $lic['plan_name'],
                   'premium_without_gst' => $lic['premium_without_gst'],
                   'commencement_date' => $lic['commencement_date'],
                   'term' => $lic['term'],
                   'ppt' => $lic['ppt'],
                   'proposal_date' => $lic['proposal_date'],
                   'end_date' => $lic['end_date'],
                   'premium_payment_mode' => $lic['premium_payment_mode'],
                   'sum_insured' => $lic['sum_insured'],
               ]
           );
            }
       }
       
        return $this->sendResponse(['LIC'=> new LICResource($LIC)], "LIC details updated successfully");
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