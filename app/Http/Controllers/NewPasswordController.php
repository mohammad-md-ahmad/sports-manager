<?php

namespace App\Http\Controllers;

use App\Core\Util;
use App\Events\PasswordResetEvent;
use App\Models\User;
use App\Notifications\UserAccountCreatedConfirmation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;

class NewPasswordController extends Controller
{
    /**
     * Display the password reset view.
     */
    public function create(Request $request, $token): View
    {
        return view('auth.reset-password', compact('request', 'token'));
    }

    /**
     * Handle an incoming new password request.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Here we will attempt to reset the user's password. If it is successful we
        // will update the password on an actual user model and persist it to the
        // database. Otherwise we will parse the error and return the response.
        $credentials = $request->only('email', 'password', 'password_confirmation', 'token');
        $status = Password::reset(
            $credentials,
            function (User $user) use ($request) {
                $data = [
                    'password' => Hash::make($request->password),
                ];

                if ($user->forceFill($data)->save()) {
                    event(new PasswordResetEvent($user));
                }
            }
        );
dd($status, Password::PASSWORD_RESET);
        // If the password was successfully reset, we will redirect the user back to
        // the application's home authenticated view. If there is an error we can
        // redirect them back to where they came from with their error message.
        return $status == Password::PASSWORD_RESET
            ? redirect()->route('login')->with('status', __($status))
            : back()->withInput($request->only('email'))
                ->withErrors(['email' => __($status)]);
    }
}
