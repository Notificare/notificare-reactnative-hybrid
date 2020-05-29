import { useEffect, useState } from 'react';
import { Notificare } from './index';
import {
  OnActivationTokenReceivedCallback,
  OnBadgeUpdatedCallback,
  OnBeaconsInRangeForRegionCallback,
  OnDeviceRegisteredCallback,
  OnInboxLoadedCallback,
  OnNotificationSettingsChangedCallback,
  OnReadyCallback,
  OnResetPasswordTokenReceivedCallback,
  OnScannableDetectedCallback,
  OnScannableSessionInvalidatedWithErrorCallback,
  OnUrlOpenedCallback,
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
    if (listeners?.onScannableDetected) notificare.listen('scannableDetected', listeners?.onScannableDetected);
    if (listeners?.onScannableSessionInvalidatedWithError)
      notificare.listen('scannableSessionInvalidatedWithError', listeners?.onScannableSessionInvalidatedWithError);
    if (listeners?.onUrlOpened) notificare.listen('urlOpened', listeners?.onUrlOpened);
    if (listeners?.onBeaconsInRangeForRegion)
      notificare.listen('beaconsInRangeForRegion', listeners?.onBeaconsInRangeForRegion);
    if (listeners?.onNotificationSettingsChanged)
      notificare.listen('notificationSettingsChanged', listeners?.onNotificationSettingsChanged);

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
  onScannableDetected?: OnScannableDetectedCallback;
  onScannableSessionInvalidatedWithError?: OnScannableSessionInvalidatedWithErrorCallback;
  onUrlOpened?: OnUrlOpenedCallback;
  onBeaconsInRangeForRegion?: OnBeaconsInRangeForRegionCallback;
  onNotificationSettingsChanged?: OnNotificationSettingsChangedCallback;
}
