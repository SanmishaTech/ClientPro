<?php

namespace App\Models;

use App\Models\FamilyMember;
use App\Models\MediclaimInsurance;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    public function familyMembers(){
        return $this->hasMany(FamilyMember::class, 'client_id');
    }

    public function mediclaimInsurances(){
        return $this->hasMany(MediclaimInsurance::class, 'client_id');
    }

}