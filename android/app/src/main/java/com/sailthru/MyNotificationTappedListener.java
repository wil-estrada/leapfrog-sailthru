package com.sailthru;

import android.content.Context;
import android.os.Bundle;
import com.sailthru.mobile.sdk.interfaces.NotificationTappedListener;

public class MyNotificationTappedListener implements NotificationTappedListener {

    @Override
    public void onNotificationTapped(Context context, Bundle bundle) {
        SailThruIntegration.sendEvent("notificationTapped", bundle);
    }
}
