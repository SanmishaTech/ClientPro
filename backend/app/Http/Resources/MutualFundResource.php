<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MutualFundResource extends JsonResource
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
            'mutual_fund_name' => $this->mutual_fund_name,
            'start_date' => $this->start_date,
            'reference_name' => $this->reference_name,
            'account_number' => $this->account_number,
            'service_provider' => $this->service_provider,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}