<?php

namespace App\Core;

class Util
{
    public static function heronHash(string $data, $algo = 'sha256'): string
    {
        return hash($algo, $data);
    }
}
