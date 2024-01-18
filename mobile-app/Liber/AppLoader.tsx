
import React, { useEffect, useState } from 'react';
import {
    StatusBar,
    StyleSheet,
    View,
    useColorScheme,
} from 'react-native';

import {
    Colors
} from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from './AuhtContext';
import LoginScreen from './src/login/login';
import Signup from './src/login/signup';
import FooterBar from './src/navigators/footerBar';
import AppNavigator from './src/navigators/appNavigator';
import ForgetPassword from './src/login/forget-password';
import globalStyles from './styles/styles';
import { Image } from 'react-native-elements';


function AppLoader(): JSX.Element {
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);

    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        flex: 1
    };

    useEffect(() => {
        // Perform any asynchronous authentication check here
        // Once the authentication status is determined, update the loading state
        // For example, you might have an asynchronous function like checkAuthenticationStatus

        const checkAuthenticationStatus = async () => {
            // Simulating an asynchronous authentication check
            await new Promise(resolve => setTimeout(resolve, 500)); // Replace this with your actual authentication check
            setLoading(false);
        };

        checkAuthenticationStatus();
    }, []); // Run this effect only once when the component mounts

    const Stack = createStackNavigator();

    return (
        <NavigationContainer>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            {
                loading ?

                    <View style={styles.container}>
                        <Image
                            source={require('./assets/images/liber_logo.png')}
                            style={styles.image}
                        />
                    </View>
                    :
                    (isAuthenticated ?
                        <>
                            <AppNavigator />
                            <FooterBar />
                        </>
                        :

                        <Stack.Navigator
                            initialRouteName="Login"
                        >
                            <Stack.Screen name="Login" options={{ title: 'Login' }} component={LoginScreen} />
                            <Stack.Screen name="Signup" options={{ title: 'Signup' }} component={Signup} />
                            <Stack.Screen name="ForgetPassword" options={{ title: 'Forgot Your Password?' }} component={ForgetPassword} />
                        </Stack.Navigator>
                    )
            }
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.containerView,
        justifyContent: 'center',
    },
    image: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
})

export default AppLoader;
