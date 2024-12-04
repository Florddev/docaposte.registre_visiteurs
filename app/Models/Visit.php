<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Visit extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'visitor_id',
        'motif_id',
        'visit_recipient',
        'company',
        'date_entree',
        'date_sortie',
        'identifiant_sortie'
    ];
}
