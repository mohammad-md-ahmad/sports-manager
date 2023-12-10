<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Eloquent\Model;

class MorphModelExists implements ValidationRule
{
    public function __construct(
        protected string $model_type
    ) {
    }

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! class_exists($this->model_type)) {
            $fail('Target class '.$this->model_type.' not found.');
        }

        /** @var Model|null $model */
        $model = app($this->model_type)::whereUuid($value)->first();

        if (! $model instanceof Model) {
            $fail(sprintf('Target record uuid of model %s not found.', $this->model_type));
        }
    }
}
