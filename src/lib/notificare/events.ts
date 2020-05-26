import { NotificareApplicationInfo, NotificareInboxItem } from './models';

export type OnReadyCallback = (applicationInfo: NotificareApplicationInfo) => void;

export type OnDeviceRegisteredCallback = (device: unknown) => void;

export type OnActivationTokenReceivedCallback = (data: { token: string }) => void;

export type OnResetPasswordTokenReceivedCallback = (data: { token: string }) => void;

export type OnInboxLoadedCallback = (inbox: NotificareInboxItem[]) => void;
