import { DeviceEventEmitter, EventEmitter, NativeEventEmitter, NativeModules, Platform } from 'react-native';
import {
  OnActivationTokenReceivedCallback,
  OnDeviceRegisteredCallback,
  OnReadyCallback,
  OnResetPasswordTokenReceivedCallback,
} from './events';
import {
  NotificareAsset,
  NotificareInboxItem,
  NotificareUser,
  NotificareUserPreference,
  NotificareUserSegment,
} from './models';

export class Notificare {
  private readonly notificareModule: NotificareModule;
  private readonly eventEmitter: EventEmitter;
  private listeners: Array<{ event: string; callback: (...args: any[]) => any }> = [];

  constructor() {
    switch (Platform.OS) {
      case 'android':
        this.notificareModule = NativeModules.NotificareReactNativeAndroid;
        this.eventEmitter = DeviceEventEmitter;
        break;
      case 'ios':
        this.notificareModule = NativeModules.NotificareReactNativeIOS;
        this.eventEmitter = new NativeEventEmitter(this.notificareModule);
        break;
      default:
        throw new Error(`Unsupported platform: ${Platform.OS}`);
    }
  }

  // region Public API

  launch() {
    this.notificareModule.launch();
  }

  unmount() {
    this.notificareModule.unmount();
    this.removeListeners();
  }

  addTag(tag: string): Promise<void> {
    return this.notificareModule.addTag(tag);
  }

  addTags(tags: string[]): Promise<void> {
    return this.notificareModule.addTags(tags);
  }

  fetchTags(): Promise<string[]> {
    return this.notificareModule.fetchTags();
  }

  fetchAssets(group: string): Promise<NotificareAsset[]> {
    return this.notificareModule.fetchAssets(group);
  }

  registerForNotifications(): void {
    this.notificareModule.registerForNotifications();
  }

  unregisterForNotifications(): void {
    this.notificareModule.unregisterForNotifications();
  }

  isLocationServicesEnabled(): Promise<boolean> {
    return this.notificareModule.isLocationServicesEnabled();
  }

  startLocationUpdates(): void {
    this.notificareModule.startLocationUpdates();
  }

  doCloudHostOperation(
    verb: HttpVerb,
    path: string,
    params?: Record<string, string>,
    headers?: Record<string, string>,
    body?: any,
  ): Promise<any> {
    return this.notificareModule.doCloudHostOperation(verb, path, params, headers, body);
  }

  isLoggedIn(): Promise<boolean> {
    return this.notificareModule.isLoggedIn();
  }

  login(email: string, password: string): Promise<void> {
    return this.notificareModule.login(email, password);
  }

  fetchAccountDetails(): Promise<NotificareUser> {
    return this.notificareModule.fetchAccountDetails();
  }

  fetchUserPreferences(): Promise<NotificareUserPreference[]> {
    return this.notificareModule.fetchUserPreferences();
  }

  createAccount(name: string, email: string, password: string): Promise<void> {
    return this.notificareModule.createAccount(email, name, password);
  }

  sendPassword(email: string): Promise<void> {
    return this.notificareModule.sendPassword(email);
  }

  resetPassword(token: string, password: string): Promise<void> {
    return this.notificareModule.resetPassword(token, password);
  }

  generateAccessToken(): Promise<NotificareUser> {
    return this.notificareModule.generateAccessToken();
  }

  logout(): Promise<void> {
    return this.notificareModule.logout();
  }

  addSegmentToUserPreference(segment: NotificareUserSegment, preference: NotificareUserPreference): Promise<void> {
    return this.notificareModule.addSegmentToUserPreference(segment, preference);
  }

  removeSegmentFromUserPreference(segment: NotificareUserSegment, preference: NotificareUserPreference): Promise<void> {
    return this.notificareModule.removeSegmentFromUserPreference(segment, preference);
  }

  changePassword(password: string): Promise<void> {
    return this.notificareModule.changePassword(password);
  }

  validateAccount(token: string): Promise<void> {
    return this.notificareModule.validateAccount(token);
  }

  logCustomEvent(event: string, data?: object): Promise<void> {
    return this.notificareModule.logCustomEvent(event, data ?? {});
  }

  fetchInbox(): Promise<NotificareInboxItem[]> {
    return this.notificareModule.fetchInbox();
  }

  presentInboxItem(item: NotificareInboxItem): void {
    this.notificareModule.presentInboxItem(item);
  }

  markAsRead(item: NotificareInboxItem): Promise<void> {
    return this.notificareModule.markAsRead(item);
  }

  clearInbox(): Promise<void> {
    return this.notificareModule.clearInbox();
  }

  // endregion

  // region Listeners

  listen(event: 'ready', callback: OnReadyCallback): void;

  listen(event: 'deviceRegistered', callback: OnDeviceRegisteredCallback): void;

  listen(event: 'activationTokenReceived', callback: OnActivationTokenReceivedCallback): void;

  listen(event: 'resetPasswordTokenReceived', callback: OnResetPasswordTokenReceivedCallback): void;

  listen(event: string, callback: (data: any) => void) {
    switch (Platform.OS) {
      case 'android':
      case 'ios':
        this.listeners.push({ event, callback });
        this.eventEmitter.addListener(event, callback);
        break;
      default:
        throw new Error(`Unsupported platform: ${Platform.OS}`);
    }
  }

  removeListeners() {
    this.listeners.forEach(({ event, callback }) => this.eventEmitter.removeListener(event, callback));
    this.listeners.splice(0, this.listeners.length);
  }

  // endregion
}

type NotificareModule =
  | typeof NativeModules.NotificareReactNativeAndroid
  | typeof NativeModules.NotificareReactNativeIOS;

type HttpVerb = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
