<?php

namespace App\Models;

use App\Models\Client;
use App\Models\FamilyMember;
use Illuminate\Database\Eloquent\Model;

class GeneralInsurance extends Model
{

    protected $fillable = [
        'id',
        'client_id',
        'family_member_id',
        'insurance_type',
        'company_name',
        'premium',
        'start_date',
        'end_date',
    ];
    
    public function client(){
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function familyMember(){
        return $this->belongsTo(FamilyMember::class, 'family_member_id');
    }
}