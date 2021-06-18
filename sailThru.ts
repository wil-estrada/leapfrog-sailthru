import { NativeModules } from 'react-native';
const { SailThruIntegration } = NativeModules;
var SailthruMobile = require('react-native-sailthru-mobile');

export async function collectingUserData({ userId, email, extId }) {
  try {
    await SailthruMobile.setUserId(userId);
    await SailthruMobile.setUserEmail(email);
    await SailthruMobile.setUserId(userId);
    const attrMap = new SailthruMobile.AttributeMap();
    attrMap.setString('extId', extId);
    await SailthruMobile.setAttributes(attrMap);
  } catch (error) {
    console.log('[SailThru] Error Colleting User Data ', error);
  }
}

export async function getMessages() {
  try {
    return await SailthruMobile.getMessages();
  } catch (error) {
    console.log('[SailThru] Error Getting Messages ', error);
  }
}

export function markMessageAsRead(message) {
  SailthruMobile.markMessageAsRead(message);
}

export async function setDeviceToken(token) {
  console.log('token firebase :>> ', token);
  SailThruIntegration.setDeviceToken(token);
}

export async function getDeviceId() {
  try {
    return await SailthruMobile.getDeviceId();
  } catch (error) {
    console.log('[SailThru] Error Getting Device ID ', error);
  }
}

export function handleNotification(remoteMessage) {
  SailThruIntegration.handleNotification(JSON.stringify(remoteMessage), error => {
    if (error) {
      console.log('[SailThru] handleNotification error', { error });
    }
  });
}
