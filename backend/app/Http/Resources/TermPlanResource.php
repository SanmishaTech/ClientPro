<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TermPlanResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'client_id'         => $this->client_id,
            'client_name'         => $this->client ? $this->client->client_name : "",
            'family_member_id'         => $this->family_member_id,
            'family_members'         =>  $this->familyMember ? $this->familyMember->family_member_name : "",
            'term_company_name'      => $this->term_company_name,
            'broker_name'       => $this->broker_name,
            'policy_number'      => $this->policy_number,
            'plan_name'      => $this->plan_name,
            'premium_without_gst'      => $this->premium_without_gst,
            'proposal_date'     => $this->proposal_date,
            'end_date'     => $this->end_date,
            'premium_payment_mode' => $this->premium_payment_mode,
            'sum_insured'       => $this->sum_insured,
            'cancelled'       => $this->cancelled,
            'cancelled_by'       => $this->cancelled_by,
            'created_at'        => $this->created_at,
            'updated_at'        => $this->updated_at,
        ];
    }
}