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
            'home' => $this->home,
            'personal' => $this->personal,
            'business' => $this->business,
            'car' => $this->car,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}