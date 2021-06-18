import messaging from '@react-native-firebase/messaging';

const getFcmToken = async () => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    console.log('Your Firebase Token is:', fcmToken);
    return fcmToken;
  }
  console.log('Failed', 'No token received');
  return 'opps';
};

export const checkApplicationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
    console.log('Authorization status:', authStatus);
    return getFcmToken(); //<---- Add this
  }
};
