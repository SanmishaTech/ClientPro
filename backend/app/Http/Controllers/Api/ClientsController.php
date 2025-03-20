<?php

namespace App\Http\Controllers\Api;

use App\Models\Devta;
use App\Models\Client;
use App\Models\FamilyMember;
use Illuminate\Http\Request;
use App\Models\ClientDocument;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\DevtaResource;
use App\Http\Resources\ClientResource;
use App\Http\Requests\StoreClientRequest;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\UpdateClientRequest;
use App\Http\Controllers\Api\BaseController;
use Illuminate\Validation\ValidationException;

class ClientsController extends BaseController
{

    private function validateFamilyMember($familyMember)
    {
        $validator = Validator::make($familyMember, [
            'name' => 'required|string|max:255',
            'relation' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }
    
    /**
     * All Clients.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Client::query();

        if ($request->query('search')) {
            $searchTerm = $request->query('search');
    
            $query->where(function ($query) use ($searchTerm) {
                $query->where('client_name', 'like', '%' . $searchTerm . '%')
                ->orWhere('email', 'like', '%' . $searchTerm . '%')
                ->orWhere('mobile', 'like', '%' . $searchTerm . '%')
                ->orWhereHas('familyMembers', function($query) use($searchTerm){
                    $query->where('family_member_name','like', '%' . $searchTerm . '%');
                });
            });
        }
        $clients = $query->Orderby('id', 'desc')->paginate(20);

        return $this->sendResponse(["Clients"=>ClientResource::collection($clients),
        'pagination' => [
            'current_page' => $clients->currentPage(),
            'last_page' => $clients->lastPage(),
            'per_page' => $clients->perPage(),
            'total' => $clients->total(),
        ]], "Clients retrieved successfully");
    }

    /**
     * Store Devta.
     */
    public function store(StoreClientRequest $request): JsonResponse
    {

        $mobile = $request->input("mobile");
        $mobile_2 = $request->input("mobile_2");

        // Only query if the date is provided
        if ($mobile) {
            $mobile = Client::where('mobile', $mobile)->first();
            
            // Check if the date exists in the database
            if ($mobile) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation failed',
                    'errors' => [
                        'mobile' => ['mobile number has already been taken.']
                    ],
                ], 422);
            }
        }

