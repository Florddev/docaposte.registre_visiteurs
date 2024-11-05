<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Spatie\RouteAttributes\Attributes\Get;
use Spatie\RouteAttributes\Attributes\Group;

#[Group(prefix: 'entry', as: 'entry.')]
class EntryController
{

    #[Get('/', 'index')]
    public function index(){
        return Inertia::render('Entry/Index');
    }

    #[Get('/employee', 'employee')]
    public function employee(){
        return Inertia::render('Entry/Employee');
    }

    #[Get('/visitor', 'visitor')]
    public function visitor(){
        return Inertia::render('Entry/Visitor');
    }

}
