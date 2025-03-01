<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoanResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'client_id' => $this->client_id,
            'client_name'         => $this->client ? $this->client->client_name : "",
            'family_member_id'         => $this->family_member_id,
            'family_member_name'         => $this->familyMember ? $this->familyMember->family_member_name : "",
            'bank_name' => $this->bank_name,
            'loan_type' => $this->loan_type,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'loan_amount' => $this->loan_amount,
            'term' => $this->term,
            'emi' => $this->emi,
            'roi' => $this->roi,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}