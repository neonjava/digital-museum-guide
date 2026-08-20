import { Capacitor } from '@capacitor/core';

export const isNativeApp = (): boolean => {
  return Capacitor.isNativePlatform();
};

export const getPlatformName = (): 'android' | 'ios' | 'web' => {
  return Capacitor.getPlatform() as 'android' | 'ios' | 'web';
};
