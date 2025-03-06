<?php

namespace App\Models;

use App\Models\Client;
use Illuminate\Database\Eloquent\Model;

class MutualFund extends Model
{

    protected $fillable = [
        'id',
        'client_id',
        'family_member_id',
        'mutual_fund_name',
        'account_number',
        'reference_name',
        'service_provider',
        'start_date',
    ];
    
    
    public function client(){
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function familyMember(){
        return $this->belongsTo(FamilyMember::class, 'family_member_id');
    }
}