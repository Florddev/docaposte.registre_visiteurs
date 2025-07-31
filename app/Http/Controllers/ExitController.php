<?php

namespace App\Http\Controllers;

use App\Models\Visit;
use App\Models\Visitor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExitController
{

    public function index()
    {
        return Inertia::render('Exit/Index');
    }

    public function success()
    {
        return Inertia::render('Exit/End');
    }

    public function submitVisit(Request $request)
    {
        $visits = Visit::join('visitors', 'visits.visitor_id', '=', 'visitors.id')
            ->where('visits.date_sortie', null)
            ->where(function ($query) use ($request) {
                $query->where('visits.identifiant_sortie', $request->exitCode)
                    ->orWhere('visitors.employee_number', $request->exitCode);
            })
            ->select('visits.*')
            ->with('visitor')
            ->get();

        if ($visits->count() > 1 && empty($request->lastname)) {
            return redirect()->back()->withErrors([
                'exitCode' => 'Plusieurs entrées ont été trouvées pour ce code, merci de contacter un administrateur.'
            ])->with('error', true);
        } else if ($visits->count() == 1) {
            $visit = $visits->first();
            $visit->date_sortie = now();
            $visit->save();
            return redirect()->route('exit.success');
        }

        // Si aucune visite trouvée
        return redirect()->back()->withErrors([
            'exitCode' => 'Aucune entrée n\'a été trouvée pour ce code.'
        ])->with('error', true);
    }
}
