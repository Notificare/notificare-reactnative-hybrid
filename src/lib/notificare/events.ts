import { NotificareApplicationInfo, NotificareBeacon, NotificareInboxItem, NotificareScannable } from './models';

export type OnReadyCallback = (applicationInfo: NotificareApplicationInfo) => void;

export type OnDeviceRegisteredCallback = (device: unknown) => void;

export type OnActivationTokenReceivedCallback = (data: { token: string }) => void;

export type OnResetPasswordTokenReceivedCallback = (data: { token: string }) => void;

export type OnInboxLoadedCallback = (inbox: NotificareInboxItem[]) => void;

export type OnBadgeUpdatedCallback = (unreadCount: number) => void;

export type OnScannableDetectedCallback = (scannable: NotificareScannable) => void;

export type OnScannableSessionInvalidatedWithErrorCallback = (data: { error: string }) => void;

export type OnUrlOpenedCallback = (data: { url: string; options: object }) => void;

export type OnBeaconsInRangeForRegionCallback = (data: { beacons: NotificareBeacon[] }) => void;
