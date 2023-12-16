<?php

namespace App\Listeners;

use App\Events\PasswordResetEvent;
use App\Notifications\PasswordResetConfirmation;

class PasswordResetListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @return void
     *
     * @throws \Exception
     */
    public function handle(PasswordResetEvent $event)
    {
        $event->user->notify(new PasswordResetConfirmation());
    }
}
