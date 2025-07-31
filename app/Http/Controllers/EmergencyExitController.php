<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\Visit;
use App\Models\Visitor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class EmergencyExitController extends Controller
{
    public function authenticate(Request $request)
    {
        $request->validate([
            'password' => 'required|string'
        ]);

        $adminPassword = Setting::get('admin_emergency_password');

        if (!Hash::check($request->password, $adminPassword)) {
            return response()->json([
                'success' => false,
                'message' => 'Mot de passe incorrect'
            ], 401);
        }

        // Récupérer les visites en cours (sans date de sortie)
        $activeVisits = Visit::with(['visitor', 'purpose'])
            ->whereNull('date_sortie')
            ->whereNotNull('date_entree')
            ->orderBy('date_entree', 'desc')
            ->get()
            ->map(function ($visit) {
                return [
                    'id' => $visit->id,
                    'visitor_name' => $visit->visitor ? $visit->visitor->lastname . ' ' . $visit->visitor->firstname : 'Anonyme',
                    'visitor_company' => $visit->company ?? 'Docaposte',
                    'purpose' => $visit->purpose ? $visit->purpose->nom : null,
                    'entry_time' => $visit->date_entree ? Carbon::parse($visit->date_entree)->format('d/m/Y H:i') : null,
                    'exit_code' => $visit->identifiant_sortie ?? $visit->visitor->employee_number,
                ];
            });

        return response()->json([
            'success' => true,
            'visits' => $activeVisits
        ]);
    }

    public function forceExit(Visit $visit)
    {
        if ($visit->date_sortie) {
            return response()->json([
                'success' => false,
                'message' => 'Cette visite est déjà terminée'
            ], 400);
        }

        $visit->update([
            'date_sortie' => Carbon::now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Sortie enregistrée avec succès'
        ]);
    }
}
