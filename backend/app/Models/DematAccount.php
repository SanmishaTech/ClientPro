<?php

namespace App\Models;

use App\Models\Client;
use App\Models\FamilyMember;
use Illuminate\Database\Eloquent\Model;

class DematAccount extends Model
{

    protected $fillable = [
        'id',
        'client_id',
        'family_member_id',
        'account_number',
        'company_name',
        'service_provider',
        'start_date',
        'plan_name',
    ];
    
    public function client(){
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function familyMember(){
        return $this->belongsTo(FamilyMember::class, 'family_member_id');
    }
}