<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\ProfileResource;
use App\Http\Requests\StoreProfileRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Controllers\Api\BaseController;

class ProfilesController extends BaseController
{
    /**
     * Display All Profiles.
     */
    // public function index(Request $request): JsonResponse
    // {
    //     $query = Profile::query();
    //      $status = null;
    //     if ($request->query('search')) {
    //         $searchTerm = $request->query('search');
    
    //         $query->where(function ($query) use ($searchTerm, $status) {
    //             $query->where('profile_name', 'like', '%' . $searchTerm . '%')
    //             ->orWhere('email', 'like', '%' . $searchTerm . '%')
    //             ->orWhere('mobile', 'like', '%' . $searchTerm . '%')
    //             ->orWhereHas('user', function ($query) use ($searchTerm, $status) {
    //                 if($searchTerm == 'active' || $searchTerm == 'Active'){
    //                     $status = 1;
    //                 }
    //                 else if($searchTerm == 'Inactive' || $searchTerm == 'inactive'){
    //                     $status = 0;
    //                 }
    //                 if($status == 1){
    //                     $query->where('active', 'like', '%' . $status . '%');

    //                 }else if($status == 0){
    //                     $query->where('active', 'like', '%' . $status . '%');
    //                 }
    //             });
    //         });
    //     }
    //     $profiles = $query->Orderby("id","desc")->paginate(20);

    //     return $this->sendResponse(["Profiles"=>ProfileResource::collection($profiles),
    //     'pagination' => [
    //         'current_page' => $profiles->currentPage(),
    //         'last_page' => $profiles->lastPage(),
    //         'per_page' => $profiles->perPage(),
    //         'total' => $profiles->total(),
    //     ]], "Profiles retrieved successfully");
    // }
    public function index(Request $request): JsonResponse
{
    $query = Profile::query();
    $status = null;

    // Check if there's a search term
    if ($request->query('search')) {
        $searchTerm = $request->query('search');

        // Determine if the search term matches 'active' or 'inactive'
        if ($searchTerm == 'active' || $searchTerm == 'Active') {
            $status = 1; // Active status
        } elseif ($searchTerm == 'inactive' || $searchTerm == 'Inactive') {
            $status = 0; // Inactive status
        }

        // Apply filters to the query
        $query->where(function ($query) use ($searchTerm, $status) {
            $query->where('profile_name', 'like', '%' . $searchTerm . '%')
                ->orWhere('email', 'like', '%' . $searchTerm . '%')
                ->orWhere('mobile', 'like', '%' . $searchTerm . '%');

            // Apply 'active' filter only if the status is set
            if ($status !== null) {
                $query->orWhereHas('user', function ($query) use ($status) {
                    $query->where('active', '=', $status);
                });
            }

            $query->orWhereHas('user', function ($query) use ($searchTerm) {
                $query->whereHas('roles', function ($query) use ($searchTerm) {
                    $query->where('name', '=', $searchTerm); // Filter by the role name (e.g., 'admin' or 'member')
                });
            });
            
        });
    }

    // Apply pagination and ordering by profile ID
    $profiles = $query->orderBy("id", "desc")->paginate(20);

    return $this->sendResponse([
        "Profiles" => ProfileResource::collection($profiles),
        'pagination' => [
            'current_page' => $profiles->currentPage(),
            'last_page' => $profiles->lastPage(),
            'per_page' => $profiles->perPage(),
            'total' => $profiles->total(),
        ]
    ], "Profiles retrieved successfully");
}



    /**
     * Store Profile.
     * @bodyParam profile_name string The name of the Profile.
     * @bodyParam email string The name of the Profile.
     * @bodyParam active string The name of the Profile.
     * @bodyParam password string The name of the Profile.
     * @bodyParam role string The name of the Profile.
     * @bodyParam mobile string The name of the Profile.
     */
    public function store(StoreProfileRequest $request): JsonResponse
    {

        $mobile = $request->input("mobile");

        // Only query if the date is provided
        if ($mobile) {
            $mobile = Profile::where('mobile', $mobile)->first();
            
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
        
        $user = new User();
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        $user->active = $request->input('active');
        $user->password = Hash::make($request->input('password'));
        $user->save();
        
        // $memberRole = $request->input("role");
        $memberRole = $request->input("role");
        $memberRole = Role::where("name",$memberRole)->first();
       
        $user->assignRole($memberRole);
        
        $profile = new Profile();
        $profile->user_id = $user->id;
        $profile->profile_name = $request->input('name');
        $profile->email = $request->input('email');
        $profile->mobile = $request->input('mobile');
        $profile->save();
       
        return $this->sendResponse(['User'=> new UserResource($user), 'Profile'=>new ProfileResource($profile)], "Profile stored successfully");
    }

    /**
     * Show Profile.
     */
    public function show(string $id): JsonResponse
    {
        $profile = Profile::find($id);

        if(!$profile){
            return $this->sendError("Profile not found", ['error'=>'Profile not found']);
        }
        $user = User::find($profile->user_id);
        return $this->sendResponse(['User'=> new UserResource($user), 'Profile'=>new ProfileResource($profile)], "Profile retrived successfully");
    }

    /**
     * Update Profile.
     * @bodyParam profile_name string The name of the Profile.
     * @bodyParam email string The name of the Profile.
     * @bodyParam active string The name of the Profile.
     * @bodyParam password string The name of the Profile.
     * @bodyParam role string The name of the Profile.
     * @bodyParam mobile string The name of the Profile.
     */
    public function update(UpdateProfileRequest $request, string $id): JsonResponse
    {
        $profile = Profile::find($id);

        if(!$profile){
            return $this->sendError("Profile not found", ['error'=>'Profile not found']);
        }
        $mobile = $request->input("mobile");

    // Only query if the mobile number is provided
    if ($mobile) {
        // Exclude current profile ID from the query
        $existingMobile = Profile::where('mobile', $mobile)
                                 ->where('id', '!=', $profile->id) // Exclude current profile
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
      

        $user = User::find($profile->user_id);
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        $user->active = $request->input('active');
        if($request->input('password'))
       {
        $user->password = Hash::make($request->input('password'));
       }
        $user->save();

        $memberRole = $request->input("role");
        // $memberRole = Role::where("name",$memberRole)->first();
        // $user->assignRole($memberRole);
         if ($memberRole) {
        // Remove existing roles before assigning a new one
        $user->syncRoles(); // This removes all roles and assigns the new one

        // Assign new role
        $user->assignRole($memberRole);
    }
        

        $profile->profile_name = $request->input('name');
        $profile->email = $request->input('email');
        $profile->mobile = $request->input('mobile');
        $profile->save();
       
        return $this->sendResponse(['User'=> new UserResource($user), 'Profile'=>new ProfileResource($profile)], "Profile updated successfully");

    }

    /**
     * Remove Employee.
     */
    public function destroy(string $id): JsonResponse
    {
        $profile = Profile::find($id);
        if(!$profile){
            return $this->sendError("profile not found", ['error'=> 'profile not found']);
        }
        $user = User::find($profile->user_id);
        $profile->delete();
        $user->delete();
        return $this->sendResponse([], "profile deleted successfully");
    }

}