<?php

namespace App\Models;

use App\Models\Client;
use App\Models\FamilyMember;
use Illuminate\Database\Eloquent\Model;

class LIC extends Model
{
    protected $fillable = [
        'id',
        'client_id',
        'family_member_id',
        'broker_name',
        'company_name',
        'policy_number',
        'plan_name',
        'premium_without_gst',
        'commencement_date',
        'term',
        'ppt',
        'proposal_date',
        'end_date',
        'premium_payment_mode',
        'sum_insured',
    ];
    
    public function client(){
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function familyMember(){
        return $this->belongsTo(FamilyMember::class, 'family_member_id');
    }
}