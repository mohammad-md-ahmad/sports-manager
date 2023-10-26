const Constants = {
    //apiUrl: 'http://192.168.0.105:81/api',
    apiUrl: 'http://192.168.1.107:81/api', // Mohammad A. local server
    // apiUrl: 'https://liber.quad-bh.com/api',
    //assetsUrl: 'http://192.168.0.105:81/storage',
    // assetsUrl: 'https://liber.quad-bh.com/storage',
    // imagesUrl: 'https://liber.quad-bh.com/files/images',
    assetsUrl: 'http://192.168.1.107:81/storage', // Mohammad A. local server
    imagesUrl: 'http://192.168.1.107:81/files/images', // Mohammad A. local server
    tokenKey: 'auth_token',
    userDataKey: 'user_data',
    companyDataKey: 'company_data',
    facilityTypesKey: 'facility_types',
    countriesKey: 'countries',
};

export default Constants;


export enum UserType {
    CompanyUser = "COMPANY_USER",
    CustomerUser = "CUSTOMER_USER",
}

export enum Screens {
    Dashboard = "Dashboard",
    Facilities = "Facilities",
    FacilityForm = "FacilityForm",
    CompanyProfile = "CompanyProfile",
    CompanyProfileForm = "CompanyProfileForm",
    UserProfile = "UserProfile",
    UserProfileForm = "UserProfileForm",
    Calendar = "Calendar",
    About = "About",
    Signup = "Signup",
    Login = "Login",
}