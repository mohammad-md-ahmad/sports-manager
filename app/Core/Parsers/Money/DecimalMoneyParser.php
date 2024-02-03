<?php

declare(strict_types=1);

namespace App\Core\Parsers;

use Money\Currencies\ISOCurrencies;
use Money\Currency;
use Money\Money;
use Money\Parser\DecimalMoneyParser as MoneyDecimalMoneyParser;

class DecimalMoneyParser implements DecimalMoneyParserInterface
{
    public function parse(string $amount, string|Currency $currencyCode): Money
    {
        $currency = $currencyCode instanceof Currency ? $currencyCode : new Currency($currencyCode);

        return $this->getISOParser()->parse($amount, $currency);
    }

    public function getISOParser(): MoneyDecimalMoneyParser
    {
        return new MoneyDecimalMoneyParser(new ISOCurrencies());
    }
}
