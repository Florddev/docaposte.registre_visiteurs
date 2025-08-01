<?php

namespace App\Http\Controllers;

use App\Models\Purpose;
use App\Models\Visit;
use App\Models\Visitor;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class EntryController
{

    public function index()
    {
        return Inertia::render('Entry/Index');
    }

    public function employee()
    {
        return Inertia::render('Entry/Employee', [
            'motifs' => Purpose::all()
        ]);
    }

    public function visitor()
    {
        return Inertia::render('Entry/Visitor', [
            'motifs' => Purpose::all()
        ]);
    }

    public function success()
    {
        return Inertia::render('Entry/End');
    }


    public function submitVisit(Request $request)
    {
        $model = [
            'lastname' => $request->lastName,
            'firstname' => $request->firstName,
            'email' => $request->email,
            'phone' => $request->phone,
            'data_understanding' => $request->dataUnderstanding,
            'data_retention' => $request->dataRetention,
        ];

        if (empty($request->matricule)) {
            $visiteur = Visitor::create($model);
        } else {
            $visiteur = Visitor::updateOrCreate(
                ['employee_number' => $request->matricule],
                $model
            );
            $request->company = 'Docaposte';
        }

        $visite = Visit::create([
            'visitor_id' => $visiteur->id,
            'motif_id' => $request->motifId,
            'company' => Str::ucfirst(Str::lower($request->company)),
            'visit_recipient' => $request->personToMeet,
            'identifiant_sortie' => $request->identifiant ?? null,
            'date_entree' => now(),
        ]);

        return redirect()->route('entry.success');
    }
}
