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
import { SignUp } from './containers/sign-up';

const Stack = createStackNavigator();

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
    <NavigationContainer theme={theme}>
      <Stack.Navigator initialRouteName="splash">
        <Stack.Screen name="splash" component={Splash} options={{ title: 'Splash', headerShown: false }} />
        <Stack.Screen name="onboarding" component={Onboarding} options={{ title: 'Onboarding', headerShown: false }} />
        <Stack.Screen name="home" component={Home} options={{ title: 'Home', headerShown: false }} />

        <Stack.Screen name="signin" component={SignIn} options={{ title: 'Sign in' }} />
        <Stack.Screen name="signup" component={SignUp} options={{ title: 'Sign up' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
