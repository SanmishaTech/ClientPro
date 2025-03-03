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
        return [
            'demat_account_data' => 'required|array',
            "demat_account_data.*.account_number" => 'required|string|unique:demat_accounts,account_number',
            // "account_number" => ['required', 'unique:demat_accounts,account_number'],
        ];
    }

    public function messages(): array
    {
        return [
            'demat_account_data.*.account_number.unique' => 'The account number has already been taken.',
            // You can add other custom messages for different rules if necessary
        ];
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