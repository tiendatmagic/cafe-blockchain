<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CloseShiftRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'actual_cash' => 'required|numeric|min:0',
            'note' => 'nullable|string|max:1000',
        ];
    }
}
