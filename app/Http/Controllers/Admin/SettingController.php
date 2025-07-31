<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->keyBy('key');

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'data_retention_days' => 'required|integer|min:1|max:365',
            'process_visits_time' => 'required',
            'admin_emergency_password' => 'nullable|string|min:6'
        ]);

        Setting::set(
            'data_retention_days',
            $request->input('data_retention_days'),
            'integer',
            'Nombre de jours avant suppression automatique des données visiteurs'
        );

        Setting::set(
            'process_visits_time',
            $request->input('process_visits_time'),
            'string',
            'Heure quotidienne d\'exécution du traitement des visites (format HH:MM)'
        );

        // Mise à jour du mot de passe administrateur seulement s'il est fourni
        if ($request->filled('admin_emergency_password')) {
            Setting::set(
                'admin_emergency_password',
                Hash::make($request->input('admin_emergency_password')),
                'string',
                'Mot de passe administrateur pour l\'accès d\'urgence aux sorties'
            );
        }

        // Vider le cache des paramètres pour forcer le rechargement
        Cache::flush();

        return redirect()->back()->with('success', 'Paramètres mis à jour avec succès. Redémarrez le scheduler pour appliquer les changements d\'heure.');
    }
}
