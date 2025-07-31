<?php

namespace App\Http\Controllers\Api;

use App\Models\Visit;
use App\Models\Visitor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EntryApiController
{

    public function findByEmployeeNumber(int $employee_number)
    {
        $visitor = Visitor::where('employee_number', $employee_number)->where('data_retention', true)->first();
        return $visitor ? $visitor->toArray() : response()->json(null, 200);
    }

}
