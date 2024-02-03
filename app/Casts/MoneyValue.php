<?php

declare(strict_types=1);

namespace App\Casts;

use App\Models\Currency;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;
use LogicException;
use Money\Currency as MoneyCurrency;
use Money\Money;

class MoneyValue implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes)
    {
        if (is_null($value)) {
            return null;
        }

        $modelCurrency = $this->getCurrency($model, $key);

        if (empty($modelCurrency) || ! $modelCurrency instanceof Currency) {
            throw new LogicException('Money Value is not supported without Currency!');
        }

        $currency = new MoneyCurrency($modelCurrency->iso_short_code);

        return new Money($attributes[$key], $currency);
    }

    public function set(Model $model, string $key, mixed $value, array $attributes)
    {
        if (is_null($value)) {
            return null;
        }

        if (! $value instanceof Money) {
            throw new LogicException('Caster expects Money Value!');
        }

        $currencyModel = Currency::query()->where('iso_short_code', $value->getCurrency()->getCode())->first();

        if ($currencyModel === null) {
            throw new LogicException('Currency not found!');
        }

        $moneyAttributes = [
            $key => $value->getAmount(),
        ];

        $currencyColumn = $this->getCurrencyColumn($model, $key);

        if (Schema::hasColumn($model->getTable(), $currencyColumn)) {
            $moneyAttributes[$currencyColumn] = $currencyModel->id;
        }

        return $moneyAttributes;
    }

    private function getCurrency($model, $key)
    {
        if (isset($model->moeny_currency_map) && array_key_exists($key, $model->money_currency_map)) {
            $currency = $model->money_currency_map[$key];

            if (! method_exists($model, $currency)) {
                return null;
            }

            return $model->$currency;
        }

        return $model->currency;
    }

    private function getCurrencyColumn($model, $key)
    {
        if (isset($model->money_currency_map) && array_key_exists($key, $model->money_currency_map)) {
            return $model->money_currency_map[$key];
        }

        return 'currency_id';
    }
}
