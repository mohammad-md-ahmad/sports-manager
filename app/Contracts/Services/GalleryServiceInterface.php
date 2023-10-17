<?php

namespace App\Contracts\Services;

use App\Models\Gallery;
use App\Services\Data\Gallery\CreateGalleryRequest;
use App\Services\Data\Gallery\UpdateGalleryRequest;

interface GalleryServiceInterface
{
    public function store(CreateGalleryRequest $data): Gallery;

    public function update(UpdateGalleryRequest $data): Gallery;
}