        if ($mobile_2) {
            $mobile_2 = Client::where('mobile', $mobile_2)->first();
            
            // Check if the date exists in the database
            if ($mobile_2) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation failed',
                    'errors' => [
                        'mobile_2' => ['mobile number has already been taken.']
                    ],
                ], 422);
            }
        }
        
        $client = new Client();
        $client->client_name = $request->input("client_name");
        $client->date_of_birth = $request->input("date_of_birth");
        $client->email = $request->input("email");
        $client->mobile = $request->input("mobile");
        $client->mobile_2 = $request->input("mobile_2");
        $client->height = $request->input("height");
        $client->weight = $request->input("weight");
        $client->existing_ped = $request->input("existing_ped");
        $client->office_address = $request->input("office_address");
        $client->office_address_pincode = $request->input("office_address_pincode");
        $client->residential_address = $request->input("residential_address");
        $client->residential_address_pincode = $request->input("residential_address_pincode");

        if(!$client->save()) {
            dd($client); exit;
        }
        
      if($request->input('family_members')){
         $familyMembers = $request->input('family_members');
          foreach($familyMembers as $familyMember){
            $this->validateFamilyMember($familyMember); // Custom validation method

            $member = new FamilyMember();
            $member->client_id = $client->id;
            $member->family_member_name = $familyMember['name'];
            $member->member_email = $familyMember['member_email'];
            $member->member_mobile = $familyMember['member_mobile'];
            $member->member_height = $familyMember['member_height'];
            $member->member_weight = $familyMember['member_weight'];
            $member->member_existing_ped = $familyMember['member_existing_ped'];
            $member->relation = $familyMember['relation'];
            $member->family_member_dob = $familyMember['date_of_birth'];
            $member->save();
          }
     }
        return $this->sendResponse(['Client'=> new ClientResource($client)], 'Client Created Successfully');
   
    }

   

    /**
     * Show Devta.
     */
    public function show(string $id): JsonResponse
    {
        $client = Client::find($id);

        if(!$client){
            return $this->sendError("Client not found", ['error'=>'Client not found']);
        }
        return $this->sendResponse(['Client'=> new ClientResource($client)], "Client retrieved successfully");
    }

    /**
     * Update Devta.
     */
    public function update(UpdateClientRequest $request, string $id): JsonResponse
    {
        $client = Client::find($id);
        if(!$client){
            return $this->sendError("Client not found", ['error'=>['Client not found']]);
        }
        
        $mobile = $request->input("mobile");
        $mobile_2 = $request->input("mobile_2");

        // Only query if the mobile number is provided
        if ($mobile) {
            // Exclude current profile ID from the query
            $existingMobile = client::where('mobile', $mobile)
                                     ->where('id', '!=', $client->id) // Exclude current profile
                                     ->first();
    
            // Check if mobile number is already taken
            if ($existingMobile) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation failed',
                    'errors' => [
                        'mobile' => ['Mobile number has already been taken.']
                    ],
                ], 422);
            }
        }

        if ($mobile_2) {
            // Exclude current profile ID from the query
            $existingMobile = client::where('mobile', $mobile_2)
                                     ->where('id', '!=', $client->id) // Exclude current profile
                                     ->first();
    
            // Check if mobile number is already taken
            if ($existingMobile) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation failed',
                    'errors' => [
                        'mobile_2' => ['Mobile number has already been taken.']
                    ],
                ], 422);
            }
        }
        
        $client->client_name = $request->input('client_name');
        $client->date_of_birth = $request->input("date_of_birth");
        $client->email = $request->input("email");
        $client->mobile = $request->input("mobile");
        $client->mobile_2 = $request->input("mobile_2");
        $client->height = $request->input("height");
        $client->weight = $request->input("weight");
        $client->existing_ped = $request->input("existing_ped");
        $client->office_address = $request->input("office_address");
        $client->office_address_pincode = $request->input("office_address_pincode");
        $client->residential_address = $request->input("residential_address");
        $client->residential_address_pincode = $request->input("residential_address_pincode");
        $client->save();

        // $removeFamilyMembers = FamilyMember::where('client_id',$client->id)->get();
        // $removeFamilyMembers->each(function($familyMember) {
        //     $familyMember->delete();
        // });

        if($request->input('family_members')){
            $familyMembers = $request->input('family_members');
             foreach($familyMembers as $familyMember){
               $this->validateFamilyMember($familyMember); // Custom validation method
          
            $member = FamilyMember::updateOrCreate(
                ['id' => $familyMember['member_id'], 'client_id' => $client->id], // Condition to check existing member
                [
                    'family_member_name' => $familyMember['name'],
                    'member_email' => $familyMember['member_email'],
                    'member_mobile' => $familyMember['member_mobile'],
                    'member_height' => $familyMember['member_height'],
                    'member_weight' => $familyMember['member_weight'],
                    'member_existing_ped' => $familyMember['member_existing_ped'],
                    'relation' => $familyMember['relation'],
                    'family_member_dob' => $familyMember['date_of_birth'],
                ]
            );
             }
        }
        return $this->sendResponse(["Client"=> new ClientResource($client)], "Client Updated successfully");
    }
    
    /**
     * Remove Devta.
     */
    // public function destroy(string $id): JsonResponse
    // {
    //     $client = Client::find($id);
        
    //     if(!$client){
    //         return $this->sendError("Client not found", ['error'=>'Client not found']);
    //     }
        
    //     $removeFamilyMembers = FamilyMember::where('client_id',$client->id)->get();
    //     $removeFamilyMembers->each(function($familyMember) {
    //         $familyMember->delete();
    //     });
        
    //     $client->delete();
    //     return $this->sendResponse([], "Client deleted successfully");
    // }
    public function destroy(string $id): JsonResponse
    {
        // Find the client by ID
        $client = Client::find($id);
        
        if (!$client) {
            return $this->sendError("Client not found", ['error' => 'Client not found']);
        }
        
        $associatedRecords = [
            'mediclaimInsurances' => $client->mediclaimInsurances()->exists(),
            'lics' => $client->lics()->exists(),
            'loans' => $client->loans()->exists(),
            'generalInsurances' => $client->generalInsurances()->exists(),
            'dematAccounts' => $client->dematAccounts()->exists(),
            'mutualFunds' => $client->mutualFunds()->exists(),
            'termPlans' => $client->termPlans()->exists(),
        ];

        $tableNames = [
            'mediclaimInsurances' => 'Mediclaim Insurance',
            'lics' => 'LIC',
            'loans' => 'Loan',
            'generalInsurances' => 'General Insurance',
            'dematAccounts' => 'Demat Account',
            'mutualFunds' => 'Mutual Fund',
            'termPlans' => 'Term Plan',
        ];

        foreach ($client->familyMembers as $familyMember) {
            $associatedRecords['mediclaimInsurances'] |= $familyMember->mediclaimInsurances()->exists();
            $associatedRecords['lics'] |= $familyMember->lics()->exists();
            $associatedRecords['generalInsurances'] |= $familyMember->generalInsurances()->exists();
            $associatedRecords['dematAccounts'] |= $familyMember->dematAccounts()->exists();
            $associatedRecords['mutualFunds'] |= $familyMember->mutualFunds()->exists();
            $associatedRecords['termPlans'] |= $familyMember->termPlans()->exists();
        }

        foreach ($associatedRecords as $table => $exists) {
            if ($exists) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation failed',
                    'errors' => [
                        'categories_exists' => ["Client or family member has associated records in the {$tableNames[$table]} Category. Deletion is not allowed."]
                    ],
                ], 422);
                // return $this->sendError("categories_exists", [
                //     'error' => "Client or family member has associated records in the {$table} table. Deletion is not allowed."
                // ]);
            }
        }

        // Remove family members first
        $removeFamilyMembers = FamilyMember::where('client_id', $client->id)->get();
        $removeFamilyMembers->each(function ($familyMember) {
            $familyMember->delete();
        });

        // Now delete the client
        $client->delete();
        
        return $this->sendResponse([], "Client deleted successfully");
    }


    /**
     * Fetch All Clients.
     */
    public function allClients(): JsonResponse
    {
        $client = Client::all();

        return $this->sendResponse(["Clients"=>ClientResource::collection($client),
        ], "Clients retrieved successfully");
    }


    // public function deleteFamilyMember(string $id): JsonResponse
    // {
    //     $fam = FamilyMember::find($id);
    //     if(!$fam){
    //         return $this->sendError("Demat Accounts details not found", ['error'=>'Demat Accounts details not found']);
    //     }
        
    //     $fam->delete();
    //     return $this->sendResponse([], "fam details deleted successfully");
    // }
    public function deleteFamilyMember(string $id): JsonResponse
{
    // Find the family member by ID
    $familyMember = FamilyMember::find($id);

    if (!$familyMember) {
        return $this->sendError("Family Member not found", ['error' => 'Family Member not found']);
    }

    // Check for any associated records related to the family member
    $associatedRecords = [
        'mediclaimInsurances' => $familyMember->mediclaimInsurances()->exists(),
        'lics' => $familyMember->lics()->exists(),
        'loans' => $familyMember->loans()->exists(),
        'generalInsurances' => $familyMember->generalInsurances()->exists(),
        'dematAccounts' => $familyMember->dematAccounts()->exists(),
        'mutualFunds' => $familyMember->mutualFunds()->exists(),
        'termPlans' => $familyMember->termPlans()->exists(),
    ];

    $tableNames = [
        'mediclaimInsurances' => 'Mediclaim Insurance',
        'lics' => 'LIC',
        'loans' => 'Loan',
        'generalInsurances' => 'General Insurance',
        'dematAccounts' => 'Demat Account',
        'mutualFunds' => 'Mutual Fund',
        'termPlans' => 'Term Plan',
    ];

    // Loop through and check if any associated record exists
    foreach ($associatedRecords as $table => $exists) {
        if ($exists) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => [
                    'categories_exists' => ["Family member has associated records in the {$tableNames[$table]} Category. Deletion is not allowed."]
                ],
            ], 422);
        }
    }

    // If no associated records, proceed with deletion
    $familyMember->delete();
    
    return $this->sendResponse([], "Family member deleted successfully");
}


