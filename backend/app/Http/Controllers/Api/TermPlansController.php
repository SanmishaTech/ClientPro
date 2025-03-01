<?php

namespace App\Http\Controllers\Api;

use App\Models\TermPlan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\TermPlanResource;
use App\Http\Requests\StoreTermPlanRequest;
use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\UpdateTermPlanRequest;

class TermPlansController extends BaseController
{
    /**
     * All Term Plan.
     */
    public function index(Request $request): JsonResponse
    {
        $query = TermPlan::with('client');
        if ($request->query('search')) {
            $searchTerm = $request->query('search');
    
            $query->where(function ($query) use ($searchTerm) {
                $query->where('term_company_name', 'like', '%' . $searchTerm . '%')
                ->orWhere('broker_name', 'like', '%' . $searchTerm . '%')
                ->orWhere('sum_insured', 'like', '%' . $searchTerm . '%')
                ->orWhereHas('client', function($query) use($searchTerm){
                    $query->where('client_name','like', '%' . $searchTerm . '%');
                });

            });
        }
        $term_plans = $query->Orderby('id', 'desc')->paginate(20);

        return $this->sendResponse(["TermPlans"=>TermPlanResource::collection($term_plans),
        'pagination' => [
            'current_page' => $term_plans->currentPage(),
            'last_page' => $term_plans->lastPage(),
            'per_page' => $term_plans->perPage(),
            'total' => $term_plans->total(),
        ]], "Term plans retrieved successfully");
    }

    /**
     * Store Term Plan.
     */
    public function store(StoreTermPlanRequest $request): JsonResponse
    {

        $termPlanData = $request->input('term_plan_data'); // Array containing client and family member data

        foreach ($termPlanData as $data) {
            $term_plan = new TermPlan();
            $term_plan->client_id = $data['client_id'];
            $term_plan->family_member_id = $data['family_member_id'] ?? null;
            $term_plan->term_company_name = $data['term_company_name'];
            $term_plan->broker_name = $data['broker_name'];
            $term_plan->policy_number = $data['policy_number'];
            $term_plan->plan_name = $data['plan_name'];
            $term_plan->premium_without_gst = $data['premium_without_gst'];
            $term_plan->proposal_date = $data['proposal_date'];
            $term_plan->end_date = $data['end_date'];
            $term_plan->premium_payment_mode = $data['premium_payment_mode'];
            $term_plan->sum_insured = $data['sum_insured'];
            $term_plan->save();
        }
     
        return $this->sendResponse(['TermPlan'=> new TermPlanResource($term_plan)], 'Term Plan Created Successfully');
   
    }

    /**
     * Show Term Plan.
     */
    public function show(string $id): JsonResponse
    {
        $termPlan = TermPlan::find($id);

        if(!$termPlan){
            return $this->sendError("Term Plan not found", ['error'=>'Term Plan not found']);
        }

        $termPlanData = TermPlan::where('client_id',$termPlan->client_id)->get();

        if(!$termPlanData){
            return $this->sendError("Term Plan not found", ['error'=>'Term Plan not found']);
        }
        return $this->sendResponse(['TermPlan'=> TermPlanResource::collection($termPlanData)], "Term Plan retrieved successfully");
    }

    /**
     * Update Term Plan.
     */
    public function update(UpdateTermPlanRequest $request, string $id): JsonResponse
    {
        $termPlan = TermPlan::find($id);

        if(!$termPlan){
            return $this->sendError("Term Plan not found", ['error'=>'Term Plan not found']);
        }
        
        $termPlanData = $request->input('term_plan_data'); // Array containing client and family member data

        $removeTermPlan = TermPlan::where('client_id',$termPlan->client_id)->get();
        if(!$removeTermPlan){
            return $this->sendError("Term Plan not found", ['error'=>'Term Plan not found']);
        }
        $removeTermPlan->each(function($familyMember) {
            $familyMember->delete();
        });
    
        foreach ($termPlanData as $data) {
        $term_plan = new TermPlan();
        $term_plan->client_id = $data['client_id'];
        $term_plan->family_member_id = $data['family_member_id'] ?? null;
        $term_plan->term_company_name = $data['term_company_name'];
        $term_plan->broker_name = $data['broker_name'];
        $term_plan->policy_number = $data['policy_number'];
        $term_plan->plan_name = $data['plan_name'];
        $term_plan->premium_without_gst = $data['premium_without_gst'];
        $term_plan->proposal_date = $data['proposal_date'];
        $term_plan->end_date = $data['end_date'];
        $term_plan->premium_payment_mode = $data['premium_payment_mode'];
        $term_plan->sum_insured = $data['sum_insured'];
        $term_plan->save();
       }
       
        return $this->sendResponse(['TermPlan'=> new TermPlanResource($term_plan)], "Term Plan updated successfully");
    }

    /**
     * Remove Term Plan.
     */
    public function destroy(string $id): JsonResponse
    {
        $termPlan = TermPlan::find($id);
        if(!$termPlan){
            return $this->sendError("Term Plan not found", ['error'=>'Term Plan not found']);
        }
        
        $termPlan->delete();
        return $this->sendResponse([], "Term Plan deleted successfully");
    }

    /**
     * Fetch All Term Plan.
     */
    public function allTermPlan(): JsonResponse
    {
        $termPlan = TermPlan::all();

        return $this->sendResponse(["TermPlans"=>TermPlanResource::collection($termPlan),
        ], "Term Plan retrieved successfully");
    }
}