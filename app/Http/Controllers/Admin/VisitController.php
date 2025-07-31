<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Visit;
use App\Models\Visitor;
use App\Models\Purpose;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class VisitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Visit::query()
            ->with(['visitor']);

        // Filtrage par recherche (nom du visiteur, email, etc.)
        if ($request->has('search') && $request->search) {
            $searchTerm = $request->search;
            $query->whereHas('visitor', function ($q) use ($searchTerm) {
                $q->where('lastname', 'like', "%{$searchTerm}%")
                    ->orWhere('firstname', 'like', "%{$searchTerm}%")
                    ->orWhere('email', 'like', "%{$searchTerm}%");
            })
                ->orWhere('company', 'like', "%{$searchTerm}%")
                ->orWhere('visit_recipient', 'like', "%{$searchTerm}%");
        }

        // Filtrage par motif
        if ($request->has('purpose_id') && $request->purpose_id) {
            $query->where('motif_id', $request->purpose_id);
        }

        // Filtrage par date
        if ($request->has('date') && $request->date) {
            $date = Carbon::parse($request->date)->format('Y-m-d');
            $query->whereDate('date_entree', $date);
        }

        // Pagination
        $visits = $query->orderBy('date_entree', 'desc')
            ->paginate(10)
            ->withQueryString()
            ->through(function ($visit) {
                // Récupérer le motif manuellement
                $purpose = Purpose::find($visit->motif_id);

                return [
                    'id' => $visit->id,
                    'visitor' => $visit->visitor,
                    'purpose' => $purpose ? ['id' => $purpose->id, 'name' => $purpose->nom] : null,
                    'visit_recipient' => $visit->visit_recipient,
                    'company' => $visit->company,
                    'date_entree' => $visit->date_entree,
                    'date_sortie' => $visit->date_sortie,
                    'identifiant_sortie' => $visit->identifiant_sortie,
                ];
            });

        // Récupération des motifs pour le filtre
        $purposes = Purpose::all()->map(function ($purpose) {
            return [
                'id' => $purpose->id,
                'name' => $purpose->nom
            ];
        });

        return Inertia::render('Admin/Visit/Index', [
            'visits' => $visits,
            'purposes' => $purposes,
            'filters' => $request->only(['search', 'purpose_id', 'date']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $purposes = Purpose::all();
        return Inertia::render('Admin/Visit/VisitCreate', [
            'purposes' => $purposes,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'visitor.lastname' => 'required|string|max:255',
            'visitor.firstname' => 'required|string|max:255',
            'visitor.email' => 'nullable|email|max:255',
            'visitor.phone' => 'nullable|string|max:255',
            'visitor.employee_number' => 'nullable|integer',
            'visitor.data_understanding' => 'boolean',
            'visitor.data_retention' => 'boolean',
            'motif_id' => 'required|exists:purposes,id',
            'visit_recipient' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'date_entree' => 'required|date',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Créer ou récupérer le visiteur
        $visitor = Visitor::updateOrCreate(
            [
                'email' => $request->visitor['email'],
                'phone' => $request->visitor['phone'],
            ],
            [
                'lastname' => Str::upper($request->visitor['lastname']),
                'firstname' => Str::upper($request->visitor['firstname']),
                'employee_number' => $request->visitor['employee_number'] ?? null,
                'data_understanding' => $request->visitor['data_understanding'] ?? false,
                'data_retention' => $request->visitor['data_retention'] ?? false,
            ]
        );

        // Créer la visite
        Visit::create([
            'visitor_id' => $visitor->id,
            'motif_id' => $request->motif_id,
            'visit_recipient' => $request->visit_recipient,
            'company' => $request->company,
            'date_entree' => $request->date_entree,
        ]);

        return redirect()->route('admin.visits.index')->with('success', 'Visite créée avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Visit $visit)
    {
        $visit->load(['visitor']);

        // Récupérer le motif manuellement
        $purpose = Purpose::find($visit->motif_id);

        return Inertia::render('Admin/Visit/VisitShow', [
            'visit' => [
                'id' => $visit->id,
                'visitor' => $visit->visitor,
                'purpose' => $purpose ? ['id' => $purpose->id, 'name' => $purpose->nom] : null,
                'visit_recipient' => $visit->visit_recipient,
                'company' => $visit->company,
                'date_entree' => $visit->date_entree,
                'date_sortie' => $visit->date_sortie,
                'identifiant_sortie' => $visit->identifiant_sortie,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Visit $visit)
    {
        $visit->load(['visitor']);

        // Récupération des motifs
        $purposes = Purpose::all()->map(function ($purpose) {
            return [
                'id' => $purpose->id,
                'name' => $purpose->nom
            ];
        });

        return Inertia::render('Admin/Visit/VisitEdit', [
            'visit' => [
                'id' => $visit->id,
                'visitor' => $visit->visitor,
                'motif_id' => $visit->motif_id,
                'visit_recipient' => $visit->visit_recipient,
                'company' => $visit->company,
                'date_entree' => $visit->date_entree,
                'date_sortie' => $visit->date_sortie,
                'identifiant_sortie' => $visit->identifiant_sortie,
            ],
            'purposes' => $purposes,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Visit $visit)
    {
        $validator = Validator::make($request->all(), [
            'visitor.lastname' => 'required|string|max:255',
            'visitor.firstname' => 'required|string|max:255',
            'visitor.email' => 'nullable|email|max:255',
            'visitor.phone' => 'nullable|string|max:255',
            'visitor.employee_number' => 'nullable|integer',
            'visitor.data_understanding' => 'boolean',
            'visitor.data_retention' => 'boolean',
            'motif_id' => 'required|exists:purposes,id',
            'visit_recipient' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'date_entree' => 'required|date',
            'date_sortie' => 'nullable|date|after_or_equal:date_entree',
            'identifiant_sortie' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Mettre à jour le visiteur
        if ($visit->visitor) {
            $visit->visitor->update([
                'lastname' => $request->visitor['lastname'],
                'firstname' => $request->visitor['firstname'],
                'email' => $request->visitor['email'],
                'phone' => $request->visitor['phone'],
                'employee_number' => $request->visitor['employee_number'] ?? null,
                'data_understanding' => $request->visitor['data_understanding'] ?? false,
                'data_retention' => $request->visitor['data_retention'] ?? false,
            ]);
        }

        // Mettre à jour la visite
        $visit->update([
            'motif_id' => $request->motif_id,
            'visit_recipient' => $request->visit_recipient,
            'company' => $request->company,
            'date_entree' => $request->date_entree,
            'date_sortie' => $request->date_sortie,
            'identifiant_sortie' => $request->identifiant_sortie,
        ]);

        return redirect()->route('admin.visits.index')->with('success', 'Visite mise à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Visit $visit)
    {
        $visit->delete();
        return redirect()->route('admin.visits.index')->with('success', 'Visite supprimée avec succès.');
    }

    /**
     * Show the form for checking out a visitor.
     */
    public function checkoutForm(Visit $visit)
    {
        $visit->load(['visitor']);

        // Récupérer le motif manuellement
        $purpose = Purpose::find($visit->motif_id);

        return Inertia::render('Admin/Visit/VisitCheckout', [
            'visit' => [
                'id' => $visit->id,
                'visitor' => $visit->visitor,
                'purpose' => $purpose ? ['id' => $purpose->id, 'name' => $purpose->nom] : null,
                'visit_recipient' => $visit->visit_recipient,
                'company' => $visit->company,
                'date_entree' => $visit->date_entree,
                'date_sortie' => $visit->date_sortie,
            ]
        ]);
    }

    /**
     * Checkout visitor (record exit time).
     */
    public function checkout(Visit $visit, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'identifiant_sortie' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $visit->update([
            'date_sortie' => now(),
            'identifiant_sortie' => $request->identifiant_sortie,
        ]);

        return redirect()->route('admin.visits.index')->with('success', 'Visite terminée avec succès.');
    }
}
