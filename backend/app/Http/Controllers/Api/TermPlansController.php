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
        
        $termPlan = new TermPlan();
        $termPlan->client_id = $request->input("client_id");
        $termPlan->term_company_name = $request->input("term_company_name");
        $termPlan->broker_name = $request->input("broker_name");
        $termPlan->proposal_date = $request->input("proposal_date");
        $termPlan->end_date = $request->input("end_date");
        $termPlan->premium_payment_mode = $request->input("premium_payment_mode");
        $termPlan->sum_insured = $request->input("sum_insured");
        $termPlan->save();
     
        return $this->sendResponse(['TermPlan'=> new TermPlanResource($termPlan)], 'Term Plan Created Successfully');
   
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
        return $this->sendResponse(['TermPlan'=> new TermPlanResource($termPlan)], "Term Plan retrieved successfully");
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
        
        $termPlan->client_id = $request->input("client_id");
        $termPlan->term_company_name = $request->input("term_company_name");
        $termPlan->broker_name = $request->input("broker_name");
        $termPlan->proposal_date = $request->input("proposal_date");
        $termPlan->end_date = $request->input("end_date");
        $termPlan->premium_payment_mode = $request->input("premium_payment_mode");
        $termPlan->sum_insured = $request->input("sum_insured");
        $termPlan->save();
       
        return $this->sendResponse(['TermPlan'=> new TermPlanResource($termPlan)], "Term Plan updated successfully");
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