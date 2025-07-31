<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class MainController
{

    public function home()
    {
        return Inertia::render('Home');
    }
}
