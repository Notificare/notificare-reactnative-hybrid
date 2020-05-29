import React, { FC, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { Splash } from './containers/splash';
import { Theme } from '@react-navigation/native/lib/typescript/src/types';
import { Onboarding } from './containers/onboarding';
import { Home } from './containers/home';
import { Colors } from './lib/theme';
import { useNotificare } from './lib/notificare/hooks';
import { SignIn } from './containers/sign-in';
import { UserProfile } from './containers/user-profile';
import { SignUp } from './containers/sign-up';
import { ForgotPassword } from './containers/forgot-password';
import { ResetPassword } from './containers/reset-password';
import { UserProfilePreferencePicker } from './containers/user-profile-preference-picker';
import { ProtectedComponent } from './components/protected-component';
import { RootStackParamList, Routes } from './routes';
import { ThemeProvider } from 'react-native-elements';
import { MemberCard } from './containers/member-card';
import { ChangePassword } from './containers/change-password';
import { AccountValidation } from './containers/account-validation';
import { Analytics } from './containers/analytics';
import { Storage } from './containers/storage';
import { Inbox } from './containers/inbox';
import { Regions } from './containers/regions';
import { Beacons } from './containers/beacons';
import { Settings } from './containers/settings';
import { StatusBar } from 'react-native';

const RootStack = createStackNavigator<RootStackParamList>();

export const App: FC = () => {
  const notificare = useNotificare({
    onReady: async () => {
      console.log('Notificare is ready.');

      try {
        if (await notificare.isRemoteNotificationsEnabled()) {
          console.debug('Remote notifications are enabled. Registering for notifications...');
          notificare.registerForNotifications();
        }

        if (await notificare.isLocationServicesEnabled()) {
          console.debug('Location services are enabled. Start location updates & beacons...');
          notificare.startLocationUpdates();
          notificare.enableBeacons();
        }
      } catch (e) {
        console.log(`Well this was unexpected: ${e}`);
      }
    },
    onDeviceRegistered: () => console.log('Device is registered.'),
  });

  useEffect(() => {
    notificare.launch();
    return () => notificare.unmount();
  }, []);

  const theme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      ...DefaultTheme.colors,
      background: Colors.wildSand,
      primary: Colors.outerSpace,
    },
  };

  return (
    <ThemeProvider
      theme={{
        colors: {
          primary: Colors.outerSpace,
        },
      }}
    >
      <NavigationContainer theme={theme}>
        <StatusBar backgroundColor={Colors.outerSpace} barStyle="light-content" />

        <RootStack.Navigator
          initialRouteName={Routes.splash}
          screenOptions={{
            headerTintColor: 'white',
            headerStyle: { backgroundColor: Colors.outerSpace },
          }}
        >
          <RootStack.Screen name={Routes.splash} component={Splash} options={{ title: 'Splash', headerShown: false }} />
          <RootStack.Screen
            name={Routes.onboarding}
            component={Onboarding}
            options={{ title: 'Onboarding', headerShown: false }}
          />
          <RootStack.Screen name={Routes.home} component={Home} options={{ title: 'Home', headerShown: false }} />

          <RootStack.Screen name={Routes.signIn} component={SignIn} options={{ title: 'Sign in' }} />
          <RootStack.Screen name={Routes.signUp} component={SignUp} options={{ title: 'Sign up' }} />
          <RootStack.Screen
            name={Routes.forgotPassword}
            component={ForgotPassword}
            options={{ title: 'Forgotten password' }}
          />
          <RootStack.Screen
            name={Routes.resetPassword}
            component={ResetPassword}
            options={{ title: 'Reset password' }}
          />

          <RootStack.Screen name={Routes.profile} options={{ title: 'Profile' }}>
            {(props) => <ProtectedComponent component={UserProfile} {...props} />}
          </RootStack.Screen>

          <RootStack.Screen
            name={Routes.profilePreferencePicker}
            component={UserProfilePreferencePicker}
            options={({ route }) => ({ title: route.params.preference.preferenceLabel })}
          />

          <RootStack.Screen name={Routes.memberCard} options={{ title: 'Member Card' }}>
            {(props) => <ProtectedComponent component={MemberCard} {...props} />}
          </RootStack.Screen>

          <RootStack.Screen
            name={Routes.changePassword}
            component={ChangePassword}
            options={{ title: 'Change password' }}
          />

          <RootStack.Screen
            name={Routes.accountValidation}
            component={AccountValidation}
            options={{ title: 'Account' }}
          />

          <RootStack.Screen name={Routes.analytics} component={Analytics} options={{ title: 'Analytics' }} />

          <RootStack.Screen name={Routes.inbox} component={Inbox} options={{ title: 'Inbox' }} />

          <RootStack.Screen name={Routes.regions} component={Regions} options={{ title: 'Regions' }} />

          <RootStack.Screen name={Routes.storage} component={Storage} options={{ title: 'Storage' }} />

          <RootStack.Screen name={Routes.beacons} component={Beacons} options={{ title: 'Beacons' }} />

          <RootStack.Screen name={Routes.settings} component={Settings} options={{ title: 'Settings' }} />
        </RootStack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};
