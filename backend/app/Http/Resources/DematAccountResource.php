<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DematAccountResource extends JsonResource
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
            'family_members'         =>  $this->familyMember ? $this->familyMember->family_member_name : "",
            'start_date' => $this->start_date,
            'company_name' => $this->company_name,
            'plan_name' => $this->plan_name,
            'account_number' => $this->account_number,
            'service_provider' => $this->service_provider,
            'cancelled'       => $this->cancelled,
            'cancelled_by'       => $this->cancelled_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}