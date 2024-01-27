<?php

declare(strict_types=1);

namespace App\Services\Data\CompanySurvey;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Data;

class CreateCompanySurveyRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('company')]
        public Company $company,
        public string $name,
        public array $questions,
        public bool $is_active = false,
    ) {
    }

    public static function rules(Request $request)
    {
        $name = $request->get('name');
        $company = $request->route()->parameter('company');

        return [
            'name' => Rule::unique('company_surveys')->where(function ($query) use ($name, $company) {
                return $query->where('name', $name)
                    ->where('company_id', $company->id);
            }),
        ];
    }
}
