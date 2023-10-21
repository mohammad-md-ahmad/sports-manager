<?php

declare(strict_types=1);

namespace App\Services\Data\CompanyFacility;

use App\Models\Company;
use App\Services\Data\Address\CreateAddressRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Data;

class CreateCompanyFacilityRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('company')]
        public Company $company,
        public string $name,
        public string $type,
        public array $details,
        public CreateAddressRequest $createAddressRequest,
    ) {
    }

    public static function rules(Request $request)
    {
        $name = $request->get('name');
        $company = $request->route()->parameter('company');

        return [
            'name' => Rule::unique('company_facilities')->where(function ($query) use ($name, $company) {
                return $query->where('name', $name)
                    ->where('company_id', $company->id);
            }),
        ];
    }
}
