<?php

namespace App\Enums;

use App\Traits\EnumFromName;

enum MobileAppScreensEnum
{
    use EnumFromName;

    case Dashboard;
    case Facilities;
    case FacilityForm;
    case FacilityView;
    case CompanyProfile;
    case CompanyProfileForm;
    case CompanyView;
    case UserProfile;
    case UserProfileForm;
    case UserView;
    case Calendar;
    case About;
    case ScheduleForm;
    case ScheduleEditForm;
    case Signup;
    case Login;
    case ForgetPassword;
    case Search;
    case UserBooking;
    case CompanyDetails;
    case CompanyPhotos;
    case ProgramManagmentTabs;
    case Reports;
    case Notifications;
    case Ratings;
    case BookingHistoryList;
    case UserBookingHistoryList;
    case ProfileMenu;
    case UsersList;
    case PaymentMethodsForm;
    case SurviesList;
    case SurveyForm;
}
