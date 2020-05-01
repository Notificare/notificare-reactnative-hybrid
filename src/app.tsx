import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { Splash } from './containers/splash';
import { Theme } from '@react-navigation/native/lib/typescript/src/types';
import { Onboarding } from './containers/onboarding';
import { Home } from './containers/home';
import { Colors } from './theme';

const Stack = createStackNavigator();

export const App: FC = () => {
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
        <Stack.Screen name="home" component={Home} options={{ title: 'Home' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
