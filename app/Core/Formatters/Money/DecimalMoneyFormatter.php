<?php

declare(strict_types=1);

namespace App\Core\Formatters\Money;

use App\Contracts\Formatters\Money\DecimalMoneyFormatterInterface;
use App\Contracts\Parsers\Money\DecimalMoneyParserInterface;
use Money\Currencies\ISOCurrencies;
use Money\Formatter\DecimalMoneyFormatter as BaseDecimalMoneyFormatter;
use Money\Money;

class DecimalMoneyFormatter implements DecimalMoneyFormatterInterface
{
    public function __construct(protected DecimalMoneyParserInterface $decimalMoneyParser)
    {
    }

    public function format(Money $amount): string
    {
        return (new BaseDecimalMoneyFormatter(new ISOCurrencies()))->format($amount);
    }

    public function formatValue(float|string $amount, string $currency): string
    {
        $parsed = $this->decimalMoneyParser->parse((string) $amount, $currency);

        return $this->format($parsed);
    }

    public function getISOFormatter(): BaseDecimalMoneyFormatter
    {
        return new BaseDecimalMoneyFormatter(new ISOCurrencies());
    }
}
