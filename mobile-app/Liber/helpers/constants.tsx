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
    Calendar = "Calendar",
    About = "About",
    ScheduleForm = "ScheduleForm",
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
    ProfileMenu = "ProfileMenu",
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
}

export enum EntityType {
    Company = 'App\\Models\\Company',
}
