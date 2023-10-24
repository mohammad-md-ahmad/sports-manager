<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function show(Request $request)
    {
        $path = $request->get('path');

        $image = Storage::disk('public')->get($path);

        // detect the image format (JPEG, PNG)
        $imgFormat = finfo_buffer(finfo_open(), $image, FILEINFO_MIME_TYPE);

        return response($image, 200)->header('Content-Type', $imgFormat);
    }
}
