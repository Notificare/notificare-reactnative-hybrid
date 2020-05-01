export interface NotificareApplicationInfo {
  id: string;
  inboxConfig: {
    autoBadge: boolean;
    useInbox: boolean;
  };
  name: string;
  regionConfig: {
    proximityUUID: string;
  };
  services: {
    apns: boolean;
    appsOnDemand: boolean;
    automation: boolean;
    email: boolean;
    gcm: boolean;
    inAppPurchase: boolean;
    inbox: boolean;
    liveApi: boolean;
    locationServices: boolean;
    oauth2: boolean;
    passbook: boolean;
    reports: boolean;
    richPush: boolean;
    screens: boolean;
    sms: boolean;
    storage: boolean;
    triggers: boolean;
    websitePush: boolean;
    websockets: boolean;
  };
  userDataFields: [{ key: string; label: string }];
}

export interface NotificareAsset {
  assetTitle?: string;
  assetDescription?: string;
  assetUrl?: string;

  assetMetaData?: {
    originalFileName?: string;
    key?: string;
    contentType?: string;
    contentLength?: string;
  };

  assetButton?: {
    label?: string;
    action?: string;
  };
}
