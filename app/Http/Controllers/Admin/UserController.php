<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Spatie\RouteAttributes\Attributes\Get;
use Spatie\RouteAttributes\Attributes\Post;
use Spatie\RouteAttributes\Attributes\Put;
use Spatie\RouteAttributes\Attributes\Delete;
use Spatie\RouteAttributes\Attributes\Middleware;
use Spatie\RouteAttributes\Attributes\Prefix;
use Spatie\RouteAttributes\Attributes\Where;

#[Middleware('auth')]
#[Prefix('dashboard')]
class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    #[Get('users', 'admin.users.index')]
    public function index(Request $request)
    {
        $query = User::query();

        // Filtrage par recherche
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Pagination
        $users = $query->orderBy('name', 'asc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/User/Index', [
            'users' => $users,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    #[Get('users/create', 'admin.users.create')]
    public function create()
    {
        return Inertia::render('Admin/User/UserCreate');
    }

    /**
     * Store a newly created resource in storage.
     */
    #[Post('users', 'admin.users.store')]
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        session()->flash('success', 'Utilisateur créé avec succès.');
        return redirect()->route('admin.users.index');
    }

    /**
     * Display the specified resource.
     */
    #[Get('users/{user}', 'admin.users.show')]
    #[Where('user', '[0-9]+')]
    public function show(User $user)
    {
        return Inertia::render('Admin/User/UserShow', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    #[Get('users/{user}/edit', 'admin.users.edit')]
    #[Where('user', '[0-9]+')]
    public function edit(User $user)
    {
        return Inertia::render('Admin/User/UserEdit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    #[Put('users/{user}', 'admin.users.update')]
    #[Where('user', '[0-9]+')]
    public function update(Request $request, User $user)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ];

        // Ajouter la validation du mot de passe uniquement s'il est fourni
        if ($request->filled('password')) {
            $rules['password'] = ['confirmed', Rules\Password::defaults()];
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $userData = [
            'name' => $request->name,
            'email' => $request->email,
        ];

        // Mettre à jour le mot de passe uniquement s'il est fourni
        if ($request->filled('password')) {
            $userData['password'] = Hash::make($request->password);
        }

        $user->update($userData);

        session()->flash('success', 'Utilisateur mis à jour avec succès.');
        return redirect()->route('admin.users.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    #[Delete('users/{user}', 'admin.users.destroy')]
    #[Where('user', '[0-9]+')]
    public function destroy(Request $request, User $user)
    {
        // Empêcher la suppression de son propre compte
        if ($user->id === $request->user()->id) {
            session()->flash('error', 'Vous ne pouvez pas supprimer votre propre compte.');
            return back();
        }

        $user->delete();
        session()->flash('success', 'Utilisateur supprimé avec succès.');
        return redirect()->route('admin.users.index');
    }
}
