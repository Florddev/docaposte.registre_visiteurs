<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Purpose;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Spatie\RouteAttributes\Attributes\Get;
use Spatie\RouteAttributes\Attributes\Post;
use Spatie\RouteAttributes\Attributes\Put;
use Spatie\RouteAttributes\Attributes\Delete;
use Spatie\RouteAttributes\Attributes\Middleware;
use Spatie\RouteAttributes\Attributes\Prefix;
use Spatie\RouteAttributes\Attributes\Where;

#[Middleware('auth')]
#[Prefix('dashboard')]
class PurposeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    #[Get('purposes', 'admin.purposes.index')]
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
    #[Get('purposes/create', 'admin.purposes.create')]
    public function create()
    {
        return Inertia::render('Admin/Purpose/PurposeCreate');
    }

    /**
     * Store a newly created resource in storage.
     */
    #[Post('purposes', 'admin.purposes.store')]
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
    #[Get('purposes/{purpose}/edit', 'admin.purposes.edit')]
    #[Where('purpose', '[0-9]+')]
    public function edit(Purpose $purpose)
    {
        return Inertia::render('Admin/Purpose/PurposeEdit', [
            'purpose' => $purpose,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    #[Put('purposes/{purpose}', 'admin.purposes.update')]
    #[Where('purpose', '[0-9]+')]
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
    #[Delete('purposes/{purpose}', 'admin.purposes.destroy')]
    #[Where('purpose', '[0-9]+')]
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
