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
        //...

        return redirect()->route('exit.success');
    }

}
