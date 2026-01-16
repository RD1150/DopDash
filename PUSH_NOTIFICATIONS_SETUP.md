# Dopamine Dasher - Push Notifications Setup Guide

## Overview

Push notifications keep users engaged by sending daily reminders, contest updates, and achievement celebrations. This guide covers setting up Firebase Cloud Messaging (FCM) for Android and Apple Push Notification (APN) for iOS.

## Part 1: Install Capacitor Push Plugin

```bash
cd /home/ubuntu/dopamine_dasher

# Install push plugin
pnpm add @capacitor/push-notifications

# Sync with native projects
npx cap sync
```

## Part 2: Firebase Cloud Messaging (Android)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Create a project**
3. Name: `Dopamine Dasher`
4. Accept terms and create

### Step 2: Add Android App

1. Click **Add app** → **Android**
2. **Package name**: `com.Reena.DopamineDasher`
3. **App nickname**: Dopamine Dasher
4. Download `google-services.json`
5. Place in `android/app/`

### Step 3: Get Server Key

1. Go to **Project Settings** (gear icon)
2. Click **Cloud Messaging** tab
3. Copy **Server API Key**
4. Save for later use

### Step 4: Configure Android Project

Edit `android/app/build.gradle`:

```gradle
dependencies {
    implementation 'com.google.firebase:firebase-messaging:23.2.1'
}

apply plugin: 'com.google.gms.google-services'
```

Edit `android/build.gradle`:

```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.3.15'
    }
}
```

## Part 3: Apple Push Notification (iOS)

### Step 1: Create APN Certificate

1. Go to [Apple Developer](https://developer.apple.com)
2. Go to **Certificates, Identifiers & Profiles**
3. Click **Identifiers**
4. Select your App ID: `com.Reena.DopamineDasher`
5. Enable **Push Notifications**
6. Click **Configure**
7. Create certificate:
   - Click **Create Certificate**
   - Upload Certificate Signing Request (CSR)
   - Download certificate
   - Install in Keychain

### Step 2: Export Certificate

1. Open **Keychain Access**
2. Find your push certificate
3. Right-click → **Export**
4. Save as `push.p8`
5. Remember the password

### Step 3: Upload to App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app
3. Go to **Certificates, Identifiers & Profiles**
4. Upload your push certificate

## Part 4: Backend Integration

### Add Push Notification Procedures

Create `server/notifications.ts`:

```typescript
import { publicProcedure, protectedProcedure, router } from "./trpc";
import { z } from "zod";
import { db } from "./db";
import { pushTokens } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const notificationsRouter = router({
  // Register device for push notifications
  registerPushToken: protectedProcedure
    .input(z.object({
      token: z.string(),
      platform: z.enum(["ios", "android"]),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.insert(pushTokens).values({
        userId: ctx.user.id,
        token: input.token,
        platform: input.platform,
        createdAt: new Date(),
      }).onConflictDoUpdate({
        target: [pushTokens.token],
        set: { userId: ctx.user.id },
      });

      return { success: true };
    }),

  // Remove push token (when user logs out)
  unregisterPushToken: protectedProcedure
    .input(z.object({
      token: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.delete(pushTokens).where(eq(pushTokens.token, input.token));
      return { success: true };
    }),

  // Send test notification
  sendTestNotification: protectedProcedure
    .mutation(async ({ ctx }) => {
      const userTokens = await db.query.pushTokens.findMany({
        where: eq(pushTokens.userId, ctx.user.id),
      });

      for (const pushToken of userTokens) {
        await sendPushNotification({
          token: pushToken.token,
          title: "Dopamine Dasher",
          body: "Test notification - you're awesome!",
          platform: pushToken.platform,
        });
      }

      return { success: true, sent: userTokens.length };
    }),
});

// Helper function to send push notifications
export async function sendPushNotification({
  token,
  title,
  body,
  platform,
}: {
  token: string;
  title: string;
  body: string;
  platform: "ios" | "android";
}) {
  if (platform === "android") {
    // Send via Firebase Cloud Messaging
    const response = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `key=${process.env.FCM_SERVER_KEY}`,
      },
      body: JSON.stringify({
        to: token,
        notification: {
          title,
          body,
          sound: "default",
          click_action: "FLUTTER_NOTIFICATION_CLICK",
        },
        data: {
          click_action: "FLUTTER_NOTIFICATION_CLICK",
        },
      }),
    });

    return response.json();
  } else if (platform === "ios") {
    // Send via Apple Push Notification service
    // This requires APNs certificate and is more complex
    // Consider using a service like OneSignal or Firebase for iOS
    console.log("iOS push notification would be sent here");
  }
}
```

### Add to Main Router

Edit `server/routers.ts`:

```typescript
import { notificationsRouter } from "./notifications";

export const appRouter = router({
  // ... existing routers
  notifications: notificationsRouter,
});
```

### Add Database Schema

Edit `drizzle/schema.ts`:

```typescript
import { mysqlTable, varchar, timestamp, int, mysqlEnum } from "drizzle-orm/mysql-core";

export const pushTokens = mysqlTable("push_tokens", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  token: varchar("token", { length: 500 }).notNull().unique(),
  platform: mysqlEnum("platform", ["ios", "android"]).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

Run migration:

```bash
pnpm db:push
```

## Part 5: Frontend Integration

### Register for Push Notifications

Edit `client/src/pages/Dash.tsx`:

```typescript
import { PushNotifications } from "@capacitor/push-notifications";
import { trpc } from "@/lib/trpc";

export function Dash() {
  const registerPushToken = trpc.notifications.registerPushToken.useMutation();

  useEffect(() => {
    const setupPushNotifications = async () => {
      try {
        // Request permission
        const permission = await PushNotifications.requestPermissions();
        
        if (permission.receive === "granted") {
          // Register for push notifications
          await PushNotifications.register();

          // Get token
          const result = await PushNotifications.getDeliveredNotifications();
          
          // Send token to backend
          const token = await PushNotifications.getDeliveredNotifications();
          registerPushToken.mutate({
            token: token as string,
            platform: Platform.OS as "ios" | "android",
          });
        }
      } catch (error) {
        console.error("Push notification setup failed:", error);
      }
    };

    setupPushNotifications();
  }, []);

  // ... rest of component
}
```

### Listen for Notifications

```typescript
import { PushNotifications } from "@capacitor/push-notifications";

useEffect(() => {
  // Handle notification when app is in foreground
  PushNotifications.addListener("pushNotificationReceived", (notification) => {
    console.log("Notification received:", notification);
    // Show toast or update UI
  });

  // Handle notification tap
  PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
    console.log("Notification tapped:", action);
    // Navigate to relevant screen
  });

  return () => {
    PushNotifications.removeAllListeners();
  };
}, []);
```

## Part 6: Daily Reminder Notifications

### Create Scheduled Job

Create `server/jobs/sendDailyReminders.ts`:

```typescript
import { db } from "../db";
import { users } from "../../drizzle/schema";
import { sendPushNotification } from "../notifications";

