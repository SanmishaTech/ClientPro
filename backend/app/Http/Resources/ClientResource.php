<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\FamilyMemberResource;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
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
            'client_name' => $this->client_name,
            'email' => $this->email,
            'date_of_birth' => $this->date_of_birth,
            'mobile' => $this->mobile,
            'mobile_2' => $this->mobile_2,
            'height' => $this->height,
            'weight' => $this->weight,
            'existing_ped' => $this->existing_ped,
            'residential_address' => $this->residential_address,
            'residential_address_pincode' => $this->residential_address_pincode,
            'office_address' => $this->office_address,
            'office_address_pincode' => $this->office_address_pincode,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'Family_members' => FamilyMemberResource::collection($this->familyMembers),
            'client_documents' => $this->clientDocuments ? $this->clientDocuments : null, // If there's a relationship with Devta model

           
        ];
    }
}