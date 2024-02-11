import { API_URL, ASSETS_URL, IMAGES_URL } from '@env';

const Constants = {
    apiUrl: API_URL ?? 'https://liber.quad-bh.com/api',
    assetsUrl: ASSETS_URL ?? 'https://liber.quad-bh.com/storage',
    imagesUrl: IMAGES_URL ?? 'https://liber.quad-bh.com/files/images',
    tokenKey: 'auth_token',
    userDataKey: 'user_data',
    companyDataKey: 'company_data',
    facilityTypesKey: 'facility_types',
    countriesKey: 'countries',
    sportsKey: 'sports',
    oneSignalAppID: 'c9163259-17f6-4cd0-b6c6-6d3a9241f1b4',
};

export default Constants;

export enum UserType {
    CompanyUser = "COMPANY_USER",
    CustomerUser = "CUSTOMER_USER",
}

export enum Screens {
    Dashboard = "Dashboard",
    // CompanyDashboard = "CompanyDashboard",
    // UserDashboard = "UserDashboard",
    Facilities = "Facilities",
    FacilityForm = "FacilityForm",
    FacilityView = "FacilityView",
    CompanyProfile = "CompanyProfile",
    CompanyProfileForm = "CompanyProfileForm",
    CompanyView = "CompanyView",
    UserProfile = "UserProfile",
    UserProfileForm = "UserProfileForm",
    UserView = "UserView",
    Calendar = "Calendar",
    About = "About",
    ScheduleForm = "ScheduleForm",
    ScheduleEditForm = "ScheduleEditForm",
    Signup = "Signup",
    Login = "Login",
    ForgetPassword = "ForgetPassword",
    Search = "Search",
    UserBooking = "UserBooking",
    CompanyDetails = "CompanyDetails",
    CompanyPhotos = "CompanyPhotos",
    ProgramManagmentTabs = "ProgramManagmentTabs",
    Reports = "Reports",
    Notifications = "Notifications",
    Ratings = "Ratings",
    BookingHistoryList = "BookingHistoryList",
    UserBookingHistoryList = "UserBookingHistoryList",
    ProfileMenu = "ProfileMenu",
    UsersList = "UsersList",
    PaymentMethodsForm = "PaymentMethodsForm",
    SurviesList = "SurviesList",
    SurveyForm = "SurveyForm",
    SurveyFillForm = "SurveyFillForm",
}

export enum SlotStatus {
    Booked = "Booked",
    Available = "Available",
    Pending = "Pending",
}

export enum BookingStatus {
    Approved = "Approved",
    Declined = "Declined",
    Pending = "Pending",
}

export enum GlobaSateKey {
    SetLoading = "SET_LOADING",
    SetCurrentScreen = "SET_CURRENT_SCREEN",
    SetCompanyData = "SET_COMPANY_DATA",
    SetAuthCompanyData = "SET_CURRENT_COMPANY_DATA",
    SetUserData = "SET_USER_DATA",
    SetAuthUserData = "SET_CURRENT_USER_DATA",
    SetCompaniesList = "SET_COMPANIES_LIST",
    SetFacilityTypes = "SET_FACILITY_TYPES",
    SetCountries = "SET_COUNTRIES",
    SetSports = "SET_SPORTS",
    SetUserGenders = "SET_USER_GENDERS",
    SetReportNames = "SET_REPORT_NAMES",
}

export enum ReportNames {
    CustomerDemographics = "CustomerDemographics"
}

export enum AgeRanges {
    belowTwelve = "(<12)",
    twelveToEighteen = "(12 - 18)",
    eighteenToTwentyFive = "(18 - 25)",
    twentyfiveToForty = "(25 - 40)",
    aboveForty = "(>40)",
}

export enum AgeRangesColors {
    belowTwelve = "#6fe3d9",
    twelveToEighteen = "#debc5f",
    eighteenToTwentyFive = "#4393c4",
    twentyfiveToForty = "#1f5401",
    aboveForty = "#965311",
}

export enum EntityType {
    Company = 'App\\Models\\Company',
}

export enum FormMode {
    Add = 'add',
    Edit = 'edit',
}

export enum NotificationActionButtons {
    ApproveBookingBtn = 'approve-booking-btn',
    DeclineBookingBtn = 'decline-booking-btn',
    FillSurveyBtn = 'fill-survey-btn',
    ViewBookingBtn = 'view-booking-btn'
}

export enum NotificationCategory {
    BookingRequest = 'BookingRequest',
    BookingResponse = 'BookingResponse',
    FillSurveyRequest = 'SurveyRequest',
    General = 'General'
}

export enum NotificationStatus {
    Pending = 'Pending',
    Sent = 'Sent',
    Opened = 'Opened'
}

export enum DashboardCardType {
    Company = 'Company',
    Ad = 'Ad'
}