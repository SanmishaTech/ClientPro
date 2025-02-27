<?php

namespace App\Http\Controllers\Api;

use App\Models\LIC;
use App\Models\Loan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\LICResource;
use App\Http\Controllers\Controller;
use App\Http\Resources\LoanResource;
use App\Http\Controllers\Api\BaseController;

class LoansController extends BaseController
{
    /**
     * All Loan.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Loan::with('client');
        if ($request->query('search')) {
            $searchTerm = $request->query('search');
    
            $query->whereHas("client",function ($query) use ($searchTerm) {
                    $query->where('client_name','like', '%' . $searchTerm . '%');
                });
        }
        $loans = $query->Orderby('id', 'desc')->paginate(20);

        return $this->sendResponse(["Loans"=>LoanResource::collection($loans),
        'pagination' => [
            'current_page' => $loans->currentPage(),
            'last_page' => $loans->lastPage(),
            'per_page' => $loans->perPage(),
            'total' => $loans->total(),
        ]], "Loans details retrieved successfully");
    }

    /**
     * Store Loan.
     */
    public function store(Request $request): JsonResponse
    {
        $loan = new Loan();
        $loan->client_id = $request->input("client_id");
        $loan->home = $request->input("home");
        $loan->personal = $request->input("personal");
        $loan->business = $request->input("business");
        $loan->car = $request->input("car");
        $loan->save();
     
        return $this->sendResponse(['Loan'=> new LoanResource($loan)], 'Loan Created Successfully');
    }

   

    /**
     * Show Loan.
     */
    public function show(string $id): JsonResponse
    {
        $loan = Loan::find($id);

        if(!$loan){
            return $this->sendError("Loan Details not found", ['error'=>'Loan Details not found']);
        }
        return $this->sendResponse(['Loan'=> new LoanResource($loan)], "Loan details retrieved successfully");
    }

    /**
     * Update Loan.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $loan = Loan::find($id);
        if(!$loan){
            return $this->sendError("Loan details not found", ['error'=>'Loan details not found']);
        }
        
        $loan->client_id = $request->input("client_id");
        $loan->home = $request->input("home");
        $loan->personal = $request->input("personal");
        $loan->business = $request->input("business");
        $loan->car = $request->input("car");
        $loan->save();
       
        return $this->sendResponse(['Loan'=> new LoanResource($loan)], "Loan details updated successfully");
    }

    /**
     * Remove Loan.
     */
    public function destroy(string $id): JsonResponse
    {
        $loan = Loan::find($id);
        if(!$loan){
            return $this->sendError("Loan details not found", ['error'=>'Loan details not found']);
        }
        
        $loan->delete();
        return $this->sendResponse([], "Loan details deleted successfully");
    }
}