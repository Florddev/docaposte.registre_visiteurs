<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Purpose extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom'
    ];

    /**
     * Accesseur pour obtenir le nom du motif
     *
     * @return string
     */
    public function getNameAttribute(): string
    {
        return $this->nom;
    }

    /**
     * Relation avec les visites
     *
     * @return HasMany
     */
    public function visits(): HasMany
    {
        return $this->hasMany(Visit::class, 'motif_id');
    }
}
