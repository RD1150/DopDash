# Dopamine Dasher - App Store Submission Guide

Your app is now wrapped with Capacitor and ready for submission to both the Apple App Store and Google Play Store.

## What's Ready

✅ iOS project in `./ios` directory  
✅ Android project in `./android` directory  
✅ Web assets properly configured  
✅ App ID: `com.dopamindasher.app`  
✅ App Name: `Dopamine Dasher`  

## iOS Submission (Apple App Store)

### Prerequisites
- Apple Developer Account ($99/year)
- Mac with Xcode installed
- Apple ID for signing certificates

### Steps

1. **Open iOS Project**
   ```bash
   cd ios
   open App/App.xcworkspace
   ```

2. **Configure Signing**
   - In Xcode, select the "App" project
   - Go to Signing & Capabilities
   - Select your Team ID
   - Update Bundle Identifier if needed (currently: `com.dopamindasher.app`)

3. **Update App Icons**
   - Replace icons in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
   - Provide icons at these sizes: 20x20, 29x29, 40x40, 58x58, 60x60, 76x76, 80x80, 87x87, 120x120, 152x152, 167x167, 180x180

4. **Update Splash Screen**
   - Replace launch screen in `ios/App/App/Assets.xcassets/LaunchImage.imageset/`
   - Provide images for all device sizes

5. **Build for Release**
   ```bash
   xcodebuild -workspace App/App.xcworkspace -scheme App -configuration Release -archivePath build/App.xcarchive archive
   ```

6. **Submit to App Store Connect**
   - Go to https://appstoreconnect.apple.com
   - Create new app entry
   - Upload build using Xcode Organizer
   - Fill in app metadata, screenshots, description
   - Submit for review

### App Store Metadata

**App Name:** Dopamine Dasher  
**Subtitle:** Task app designed FOR ADHD brains, not against them  
**Category:** Productivity  
**Keywords:** ADHD, task management, productivity, dopamine, focus  

**Description:**
```
Dopamine Dasher is a task app designed specifically for ADHD brains. 

Instead of fighting your brain, we work WITH it. Break down overwhelming projects into 2-5 minute wins. Get instant dopamine hits through satisfying task completion, streaks, and rewards.

Features:
• Break free from task paralysis with quick wins
• Turn overwhelming projects into 2-5 minute wins
• No judgment. No guilt. Just instant dopamine hits
• Global leaderboards and friendly competitions
• Daily mood check-ins for personalized task recommendations
• Collect digital rewards as you complete tasks
• Multiple game modes to keep things fresh

Join thousands of ADHD brains who finally have a task app that doesn't make them feel broken.
```

---

## Android Submission (Google Play Store)

### Prerequisites
- Google Play Developer Account ($25 one-time)
- Android Studio or Gradle CLI
- Keystore file for signing

### Steps

1. **Create Keystore for Signing**
   ```bash
   keytool -genkey -v -keystore dopamine-dasher-key.keystore \
     -keyalg RSA -keysize 2048 -validity 10000 \
     -alias dopamine-dasher
   ```
   Keep this file safe - you'll need it for future updates!

2. **Configure Gradle Signing**
   Edit `android/app/build.gradle`:
   ```gradle
   android {
     signingConfigs {
       release {
         storeFile file('dopamine-dasher-key.keystore')
         storePassword 'YOUR_PASSWORD'
         keyAlias 'dopamine-dasher'
         keyPassword 'YOUR_PASSWORD'
       }
     }
     buildTypes {
       release {
         signingConfig signingConfigs.release
       }
     }
   }
   ```

3. **Update App Icons**
   - Replace icons in `android/app/src/main/res/`
   - Provide icons at: 192x192, 512x512 (and other required densities)

4. **Update Splash Screen**
   - Edit `android/app/src/main/res/drawable/splash.xml`
   - Update colors and images

5. **Build Release APK**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   Output: `app/build/outputs/apk/release/app-release.apk`

6. **Build Release Bundle (Recommended)**
   ```bash
   ./gradlew bundleRelease
   ```
   Output: `app/build/outputs/bundle/release/app-release.aab`

7. **Submit to Google Play Console**
   - Go to https://play.google.com/console
   - Create new app
   - Upload AAB file (or APK)
   - Fill in app metadata, screenshots, description
   - Submit for review

### Google Play Metadata

**App Name:** Dopamine Dasher  
**Short Description:** Task app designed FOR ADHD brains, not against them  
**Category:** Productivity  

**Full Description:**
```
Dopamine Dasher is a task app designed specifically for ADHD brains. 

Instead of fighting your brain, we work WITH it. Break down overwhelming projects into 2-5 minute wins. Get instant dopamine hits through satisfying task completion, streaks, and rewards.

Features:
• Break free from task paralysis with quick wins
• Turn overwhelming projects into 2-5 minute wins
• No judgment. No guilt. Just instant dopamine hits
• Global leaderboards and friendly competitions
• Daily mood check-ins for personalized task recommendations
• Collect digital rewards as you complete tasks
• Multiple game modes to keep things fresh

Join thousands of ADHD brains who finally have a task app that doesn't make them feel broken.
```

---

## Screenshots for App Stores

You'll need 2-5 screenshots showing:
1. Main task dashboard
2. Task completion with rewards
3. Leaderboard/competition feature
4. Daily check-in mood selector
5. Rewards shop

**Recommended Screenshot Sizes:**
- iOS: 1242x2208px (iPhone 6 Plus)
- Android: 1080x1920px

---

## Testing Before Submission

1. **Test on Real Device**
   - iOS: Run on iPhone via Xcode
   - Android: Run on Android device or emulator

2. **Test Key Features**
   - Task creation and completion
   - Streak tracking
   - Leaderboard loading
   - Daily check-in appearance
   - Rewards shop functionality

3. **Check Permissions**
   - iOS: Review privacy policy
   - Android: Ensure all permissions are justified

---

## After Submission

**Apple:** Review typically takes 1-3 days  
**Google Play:** Review typically takes a few hours to 24 hours  

Once approved, your app will be live in both stores!

---

## Support

For Capacitor documentation: https://capacitorjs.com/docs  
For iOS submission help: https://developer.apple.com/app-store/submission/  
For Android submission help: https://play.google.com/console/about/help/
