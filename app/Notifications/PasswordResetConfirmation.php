<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\HtmlString;

class PasswordResetConfirmation extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     */
    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(Lang::get('Password Reset Confirmation'))
            ->greeting(Lang::get('Password Reset Confirmation'))
            ->line(new HtmlString(
                '<b class="text-bold text-black">'.
                __('The password for your :appname account was recently changed.', ['appname' => config('app.name')]).' '.
                '</b>'
            ))
            ->line(new HtmlString('<span class="body-text">'.__('This is an automated email, please don’t reply to it.').'</span>'));
    }
}
