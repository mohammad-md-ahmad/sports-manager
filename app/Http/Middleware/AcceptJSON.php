<?php

namespace App\Http\Middleware;

class AcceptJSON
{
    public function handle($request, $next)
    {
        $request->headers->set('Accept', 'application/json');

        return $next($request);
    }
}
