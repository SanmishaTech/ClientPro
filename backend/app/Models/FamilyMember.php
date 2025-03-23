<?php

namespace App\Models;

use App\Models\LIC;
use App\Models\Loan;
use App\Models\TermPlan;
use App\Models\MutualFund;
use App\Models\DematAccount;
use App\Models\MemberDocument;
use App\Models\GeneralInsurance;
use App\Models\MediclaimInsurance;
use Illuminate\Database\Eloquent\Model;

class FamilyMember extends Model
{
    protected $fillable = [
        'member_id',
        'client_id',
        'family_member_name',
        'member_email',
        'member_mobile',
        'member_height',
        'member_weight',
        'member_existing_ped',
        'relation',
        'family_member_dob',
    ];
    

     public function memberDocuments(){
        return $this->hasMany(MemberDocument::class, 'family_member_id');
    }

    public function mediclaimInsurances(){
        return $this->hasMany(MediclaimInsurance::class, 'family_member_id');
    }

    public function dematAccounts(){
        return $this->hasMany(DematAccount::class, 'family_member_id');
    }

    public function generalInsurances(){
        return $this->hasMany(GeneralInsurance::class, 'family_member_id');
    }
    
    public function lics(){
        return $this->hasMany(LIC::class, 'family_member_id');
    }

    public function mutualFunds(){
        return $this->hasMany(MutualFund::class, 'family_member_id');
    }

    public function termPlans(){
        return $this->hasMany(TermPlan::class, 'family_member_id');
    }

    public function loans(){
        return $this->hasMany(Loan::class, 'family_member_id');
    }
}