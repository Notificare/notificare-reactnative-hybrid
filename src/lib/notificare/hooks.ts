import { useEffect, useState } from 'react';
import { Notificare } from './index';
import {
  OnActivationTokenReceivedCallback,
  OnBadgeUpdatedCallback,
  OnDeviceRegisteredCallback,
  OnInboxLoadedCallback,
  OnReadyCallback,
  OnResetPasswordTokenReceivedCallback,
} from './events';

export const useNotificare: UseNotificareHook = (listeners) => {
  const [notificare] = useState<Notificare>(new Notificare());

  useEffect(() => {
    if (listeners?.onReady) notificare.listen('ready', listeners.onReady);
    if (listeners?.onDeviceRegistered) notificare.listen('deviceRegistered', listeners.onDeviceRegistered);
    if (listeners?.onActivationTokenReceived)
      notificare.listen('activationTokenReceived', listeners.onActivationTokenReceived);
    if (listeners?.onResetPasswordTokenReceived)
      notificare.listen('resetPasswordTokenReceived', listeners?.onResetPasswordTokenReceived);
    if (listeners?.onInboxLoaded) notificare.listen('inboxLoaded', listeners?.onInboxLoaded);
    if (listeners?.onBadgeUpdated) notificare.listen('badgeUpdated', listeners?.onBadgeUpdated);

    return () => notificare.removeListeners();
  }, []);

  return notificare;
};

type UseNotificareHook = (listeners?: NotificareListeners) => Notificare;

interface NotificareListeners {
  onReady?: OnReadyCallback;
  onDeviceRegistered?: OnDeviceRegisteredCallback;
  onActivationTokenReceived?: OnActivationTokenReceivedCallback;
  onResetPasswordTokenReceived?: OnResetPasswordTokenReceivedCallback;
  onInboxLoaded?: OnInboxLoadedCallback;
  onBadgeUpdated?: OnBadgeUpdatedCallback;
}
