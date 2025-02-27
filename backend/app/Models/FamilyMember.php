<?php

namespace App\Models;

use App\Models\MediclaimInsurance;
use Illuminate\Database\Eloquent\Model;

class FamilyMember extends Model
{
    public function mediclaimInsurances(){
        return $this->hasMany(MediclaimInsurance::class, 'family_member_id');
    }
}