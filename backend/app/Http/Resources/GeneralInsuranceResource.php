<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GeneralInsuranceResource extends JsonResource
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
            'vehicle' => $this->vehicle,
            'fire' => $this->fire,
            'society' => $this->society,
            'workman' => $this->workman,
            'personal_accident' => $this->personal_accident,
            'others' => $this->others,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}