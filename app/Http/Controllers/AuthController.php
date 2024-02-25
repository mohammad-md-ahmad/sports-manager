<?php

namespace App\Http\Controllers;

use App\Enums\UserType;
use App\Models\User;
use App\Services\Data\Auth\LoginRequest;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        try {
            //forget all session attributes other than the CSRF token
            $sessionAttributes = array_keys(Session::all());
            $forgetAttributes = array_filter($sessionAttributes, function ($value, $key) {
                return $value !== '_token';
            }, ARRAY_FILTER_USE_BOTH);

            Session::forget($forgetAttributes);

            $loginDTO = LoginRequest::from([
                'username' => $request->get('username'),
                'password' => $request->get('password'),
            ]);

            if (! Auth::attempt(['username' => $loginDTO->username, 'password' => $loginDTO->password])) {
                throw new AuthenticationException(__('Username or Password are incorrect!'));
            }

            /** @var User $user */
            $user = Auth::user();

            if ($user->type != UserType::ADMIN && $request->is('web-api/*')) {
                // Invalidate user's token and throw an authorization exception
                Auth::user()->tokens()->delete();
                throw new AuthorizationException(__('You are not authorized to access this resource.'));
            }

            if ($user->type == UserType::COMPANY_USER) {
                $userCompany = $user->company();

                Auth::user()->tokens()->delete();

                if ($userCompany && $userCompany->status->isDisabled()) {
                    throw new AuthorizationException(__('You have no access for this resource or your account had been disabled.'));
                }
            }

            $token = $user->createToken(env('COMPOSE_PROJECT_NAME'))->plainTextToken;

            $data = [
                'token' => $token,
                'user' => $user->load('address')->toArray(),
            ];

            if ($user->type->name === UserType::COMPANY_USER->name) {
                $data['company'] = $user->company()->load(['address', 'gallery', 'ratings'])->toArray();
            }

            return response()->json([
                'data' => $data,
                'message' => 'User login successfully.',
            ], Response::HTTP_OK);
        } catch (AuthenticationException $exception) {
            Log::error('Unable to authenticate user: '.$exception->getMessage());

            return response()->json(['message' => $exception->getMessage()], Response::HTTP_UNAUTHORIZED);
        } catch (AuthorizationException $exception) {
            Log::error('Unable to authorize user: '.$exception->getMessage());

            return response()->json(['message' => $exception->getMessage()], Response::HTTP_UNAUTHORIZED);
        } catch (Exception $exception) {
            Log::error('Unable to authenticate user: '.$exception->getMessage());

            return response()->json(['message' => __('Unable to authenticate user!')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        try {
            // delete the current token that was used for the request
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'message' => __('User has been logout successfully!'),
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to logout user: '.$exception->getMessage());

            return response()->json(['message' => __('Unable to logout user!')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function sendPasswordResetLink(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'email' => 'required|email',
            ]);

            $email = $request->only('email');

            Password::sendResetLink($email);
        } catch (ValidationException $exception) {
            Log::error($exception->getMessage());

            return response()->json([
                'message' => __('Validation errors!'),
                'errors' => $exception->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        } catch (Exception $exception) {
            Log::error($exception->getMessage());
        }

        return response()->json(['message' => __('If this email address is registered in our platform, a password reset link will be sent.')], Response::HTTP_OK);
    }
}
