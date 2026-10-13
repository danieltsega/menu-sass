<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadImageRequest;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function store(UploadImageRequest $request): JsonResponse
    {
        $file = $request->file('image');
        $name = Str::uuid()->toString().'.'.strtolower($file->getClientOriginalExtension());

        $file->move(public_path('uploads'), $name);

        return ApiResponse::success(['url' => '/uploads/'.$name]);
    }
}