<?php

namespace App\Enums;

enum Role: string
{
    case SuperAdmin = 'super_admin';
    case CafeAdmin = 'cafe_admin';
}
