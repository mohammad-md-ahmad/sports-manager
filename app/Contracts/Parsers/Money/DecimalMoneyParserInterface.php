<?php

declare(strict_types=1);

namespace App\Contracts\Parsers\Money;

use Money\Money;
use Money\Parser\DecimalMoneyParser;

interface DecimalMoneyParserInterface
{
    public function parse(string $amount, string $currencyCode): Money;

    public function getISOParser(): DecimalMoneyParser;
}
