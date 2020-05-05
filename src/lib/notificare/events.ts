import { NotificareApplicationInfo } from './models';

export type OnReadyCallback = (applicationInfo: NotificareApplicationInfo) => void;

export type OnDeviceRegisteredCallback = (device: unknown) => void;
