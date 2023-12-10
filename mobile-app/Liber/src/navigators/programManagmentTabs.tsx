import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CompanyProfile from '../company/companyProfile';
import Facilities from '../facilities/facilities';
import colors from '../../styles/colors';
import { Calendar } from 'react-native-calendars';
import AgendaScreen from '../calendar/calendar';
import { Screens } from '../../helpers/constants';
import Notifications from '../notifications/notifications';
import Reports from '../reports/reports';

const Tab = createMaterialTopTabNavigator();

export default function ProgramManagmentTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarIndicatorStyle: {
                    borderBottomWidth: 3,
                    borderBottomColor: colors.PrimaryGreen,
                },
            }}>
            <Tab.Screen name={Screens.Reports} options={{ title: 'Reports' }} component={Reports} />
            <Tab.Screen name={Screens.Notifications} options={{ title: 'Notifications' }} component={Notifications} />
        </Tab.Navigator>
    );
}