export async function sendDailyReminders() {
  const allUsers = await db.query.users.findMany();

  const messages = [
    { title: "Time for a win!", body: "Ready to crush some tasks?" },
    { title: "Dopamine Dasher", body: "Your brain is awesome. Let's prove it!" },
    { title: "Quick wins waiting", body: "2-5 minutes to instant dopamine" },
    { title: "No judgment here", body: "Just start. That's enough." },
  ];

  for (const user of allUsers) {
    const tokens = await db.query.pushTokens.findMany({
      where: (pt) => eq(pt.userId, user.id),
    });

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    for (const token of tokens) {
      await sendPushNotification({
        token: token.token,
        title: randomMessage.title,
        body: randomMessage.body,
        platform: token.platform,
      });
    }
  }
}
```

### Schedule with Cron

Add to `server/_core/index.ts`:

```typescript
import cron from "node-cron";
import { sendDailyReminders } from "../jobs/sendDailyReminders";

// Send daily reminders at 9 AM
cron.schedule("0 9 * * *", async () => {
  console.log("Sending daily reminders...");
  await sendDailyReminders();
});
```

## Part 7: Environment Variables

Add to your `.env`:

```
FCM_SERVER_KEY=your_firebase_server_key_here
APNS_KEY_ID=your_apns_key_id
APNS_TEAM_ID=your_apple_team_id
APNS_BUNDLE_ID=com.Reena.DopamineDasher
```

## Testing

### Test Push Notifications

1. **Android**: Use Firebase Console → Cloud Messaging → Send test message
2. **iOS**: Use Apple's APNs testing tools

### Test Backend Procedure

```bash
# Call test notification endpoint
curl -X POST http://localhost:3000/api/trpc/notifications.sendTestNotification \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### Notifications Not Received
- Check device has internet connection
- Verify token is registered in database
- Check Firebase/APNs credentials are correct
- Review app logs for errors

### Token Registration Fails
- Ensure user is authenticated
- Check database connection
- Verify push_tokens table exists

### Daily Reminders Not Sending
- Check cron job is running
- Verify all users have registered tokens
- Check FCM/APNs credentials

## Next Steps

1. Set up Firebase Cloud Messaging for Android
2. Configure Apple Push Notifications for iOS
3. Test push notifications on real devices
4. Deploy daily reminder job
5. Monitor notification delivery rates
6. Gather user feedback on notification frequency

## Resources

- [Capacitor Push Notifications](https://capacitorjs.com/docs/apis/push-notifications)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Apple Push Notification Service](https://developer.apple.com/documentation/usernotifications)
