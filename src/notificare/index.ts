import { DeviceEventEmitter, EventEmitter, NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { OnDeviceRegisteredCallback, OnReadyCallback } from './events';
import { NotificareAsset } from './models';

export class Notificare {
  private readonly notificareModule: NotificareModule;
  private readonly eventEmitter: EventEmitter;

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
    this.eventEmitter.removeAllListeners();
    //
    // switch (Platform.OS) {
    //   case 'android':
    //     DeviceEventEmitter.removeAllListeners();
    //     break;
    //   case 'ios':
    //     // Not needed for iOS.
    //     break;
    //   default:
    //     throw new Error(`Unsupported platform: ${Platform.OS}`);
    // }
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

  // endregion

  // region Listeners

  listen(event: 'ready', callback: OnReadyCallback): void;

  listen(event: 'deviceRegistered', callback: OnDeviceRegisteredCallback): void;

  listen(event: string, callback: (data: any) => void) {
    switch (Platform.OS) {
      case 'android':
        DeviceEventEmitter.addListener(event, callback);
        break;
      case 'ios':
        this.eventEmitter?.addListener(event, callback);
        break;
      default:
        throw new Error(`Unsupported platform: ${Platform.OS}`);
    }
  }

  // endregion
}

type NotificareModule =
  | typeof NativeModules.NotificareReactNativeAndroid
  | typeof NativeModules.NotificareReactNativeIOS;
