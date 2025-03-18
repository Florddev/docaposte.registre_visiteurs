<?php

namespace App\Http\Controllers\Api;

use App\Models\Visit;
use App\Models\Visitor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\RouteAttributes\Attributes\Get;
use Spatie\RouteAttributes\Attributes\Group;
use Spatie\RouteAttributes\Attributes\Post;

#[Group(prefix: 'entry', as: 'entry.')]
class EntryApiController
{

    #[Get('/visitors/employee/{employee_number}', 'findByEmployeeNumber')]
    public function findByEmployeeNumber(int $employee_number)
    {
        $visitor = Visitor::where('employee_number', $employee_number)->where('data_retention', true)->first();
        return $visitor ? $visitor->toArray() : response()->json(null, 200);
    }

}
