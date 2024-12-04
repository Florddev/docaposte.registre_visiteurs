<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Visitor extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'lastname',
        'firstname',
        'email',
        'phone',
        'employee_number',
        'data_understanding',
        'data_retention',
    ];
}
