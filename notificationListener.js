import firebase from 'react-native-firebase';

const CHANNEL_NOTIFICATIONS = {
  CHANNEL_ID: 'channel-id',
  CHANNEL_NAME: 'channel-name',
  CHANNEL_DESCRIPTION: 'channel/description',
};

// Triggered when a particular notification has been received in foreground
export const notificationListener = () =>
  firebase.notifications().onNotification(notification => {
    console.log('notification :>> ', notification);

    const {
      notifications: {
        Android: {
          Priority: {Max},
        },
      },
    } = firebase;
    notification.android.setChannelId(CHANNEL_NOTIFICATIONS.CHANNEL_ID);
    notification.android.setPriority(Max);
    notification.setData(notification.data);
    firebase.notifications().displayNotification(notification);
  });

// If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
export const notificationOpenedListener = () =>
  firebase.notifications().onNotificationOpened(notificationOpen => {
    console.log(' notificationOpenedListener :>> ', notificationOpen);
  });

// If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
export const notificationOpen = async () => {
  await firebase.notifications().getInitialNotification();
  if (notificationOpen) {
    console.log(' notificationOpenBackListener :>> ', notificationOpen);
  }
};

// Triggered for data only payload in foreground
export const messageListener = () =>
  firebase.messaging().onMessage(message => {
    console.log('messageListener :>> ', JSON.stringify(message));
  });

// create a new channel
export const createChannel = () => {
  const channel = new firebase.notifications.Android.Channel(
    CHANNEL_NOTIFICATIONS.CHANNEL_ID,
    CHANNEL_NOTIFICATIONS.CHANNEL_NAME,
    firebase.notifications.Android.Importance.Max,
  ).setDescription(CHANNEL_NOTIFICATIONS.CHANNEL_DESCRIPTION);
  firebase.notifications().android.createChannel(channel);
};
