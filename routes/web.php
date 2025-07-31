<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MainController;
use App\Http\Controllers\EntryController;
use App\Http\Controllers\ExitController;
use App\Http\Controllers\EmergencyExitController;
use App\Http\Controllers\Admin\MainController as AdminMainController;
use App\Http\Controllers\Admin\VisitController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\PurposeController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Api\EntryApiController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Routes publiques avec middleware guest.admin
Route::middleware('guest.admin')->group(function () {
    // Route principale
    Route::get('/', [MainController::class, 'home'])->name('home');
    
    // Routes d'entrée
    Route::prefix('entry')->name('entry.')->group(function () {
        Route::get('/', [EntryController::class, 'index'])->name('index');
        Route::get('/employee', [EntryController::class, 'employee'])->name('employee');
        Route::get('/visitor', [EntryController::class, 'visitor'])->name('visitor');
        Route::get('/success', [EntryController::class, 'success'])->name('success');
        Route::post('/submit-visit', [EntryController::class, 'submitVisit'])->name('submitVisit');
    });
    
    // Routes de sortie
    Route::prefix('exit')->name('exit.')->group(function () {
        Route::get('/', [ExitController::class, 'index'])->name('index');
        Route::get('/success', [ExitController::class, 'success'])->name('success');
        Route::post('/submit-exit', [ExitController::class, 'submitVisit'])->name('submitExit');
    });
    
    // Routes d'urgence
    Route::prefix('emergency')->name('emergency.')->group(function () {
        Route::post('authenticate', [EmergencyExitController::class, 'authenticate'])->name('authenticate');
        Route::post('force-exit/{visit}', [EmergencyExitController::class, 'forceExit'])->name('forceExit');
    });
    
    // Routes API d'entrée
    Route::prefix('entry')->name('entry.')->group(function () {
        Route::get('/visitors/employee/{employee_number}', [EntryApiController::class, 'findByEmployeeNumber'])->name('findByEmployeeNumber');
    });
});

// Routes d'administration avec middleware auth
Route::middleware('auth')->prefix('dashboard')->name('admin.')->group(function () {
    // Dashboard principal
    Route::get('home', [AdminMainController::class, 'home'])->name('home');
    
    // Routes des visites
    Route::prefix('visits')->name('visits.')->group(function () {
        Route::get('/', [VisitController::class, 'index'])->name('index');
        Route::get('/create', [VisitController::class, 'create'])->name('create');
        Route::post('/', [VisitController::class, 'store'])->name('store');
        Route::get('/{visit}', [VisitController::class, 'show'])->name('show')->where('visit', '[0-9]+');
        Route::get('/{visit}/edit', [VisitController::class, 'edit'])->name('edit')->where('visit', '[0-9]+');
        Route::put('/{visit}', [VisitController::class, 'update'])->name('update')->where('visit', '[0-9]+');
        Route::delete('/{visit}', [VisitController::class, 'destroy'])->name('destroy')->where('visit', '[0-9]+');
        Route::get('/{visit}/checkout', [VisitController::class, 'checkoutForm'])->name('checkout')->where('visit', '[0-9]+');
        Route::post('/{visit}/checkout', [VisitController::class, 'checkout'])->name('checkout.store')->where('visit', '[0-9]+');
    });
    
    // Routes des utilisateurs
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::get('/create', [UserController::class, 'create'])->name('create');
        Route::post('/', [UserController::class, 'store'])->name('store');
        Route::get('/{user}', [UserController::class, 'show'])->name('show')->where('user', '[0-9]+');
        Route::get('/{user}/edit', [UserController::class, 'edit'])->name('edit')->where('user', '[0-9]+');
        Route::put('/{user}', [UserController::class, 'update'])->name('update')->where('user', '[0-9]+');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy')->where('user', '[0-9]+');
    });
    
    // Routes des motifs
    Route::prefix('purposes')->name('purposes.')->group(function () {
        Route::get('/', [PurposeController::class, 'index'])->name('index');
        Route::get('/create', [PurposeController::class, 'create'])->name('create');
        Route::post('/', [PurposeController::class, 'store'])->name('store');
        Route::get('/{purpose}/edit', [PurposeController::class, 'edit'])->name('edit')->where('purpose', '[0-9]+');
        Route::put('/{purpose}', [PurposeController::class, 'update'])->name('update')->where('purpose', '[0-9]+');
        Route::delete('/{purpose}', [PurposeController::class, 'destroy'])->name('destroy')->where('purpose', '[0-9]+');
    });
    
    // Routes des paramètres
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/', [SettingController::class, 'index'])->name('index');
        Route::post('/', [SettingController::class, 'update'])->name('update');
    });
});

// Routes de profil (déjà existantes)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
