<?php

namespace App\Http\Controllers;

use App\Models\Visit;
use App\Models\Visitor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\RouteAttributes\Attributes\Get;
use Spatie\RouteAttributes\Attributes\Group;
use Spatie\RouteAttributes\Attributes\Post;

#[Group(prefix: 'exit', as: 'exit.')]
class ExitController
{

    #[Get('/', 'index')]
    public function index(){
        return Inertia::render('Exit/Index');
    }

    #[Get('/success', 'success')]
    public function success(){
        return Inertia::render('Exit/End');
    }

    #[Post('/submit-exit', 'submitExit')]
    public function submitVisit(Request $request)
    {
        $visits = Visit::join('visitors', 'visits.visitor_id', '=', 'visitors.id')
            ->where('visits.date_sortie', null)
            ->where(function($query) use ($request) {
                $query->where('visits.identifiant_sortie', $request->exitCode)
                    ->orWhere('visitors.employee_number', $request->exitCode);
            })
            ->select('visits.*')
            ->with('visitor')
            ->get();

        if($visits->count() > 1 && empty($request->lastname)){
            return redirect()->back()->withErrors([
                'exitCode' => 'Plusieurs entrées ont été trouvées pour ce code, merci de contacter un administrateur.'
            ])->with('error', true);
        } else if($visits->count() == 1) {
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
