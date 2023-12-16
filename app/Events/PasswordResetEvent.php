<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Queue\SerializesModels;

class PasswordResetEvent
{
    use SerializesModels;

    /**
     * The user.
     */
    public User $user;

    /**
     * Create a new event instance.
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }
}
