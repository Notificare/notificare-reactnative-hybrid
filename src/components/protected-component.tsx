import React, { ComponentType, FC } from 'react';
import { useNotificare } from '../lib/notificare/hooks';
import { useNetworkRequest } from '../lib/machines/network';
import { Loader } from './loader';
import { SignIn } from '../containers/sign-in';

export const ProtectedComponent: FC<ProtectedComponentProps> = (props) => {
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
  component: ComponentType<any>;
  navigation: any;
}
