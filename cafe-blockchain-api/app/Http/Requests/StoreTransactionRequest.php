<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'type' => 'required|string|in:thu,chi',
            'amount' => 'required|numeric|min:0.01',
            'category' => 'required|string|max:100',
            'payment_method' => 'nullable|string|in:cash,bank_transfer',
            'description' => 'nullable|string|max:500',
            'transaction_date' => 'required|date',
        ];
    }
}
