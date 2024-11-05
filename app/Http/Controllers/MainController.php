<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\RouteAttributes\Attributes\Get;

class MainController
{

    #[Get('/', 'home')]
    public function home(){
        return Inertia::render('Home');
    }

}
