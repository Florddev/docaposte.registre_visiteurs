<?php

namespace App\Http\Controllers;

use App\Models\Purpose;
use App\Models\Visit;
use App\Models\Visitor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\RouteAttributes\Attributes\Get;
use Spatie\RouteAttributes\Attributes\Group;
use Spatie\RouteAttributes\Attributes\Post;

#[Group(prefix: 'entry', as: 'entry.')]
class EntryController
{

    #[Get('/', 'index')]
    public function index(){
        return Inertia::render('Entry/Index');
    }

    #[Get('/employee', 'employee')]
    public function employee(){
        return Inertia::render('Entry/Employee', [
            'motifs' => Purpose::all()
        ]);
    }

    #[Get('/visitor', 'visitor')]
    public function visitor(){
        return Inertia::render('Entry/Visitor', [
            'motifs' => Purpose::all()
        ]);
    }

    #[Get('/success', 'success')]
    public function success(){
        return Inertia::render('Entry/End');
    }


    #[Post('/submit-visit', 'submitVisit')]
    public function submitVisit(Request $request)
    {
        $visiteur = Visitor::updateOrCreate(
            ['employee_number' => $request->matricule],
            [
                'lastname' => $request->lastName,
                'firstname' => $request->firstName,
                'email' => $request->email,
                'phone' => $request->phone,
                'data_understanding' => $request->dataUnderstanding,
                'data_retention' => $request->dataRetention,
            ]
        );

        $visite = Visit::create([
            'visitor_id' => $visiteur->id,
            'motif_id' => $request->motifId,
            'company' => $request->company,
            'visit_recipient' => $request->personToMeet,
            'identifiant_sortie' => $request->identifiant ?? null,
            'date_entree' => now(),
        ]);

        return redirect()->route('entry.success');
    }

}
