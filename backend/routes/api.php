<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LICsController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\LoansController;
use App\Http\Controllers\Api\RolesController;
use App\Http\Controllers\Api\DevtasController;
use App\Http\Controllers\Api\ClientsController;
use App\Http\Controllers\Api\GurujisController;
use App\Http\Controllers\Api\ReportsController;
use App\Http\Controllers\Api\ProfilesController;
use App\Http\Controllers\Api\ReceiptsController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\TermPlansController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\MutualFundController;
use App\Http\Controllers\Api\PoojaDatesController;
use App\Http\Controllers\Api\PoojaTypesController;
use App\Http\Controllers\Api\PermissionsController;
use App\Http\Controllers\Api\DematAccountController;
use App\Http\Controllers\Api\ReceiptHeadsController;
use App\Http\Controllers\Api\ReceiptTypesController;
use App\Http\Controllers\Api\DenominationsController;
use App\Http\Controllers\Api\AnteshteeAmountsController;
use App\Http\Controllers\Api\GeneralInsurancesController;
use App\Http\Controllers\Api\MediclaimInsurancesController;



Route::post('/login', [UserController::class, 'login']);

Route::group(['middleware'=>['auth:sanctum', 'permission']], function(){
  
   Route::resource('clients', ClientsController::class);  
   Route::resource('mediclaim_insurances', MediclaimInsurancesController::class);  
   Route::resource('mutual_funds', MutualFundController::class);  
   Route::resource('demat_accounts', DematAccountController::class);  
   Route::resource('general_insurances', GeneralInsurancesController::class);  
   Route::resource('term_plans', TermPlansController::class);  
   Route::resource('loans', LoansController::class);  
   Route::resource('lics', LICsController::class);  
   Route::get('/all_clients', [ClientsController::class, 'allClients'])->name("clients.all");
   Route::resource('profiles', ProfilesController::class);  
   Route::get('/logout', [UserController::class, 'logout'])->name('user.logout');
   Route::get('/roles', [RolesController::class, 'index'])->name("roles.index");
   Route::get('/permissions', [PermissionsController::class, 'index'])->name("permissions.index");
   Route::get('/generate_permissions', [PermissionsController::class, 'generatePermissions'])->name("permissions.generate");
   Route::get('/roles/{id}', [RolesController::class, 'show'])->name("roles.show");
   Route::put('/roles/{id}', [RolesController::class, 'update'])->name("roles.update");
   Route::get('/dashboards', [DashboardController::class, 'index'])->name("dashboards.index");
});