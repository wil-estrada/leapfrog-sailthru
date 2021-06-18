package com.sailthru;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;
import android.os.Bundle;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.firebase.messaging.RemoteMessage;
import com.sailthru.mobile.sdk.MessageStream;
import com.sailthru.mobile.sdk.NotificationConfig;
import com.sailthru.mobile.sdk.SailthruMobile;
import com.sailthru.mobile.sdk.enums.ImpressionType;
import com.sailthru.mobile.sdk.model.Message;

import org.jetbrains.annotations.NotNull;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Iterator;

public class SailThruIntegration extends ReactContextBaseJavaModule {

    private static ReactApplicationContext reactContext;
    protected static final String FILTER_ATTRIBUTE_KEY = "NEW_ON_MAX";
    MessageStream messageStream = new MessageStream();

    @RequiresApi(api = Build.VERSION_CODES.O)
    SailThruIntegration(ReactApplicationContext context) {
        super(context);
        reactContext = context;

        NotificationConfig config = new NotificationConfig();
        NotificationChannel channel = new NotificationChannel("notifications", "Sailthru Mobile Notifications", NotificationManager.IMPORTANCE_HIGH);
        config.setDefaultNotificationChannel(channel);
        SailthruMobile sailthruMobile = new SailthruMobile();
        sailthruMobile.setNotificationConfig(config);
        sailthruMobile.startEngine(getReactApplicationContext(), "fa89ad657fd3e6002082467b97445b9b7f04d571");
        sailthruMobile.addNotificationTappedListener(new MyNotificationTappedListener());
        sailthruMobile.addNotificationReceivedListener(new MyNotificationReceivedListener());
    }

    @Override
    public String getName() {
        return "SailThruIntegration";
    }

    @ReactMethod
    public void setDeviceToken(String token) {  
      new SailthruMobile().setDeviceToken(token);
    }

    @ReactMethod
    public void handleNotification(String remoteMessageStr, Callback callback) {
        try {
            RemoteMessage rm = getRemoteMessage(remoteMessageStr);
            SailthruMobile sailthruMobile = new SailthruMobile();
            sailthruMobile.handleNotification(rm);
            callback.invoke(null, rm.toString());
        } catch (Exception e) {
            String exceptionDescription = ExceptionToString(e);
            callback.invoke(exceptionDescription, remoteMessageStr);
        }
    }

    // TODO move to a common place we can reuse
    private String ExceptionToString(Exception e) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        e.printStackTrace(pw);
        return sw.toString();
    }

    private static RemoteMessage getRemoteMessage(String remoteMessageStr) throws JSONException {
        JSONObject json = new JSONObject(remoteMessageStr);
        RemoteMessage.Builder builder = new RemoteMessage.Builder("bogusDestination@gcm.googleapis.com");
        builder.setCollapseKey(json.getString("collapseKey"));
        builder.setTtl(json.getInt("ttl"));
        builder.setMessageId(json.getString("messageId"));

        JSONObject data = json.getJSONObject("data");
        Iterator<String> keys = data.keys();
        while (keys.hasNext()) {
            String key = keys.next();
            String value = data.getString(key);
            builder.addData(key, value);
        }
        return builder.build();
    }

    public static void sendEvent(String eventName, Bundle bundle) {
        WritableMap params = Arguments.fromBundle(bundle);
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }
}
