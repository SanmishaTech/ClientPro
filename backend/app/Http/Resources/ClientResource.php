<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
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
            'height' => $this->height,
            'weight' => $this->weight,
            'existing_ped' => $this->existing_ped,
            'residential_address' => $this->residential_address,
            'residential_address_pincode' => $this->residential_address_pincode,
            'office_address' => $this->office_address,
            'office_address_pincode' => $this->office_address_pincode,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'Family_members' => $this->familyMembers,
            // 'Family_members' => $this->familyMembers->map(function ($familyMember) {
            //     return [
            //         'id'                => $familyMember->id,
            //         'client_id'         => $familyMember->client_id,
            //         'family_member_id'         => $familyMember->family_member_id,
            //         'company_name'      => $familyMember->company_name,
            //         'broker_name'       => $familyMember->broker_name,
            //         'proposal_date'     => $familyMember->proposal_date,
            //         'end_date'     => $familyMember->end_date,
            //         'premium_payment_mode' => $familyMember->premium_payment_mode,
            //         'sum_insured'       => $familyMember->sum_insured,
            //         'created_at'        => $familyMember->created_at,
            //         'updated_at'        => $familyMember->updated_at,
            //         'mediclaim_insurances' => $familyMember->mediclaimInsurances, // Include the mediclaimInsurances
            //     ];
            // }),
        ];
    }
}