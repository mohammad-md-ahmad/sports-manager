<?php

namespace App\Http\Controllers;

use App\Enums\UserType;
use App\Services\Data\Auth\LoginRequest;
use Exception;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            //forget all session attributes other than the CSRF token
            $sessionAttributes = array_keys(Session::all());
            $forgetAttributes = array_filter($sessionAttributes, function ($value, $key) {
                return $value !== '_token';
            }, ARRAY_FILTER_USE_BOTH);

            Session::forget($forgetAttributes);

            if (! Auth::attempt(['username' => $request->username, 'password' => $request->password])) {
                throw new AuthenticationException(__('Username or Password are incorrect!'));
            }

            $user = Auth::user();
            $token = $user->createToken(env('COMPOSE_PROJECT_NAME'))->plainTextToken;

            $data = [
                'token' => $token,
                'user' => $user->toArray(),
            ];

            if ($user->type->name === UserType::COMPANY_USER->name) {
                $data['company'] = $user->company()->toArray();
            }

            return response()->json([
                'data' => $data,
                'message' => 'User login successfully.',
            ], Response::HTTP_OK);
        } catch (AuthenticationException $exception) {
            Log::error('Unable to authenticate user: '.$exception->getMessage());

            return response()->json(['message' => $exception->getMessage()], Response::HTTP_UNAUTHORIZED);
        } catch (Exception $exception) {
            Log::error('Unable to authenticate user: '.$exception->getMessage());

            return response()->json(['message' => __('Unable to authenticate user!')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function logout(Request $request)
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
}
