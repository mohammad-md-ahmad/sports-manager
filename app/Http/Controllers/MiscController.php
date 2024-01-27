<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\FacilityType;
use App\Enums\Report;
use App\Enums\UserGender;
use App\Enums\UserType;
use App\Models\Country;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class MiscController extends Controller
{
    public function lists(): JsonResponse
    {
        $lists['user_types'] = UserType::toArray();
        $lists['facility_types'] = FacilityType::toArray();
        $lists['countries'] = Country::with('currency')
            ->get()
            ->map(function ($country) {
                return [
                    'country_uuid' => $country->uuid,
                    'name' => $country->name,
                    'flag' => $country->flag,
                    'distance_metric' => $country->distance_metric,
                    'iso_short_code' => $country->iso_short_code,
                    'currency_name' => $country->currency->name,
                    'currency_iso_short_code' => $country->currency->iso_short_code,
                ];
            });
        $lists['user_gender'] = UserGender::toArray();
        $lists['report_names'] = Report::toArray();

        return response()->json(['data' => $lists], Response::HTTP_OK);
    }
}
