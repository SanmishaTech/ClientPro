<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreDematAccountRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'have_demat_account' => 'required|in:0,1', // 'No' or 'Yes'
        ];

        // If 'have_demat_account' is 'Yes' (1), these fields become required
        if ($this->input('have_demat_account') == '1') {
            $rules['account_number'] = 'required|regex:/^[A-Za-z0-9\s]+$/|min:16|max:16|unique:demat_accounts,account_number';
            $rules['service_provider'] = 'required|string|max:100|regex:/^[A-Za-z\s]+$/';
        }

        return $rules;
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422)
        );
    }    
}