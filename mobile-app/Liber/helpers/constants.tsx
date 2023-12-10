const Constants = {
    //apiUrl: 'http://192.168.0.105:81/api',
    //apiUrl: 'http://192.168.1.33:81/api', // Mohammad A. local server
     apiUrl: 'https://liber.quad-bh.com/api',
    //assetsUrl: 'http://192.168.0.105:81/storage',
    assetsUrl: 'https://liber.quad-bh.com/storage',
    imagesUrl: 'https://liber.quad-bh.com/files/images',
    //assetsUrl: 'http://192.168.1.107:81/storage', // Mohammad A. local server
    //imagesUrl: 'http://192.168.1.107:81/files/images', // Mohammad A. local server
    tokenKey: 'auth_token',
    userDataKey: 'user_data',
    companyDataKey: 'company_data',
    facilityTypesKey: 'facility_types',
    countriesKey: 'countries',
    oneSignalAppID:'c9163259-17f6-4cd0-b6c6-6d3a9241f1b4',
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
    UserProfile = "UserProfile",
    UserProfileForm = "UserProfileForm",
    Calendar = "Calendar",
    About = "About",
    ScheduleForm = "ScheduleForm",
    Signup = "Signup",
    Login = "Login",
    Search = "Search",
    UserBooking = "UserBooking",
    CompanyDetails = "CompanyDetails",
    ProgramManagmentTabs = "ProgramManagmentTabs",
    Reports = "Reports",
    Notifications = "Notifications",
    Ratings = "Ratings",
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