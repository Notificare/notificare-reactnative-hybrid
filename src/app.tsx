import React, { FC } from 'react';
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

const RootStack = createStackNavigator<RootStackParamList>();

export const App: FC = () => {
  useNotificare({
    onReady: () => console.log('Notificare is ready.'),
    onDeviceRegistered: () => console.log('Device is registered.'),
  });

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
    <ThemeProvider>
      <NavigationContainer theme={theme}>
        <RootStack.Navigator initialRouteName={Routes.splash}>
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
        </RootStack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};