// public function getClientImages(String $id, Request $request)
// {
//     // Find the client by ID
//     $client = Client::find($id);
     
//     if($request->file('temp')){
//         \Log::debug('workibng', $request->file("temp"));
//     }
//     \Log::file("not working");

//     if (!$client) {
//         return $this->sendError("Client not found", ['error' => 'Client not found']);
//     }

//     // Get client documents from the request
//     $clientDocuments = $request->input("client_documents");

//     // Log the incoming request to check the structure
//     \Log::debug($request->all());  // Log all incoming data
//     \Log::debug($request->file()); // Log all uploaded files

//     $fileCount = count($clientDocuments); // To loop through client_documents array

//     // Iterate over each document and handle the file upload
//     for ($i = 0; $i < $fileCount; $i++) {
//         // Get the client name
//         $clientName = $clientDocuments[$i]; // This is the client_name
//         $clientFile = $request->file("client_documents.$i.client_file"); // Access the file by index

//         // Log the file to see if it's being correctly accessed
//         \Log::debug("Processing document $i with client name: $clientName");

//         // Check if the file exists and is valid
//         if ($clientFile && $clientFile->isValid()) {
//             // Access the file and get the original file name
//             $documentNameWithExtension = $clientFile->getClientOriginalName();
//             $documentName = pathinfo($documentNameWithExtension, PATHINFO_FILENAME);
//             $documentExtension = $clientFile->getClientOriginalExtension();
//             $documentNameToStore = $documentName . '_' . time() . '.' . $documentExtension;

