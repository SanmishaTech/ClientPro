<?php

namespace App\Models;

use App\Models\LIC;
use App\Models\Loan;
use App\Models\TermPlan;
use App\Models\MutualFund;
use App\Models\DematAccount;
use App\Models\FamilyMember;
use App\Models\ClientDocument;
use App\Models\GeneralInsurance;
use App\Models\MediclaimInsurance;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    public function familyMembers(){
        return $this->hasMany(FamilyMember::class, 'client_id');
    }

     public function clientDocuments(){
        return $this->hasMany(ClientDocument::class, 'client_id');
    }

    public function mediclaimInsurances(){
        return $this->hasMany(MediclaimInsurance::class, 'client_id');
    }

    public function dematAccounts(){
        return $this->hasMany(DematAccount::class, 'client_id');
    }

    public function generalInsurances(){
        return $this->hasMany(GeneralInsurance::class, 'client_id');
    }
    
    public function lics(){
        return $this->hasMany(LIC::class, 'client_id');
    }

    public function mutualFunds(){
        return $this->hasMany(MutualFund::class, 'client_id');
    }

    public function termPlans(){
        return $this->hasMany(TermPlan::class, 'client_id');
    }

    public function loans(){
        return $this->hasMany(Loan::class, 'client_id');
    }

}