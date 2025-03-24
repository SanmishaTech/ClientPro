<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FamilyMemberResource extends JsonResource
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
            'family_member_name' => $this->family_member_name,
            'member_email' => $this->member_email,
            'member_mobile' => $this->member_mobile,
            'member_height' => $this->member_height,
            'member_weight' => $this->member_weight,
            'member_existing_ped' => $this->member_existing_ped,
            'relation' => $this->relation,
            'family_member_dob' => $this->family_member_dob,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'member_documents' => $this->memberDocuments,
        ];
    }
}