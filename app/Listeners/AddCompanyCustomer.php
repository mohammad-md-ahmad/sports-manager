<?php

namespace App\Listeners;

use App\Enums\CompanyCustomerStatus;
use App\Models\Booking;
use App\Models\CompanyCustomer;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AddCompanyCustomer
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(object $event): void
    {
        $this->addCompanyCustomer($event->booking);
    }

    protected function addCompanyCustomer(Booking $booking): bool
    {
        try {
            DB::transaction(function () use ($booking) {
                CompanyCustomer::updateOrCreate([
                    'company_id' => $booking->company->id,
                    'user_id' => $booking->customerUser->id,
                ], [
                    'status' => CompanyCustomerStatus::Active,
                ]);
            });

            return true;
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            throw $exception;
        }
    }
}
