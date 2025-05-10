<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Spatie\RouteAttributes\Attributes\Get;
use Spatie\RouteAttributes\Attributes\Middleware;
use Spatie\RouteAttributes\Attributes\Prefix;

#[Middleware('auth')]
#[Prefix('dashboard')]
class MainController extends Controller
{
    #[Get('home', 'admin.home')]
    public function home(): \Inertia\Response
    {
        return Inertia::render('Admin/Home');
    }
}
