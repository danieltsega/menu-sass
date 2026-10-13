<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function landing(): Response
    {
        return Inertia::render('Landing');
    }

    public function portal(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function dashboard(): Response
    {
        return Inertia::render('Admin/Dashboard');
    }

    public function cafes(): Response
    {
        return Inertia::render('Admin/Cafes');
    }

    public function cafe(): Response
    {
        return Inertia::render('Admin/Cafe');
    }

    public function categories(): Response
    {
        return Inertia::render('Admin/Categories');
    }

    public function dishes(): Response
    {
        return Inertia::render('Admin/Dishes');
    }

    public function users(): Response
    {
        return Inertia::render('Admin/Users');
    }

    public function menu(string $cafeSlug): Response
    {
        return Inertia::render('Menu/MenuPage', ['cafeSlug' => $cafeSlug]);
    }
}