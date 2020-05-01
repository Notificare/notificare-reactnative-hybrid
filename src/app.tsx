import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { Splash } from './containers/splash';
import { Theme } from '@react-navigation/native/lib/typescript/src/types';

const Stack = createStackNavigator();

export const App: FC = () => {
  const theme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      ...DefaultTheme.colors,
      background: '#F6F6F6', // wild sand
      primary: '#232C2A', // outer space
    },
  };

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator initialRouteName="splash">
        <Stack.Screen name="splash" component={Splash} options={{ title: 'Splash', headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
