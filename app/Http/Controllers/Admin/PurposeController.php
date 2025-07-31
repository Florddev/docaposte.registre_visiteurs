<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Purpose;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class PurposeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Purpose::query();

        // Filtrage par recherche (nom)
        if ($request->has('search') && $request->search) {
            $query->where('nom', 'like', "%{$request->search}%");
        }

        // Pagination
        $purposes = $query->orderBy('nom', 'asc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Purpose/Index', [
            'purposes' => $purposes,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Purpose/PurposeCreate');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255|unique:purposes',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        Purpose::create([
            'nom' => $request->nom,
        ]);

        session()->flash('success', 'Motif créé avec succès.');
        return redirect()->route('admin.purposes.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Purpose $purpose)
    {
        return Inertia::render('Admin/Purpose/PurposeEdit', [
            'purpose' => $purpose,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Purpose $purpose)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255|unique:purposes,nom,' . $purpose->id,
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $purpose->update([
            'nom' => $request->nom,
        ]);

        session()->flash('success', 'Motif mis à jour avec succès.');
        return redirect()->route('admin.purposes.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Purpose $purpose)
    {
        // Vérifier si le motif est utilisé par une visite
        if ($purpose->visits()->count() > 0) {
            session()->flash('error', 'Ce motif ne peut pas être supprimé car il est utilisé par une ou plusieurs visites.');
            return back();
        }

        $purpose->delete();
        session()->flash('success', 'Motif supprimé avec succès.');
        return redirect()->route('admin.purposes.index');
    }
}
