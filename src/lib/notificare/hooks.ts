import { useEffect, useState } from 'react';
import { Notificare } from './index';
import { OnDeviceRegisteredCallback, OnReadyCallback } from './events';

export const useNotificare: UseNotificareHook = (listeners) => {
  const [notificare] = useState<Notificare>(new Notificare());

  if (listeners?.onReady) notificare.listen('ready', listeners.onReady);
  if (listeners?.onDeviceRegistered) notificare.listen('deviceRegistered', listeners.onDeviceRegistered);

  useEffect(() => {
    notificare.launch();

    return () => {
      notificare.unmount();
    };
  }, []);

  return notificare;
};

type UseNotificareHook = (listeners?: NotificareListeners) => Notificare;

interface NotificareListeners {
  onReady?: OnReadyCallback;
  onDeviceRegistered?: OnDeviceRegisteredCallback;
}