//             // Store the file in the 'public/ClientDocuments' directory
//             $documentPath = $clientFile->storeAs('public/ClientDocuments', $documentNameToStore);

//             // Create and save the document information
//             $clientDocumentModel = new ClientDocument();
//             $clientDocumentModel->client_id = $client->id;
//             $clientDocumentModel->document_name = $clientName; // Assuming you pass the document name in the client_documents array
//             $clientDocumentModel->document = $documentNameToStore;
//             $clientDocumentModel->save();
//         } else {
//             // If file is missing or invalid, handle this case
//             \Log::error("File is invalid or missing for document at index $i");
//             return $this->sendError("File missing or invalid for document at index $i", ['error' => 'File missing or invalid']);
//         }
//     }

//     return $this->sendResponse([], "Images sent successfully");
// }


// public function getClientImages(String $id, Request $request)
// {
//     // Find the client by ID
//     $client = Client::find($id);

//     // Check if the file is present in the request
//     if ($request->file('temp')) {
//         // Log file properties (name, size, etc.)
//         \Log::debug('File properties: ', [
//             'name' => $request->file('temp')->getClientOriginalName(),
//             'size' => $request->file('temp')->getSize(),
//             'mime' => $request->file('temp')->getMimeType(),
//         ]);
//     } else {
//         // If the file is not found, log this
//         \Log::debug('No file found in request for "temp".');
//     }

//     // Proceed with further processing if needed
//     if (!$client) {
//         return $this->sendError("Client not found", ['error' => 'Client not found']);
//     }

//     return $this->sendResponse([], "Images sent successfully");
// }


public function getClientImages(String $id, Request $request)
{
    // Find the client by ID
    $client = Client::find($id);

    if (!$client) {
        return $this->sendError("Client not found", ['error' => 'Client not found']);
    }

    // Get the client_documents from the request
    $clientDocuments = $request->input('client_documents');

    // Log the received structure to inspect it
    \Log::info('Client Documents Structure:', ['client_documents' => $clientDocuments]);

    // Process each document
    foreach ($clientDocuments as $index => $clientDocument) {
        // Log each document name
        \Log::debug("Processing document $index with client name: " . $clientDocument['client_name']);

        // Access the client name
        $clientName = $clientDocument['client_name'];

        // Access the file for the current document
        $clientFile = $request->file("client_documents.$index.client_file");

        // Check if the file exists and is valid
        if ($clientFile && $clientFile->isValid()) {
            // File is valid, handle it here (e.g., save the file)
            $documentNameWithExtension = $clientFile->getClientOriginalName();
            $documentName = pathinfo($documentNameWithExtension, PATHINFO_FILENAME);
            $documentExtension = $clientFile->getClientOriginalExtension();
            $documentNameToStore = $documentName . '_' . time() . '.' . $documentExtension;
            $documentPath = $clientFile->storeAs('public/ClientDocuments', $documentNameToStore);

            // Save document information to the database
            $clientDocumentModel = new ClientDocument();
            $clientDocumentModel->client_id = $client->id;
            $clientDocumentModel->document_name = $clientName; // Client name
            $clientDocumentModel->document = $documentNameToStore; // Stored document name
            $clientDocumentModel->save();
        } else {
            // Handle invalid or missing file scenario
            \Log::error("File is missing or invalid for document at index $index");
        }
    }

    return $this->sendResponse([], "Images sent successfully");
}





}