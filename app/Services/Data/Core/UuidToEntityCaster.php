<?php

declare(strict_types=1);

namespace App\Services\Data\Core;

use Illuminate\Database\Eloquent\Model;
use InvalidArgumentException;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Casts\Cast;
use Spatie\LaravelData\Support\DataProperty;

class UuidToEntityCaster implements Cast
{
    public function cast(DataProperty $property, mixed $value, array $context): mixed
    {
        $targetClass = (string) current($property->attributes->filter(function ($attribute) {
            return $attribute instanceof WithCast;
        })->first()?->arguments ?? []);

        if (is_array($value)) {
            return array_map(function ($item) use ($targetClass) {
                return self::castFromValue($item, $targetClass);
            }, $value);
        }

        return self::castFromValue($value, $targetClass);
    }

    public static function castFromValue(string|int $uuid, string $targetClass): string|int|null
    {
        return self::castObjectFromValue($uuid, $targetClass)?->getKey() ?? null;
    }

    public static function castObjectFromValue(string|int $uuid, string $targetClass): ?Model
    {
        if (! class_exists($targetClass)) {
            throw new InvalidArgumentException('Target class '.$targetClass.' not found.');
        }

        if ($uuid === 'null') {
            return null;
        }

        if (is_int($uuid)) {
            /** @var Model|null $model */
            $model = app($targetClass)::where('id', $uuid)->first();
        } else {
            /** @var Model|null $model */
            $model = app($targetClass)::whereUuid($uuid)->first();
        }

        if (! $model instanceof Model) {
            throw new InvalidArgumentException(sprintf('Target record uuid of model %s not found.', $targetClass));
        }

        return $model;
    }
}
