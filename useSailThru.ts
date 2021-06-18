import { useEffect } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { handleNotification } from './sailThru';

var SailthruMobile = require('react-native-sailthru-mobile');

export default function useSailThru() {
  useEffect(() => {
    const sailthruIntegrationEmitter = new NativeEventEmitter(NativeModules.SailThruIntegration);
    const eventListener = sailthruIntegrationEmitter.addListener('notificationReceived', event => {
      console.log('notificationReceived => ', event);
    });
    return () => {
      eventListener.remove();
    };
  }, []);

  useEffect(() => {
    const sailthruIntegrationEmitter = new NativeEventEmitter(NativeModules.SailThruIntegration);
    const eventListener = sailthruIntegrationEmitter.addListener('notificationTapped', message => {
      console.log('notificationTapped => ', message);
      SailthruMobile.presentMessageDetail(message);
    });
    return () => {
      eventListener.remove();
    };
  }, []);

  useEffect(() => {
    const sailthruEmitter = new NativeEventEmitter(SailthruMobile);
    const eventListener = sailthruEmitter.addListener('inappnotification', event => {
      console.log('evento sailthruEmitter => ', event);
    });
    return () => {
      eventListener.remove();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      handleNotification(remoteMessage);
    });
    return unsubscribe;
  }, []);
}
