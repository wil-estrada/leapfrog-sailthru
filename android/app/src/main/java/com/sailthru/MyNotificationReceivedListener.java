package com.sailthru;

import android.content.Context;
import android.os.Bundle;

import com.sailthru.mobile.sdk.interfaces.NotificationReceivedListener;

public class MyNotificationReceivedListener implements NotificationReceivedListener {

    @Override
    public void onNotificationReceived(Context context, Bundle bundle) {
        SailThruIntegration.sendEvent("notificationReceived", bundle);
    }
}
