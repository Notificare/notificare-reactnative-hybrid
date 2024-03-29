import { DeviceEventEmitter, EventEmitter, NativeEventEmitter, NativeModules, Platform } from 'react-native';
import {
  OnActivationTokenReceivedCallback,
  OnBadgeUpdatedCallback,
  OnBeaconsInRangeForRegionCallback,
  OnDeviceRegisteredCallback,
  OnInboxLoadedCallback,
  OnNotificationReceivedInBackgroundCallback,
  OnReadyCallback,
  OnResetPasswordTokenReceivedCallback,
  OnScannableDetectedCallback,
  OnScannableSessionInvalidatedWithErrorCallback,
  OnUrlOpenedCallback,
} from './events';
import {
  NotificareAsset,
  NotificareDeviceDnD,
  NotificareInboxItem,
  NotificareNotification,
  NotificareScannable,
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
    if (Platform.OS === 'android') {
      this.notificareModule.unmount();
    }

    this.removeListeners();
  }

  addTag(tag: string): Promise<void> {
    return this.notificareModule.addTag(tag);
  }

  addTags(tags: string[]): Promise<void> {
    return this.notificareModule.addTags(tags);
  }

  removeTag(tag: string): Promise<void> {
    return this.notificareModule.removeTag(tag);
  }

  fetchTags(): Promise<string[]> {
    return this.notificareModule.fetchTags();
  }

  fetchAssets(group: string): Promise<NotificareAsset[]> {
    return this.notificareModule.fetchAssets(group);
  }

  isRemoteNotificationsEnabled(): Promise<boolean> {
    return this.notificareModule.isRemoteNotificationsEnabled();
  }

  isAllowedUIEnabled(): Promise<boolean> {
    return this.notificareModule.isAllowedUIEnabled();
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

  stopLocationUpdates(): void {
    this.notificareModule.stopLocationUpdates();
  }

  enableBeacons(): void {
    this.notificareModule.enableBeacons();
  }

  disableBeacons(): void {
    this.notificareModule.disableBeacons();
  }

  fetchDoNotDisturb(): Promise<NotificareDeviceDnD | undefined> {
    return this.notificareModule.fetchDoNotDisturb();
  }

  updateDoNotDisturb(dnd: Required<NotificareDeviceDnD>): Promise<NotificareDeviceDnD> {
    return this.notificareModule.updateDoNotDisturb(dnd);
  }

  clearDoNotDisturb(): Promise<void> {
    return this.notificareModule.clearDoNotDisturb();
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

  presentNotification(notification: NotificareNotification): void {
    this.notificareModule.presentNotification(notification);
  }

  presentInboxItem(item: NotificareInboxItem): void {
    this.notificareModule.presentInboxItem(item);
  }

  markAsRead(item: NotificareInboxItem): Promise<void> {
    return this.notificareModule.markAsRead(item);
  }

  markAllAsRead(): Promise<void> {
    return this.notificareModule.markAllAsRead();
  }

  requestAlwaysAuthorizationForLocationUpdates(): void {
    return this.notificareModule.requestAlwaysAuthorizationForLocationUpdates();
  }

  requestTemporaryFullAccuracyAuthorization(purposeKey: string): void {
    this.notificareModule.requestTemporaryFullAccuracyAuthorization(purposeKey);
  }

  removeFromInbox(item: NotificareInboxItem): Promise<void> {
    return this.notificareModule.removeFromInbox(item);
  }

  clearInbox(): Promise<void> {
    return this.notificareModule.clearInbox();
  }

  startScannableSession(): void {
    this.notificareModule.startScannableSession();
  }

  presentScannable(scannable: NotificareScannable): void {
    this.notificareModule.presentScannable(scannable);
  }

  fetchLink(url: string): Promise<string> {
    return this.notificareModule.fetchLink(url);
  }

  // endregion

  // region Listeners

  listen(event: 'ready', callback: OnReadyCallback): void;

  listen(event: 'deviceRegistered', callback: OnDeviceRegisteredCallback): void;

  listen(event: 'activationTokenReceived', callback: OnActivationTokenReceivedCallback): void;

  listen(event: 'resetPasswordTokenReceived', callback: OnResetPasswordTokenReceivedCallback): void;

  listen(event: 'inboxLoaded', callback: OnInboxLoadedCallback): void;

  listen(event: 'badgeUpdated', callback: OnBadgeUpdatedCallback): void;

  listen(event: 'scannableDetected', callback: OnScannableDetectedCallback): void;

  listen(event: 'scannableSessionInvalidatedWithError', callback: OnScannableSessionInvalidatedWithErrorCallback): void;

  listen(event: 'urlOpened', callback: OnUrlOpenedCallback): void;

  listen(event: 'beaconsInRangeForRegion', callback: OnBeaconsInRangeForRegionCallback): void;

  listen(event: 'notificationSettingsChanged', callback: OnBeaconsInRangeForRegionCallback): void;

  listen(event: 'remoteNotificationReceivedInBackground', callback: OnNotificationReceivedInBackgroundCallback): void;

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
