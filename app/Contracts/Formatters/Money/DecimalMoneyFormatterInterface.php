<?php

declare(strict_types=1);

namespace App\Contracts\Formatters\Money;

use Money\Formatter\DecimalMoneyFormatter;
use Money\Money;

interface DecimalMoneyFormatterInterface
{
    public function format(Money $amount): string;

    public function formatValue(float|string $amount, string $currency): string;

    public function getISOFormatter(): DecimalMoneyFormatter;
}
