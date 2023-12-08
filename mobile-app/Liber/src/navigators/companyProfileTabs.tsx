import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CompanyProfile from '../company/companyProfile';
import Facilities from '../facilities/facilities';
import colors from '../../styles/colors';
import { Calendar } from 'react-native-calendars';
import AgendaScreen from '../calendar/calendar';
import { Screens } from '../../helpers/constants';

const Tab = createMaterialTopTabNavigator();

export default function companyProfileTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarIndicatorStyle: {
                    borderBottomWidth: 3,
                    borderBottomColor: colors.PrimaryGreen,
                },
            }}>
            <Tab.Screen name={Screens.CompanyProfile} options={{ title: 'Profile' }} component={CompanyProfile} />
            <Tab.Screen name={Screens.Facilities} options={{ title: 'User Booking' }} component={Facilities} />
            <Tab.Screen name={Screens.Calendar} options={{ title: 'Calendar' }} component={AgendaScreen} />
        </Tab.Navigator>
    );
}