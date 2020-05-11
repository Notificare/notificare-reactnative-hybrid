import React, { ComponentType, FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { Splash } from './containers/splash';
import { Theme } from '@react-navigation/native/lib/typescript/src/types';
import { Onboarding } from './containers/onboarding';
import { Home } from './containers/home';
import { Colors } from './lib/theme';
import { useNotificare } from './lib/notificare/hooks';
import { SignIn } from './containers/sign-in';
import { useNetworkRequest } from './lib/machines/network';
import { Loader } from './components/loader';
import { UserProfile } from './containers/user-profile';
import { SignUp } from './containers/sign-up';
import { ForgotPassword } from './containers/forgot-password';
import { ResetPassword } from './containers/reset-password';

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
        <Stack.Screen name="forgotpassword" component={ForgotPassword} options={{ title: 'Forgotten password' }} />
        <Stack.Screen name="resetpassword" component={ResetPassword} options={{ title: 'Reset password' }} />

        <Stack.Screen name="profile" options={{ title: 'Profile' }}>
          {(props) => <ProtectedComponent component={UserProfile} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const ProtectedComponent: FC<ProtectedComponentProps> = (props) => {
  const notificare = useNotificare();
  const [state] = useNetworkRequest(() => notificare.isLoggedIn(), { autoStart: true });

  const { component: Component, ...others } = props;
  const { navigation } = props;

  if (state.status === 'idle' || state.status === 'pending') {
    navigation.setOptions({
      headerShown: false,
    });

    return <Loader />;
  }

  if (state.status === 'successful') {
    if (state.result) {
      navigation.setOptions({
        headerShown: true,
      });

      return <Component {...others} />;
    } else {
      navigation.setOptions({
        headerShown: true,
        title: 'Sign in',
      });

      return <SignIn />;
    }
  }

  return null;
};

interface ProtectedComponentProps {
  component: ComponentType;
  navigation: any;
}
