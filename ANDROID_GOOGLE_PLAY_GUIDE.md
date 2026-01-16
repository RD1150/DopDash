# Dopamine Dasher - Android Google Play Submission Guide

## Prerequisites

- Mac or Windows with Android Studio installed
- Google Play Developer Account ($25 one-time)
- Google Play Console access
- Your app icons and splash screens (already prepared)

## Step 1: Set Up Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Click **Create app**
3. Fill in:
   - **App name**: Dopamine Dasher
   - **Default language**: English
   - **App or game**: App
   - **Free or paid**: Free
   - **Content guidelines**: Accept

## Step 2: Configure App Information

### App Details
- **Short description** (50 chars):
  "Task app designed FOR ADHD brains"

- **Full description** (4000 chars):
```
Dopamine Dasher is a task app designed FOR ADHD brains, not against them.

Break free from task paralysis with instant dopamine hits that get you moving. Turn overwhelming projects into 2-5 minute wins. No judgment. No guilt. Just instant dopamine.

Features:
✓ Break free from task paralysis
✓ Turn overwhelming projects into 2-5 minute wins
✓ No judgment. No guilt.
✓ Just instant dopamine hits that get you moving
✓ Global leaderboards and contests
✓ Earn coins and collect digital rewards
✓ Daily check-ins for personalized task recommendations
✓ Shame-free task archiving
✓ Real-time streak tracking
✓ Community challenges

Perfect for anyone with ADHD, executive dysfunction, or task paralysis.
```

- **App category**: Productivity
- **Content rating**: Everyone (4+)

### Contact Information
- Support email
- Website
- Privacy policy URL

## Step 3: Add Graphics & Screenshots

### App Icon
1. Go to **Store listing**
2. Upload **app-icon-512-dd.png** (512x512px, PNG)

### Feature Graphic
1. Create or use a 1024x500px banner
2. Upload as **Feature graphic**

### Screenshots
Upload at least 2 screenshots (up to 8):
- **Phone**: 1080x1920px
- **Tablet**: 1440x2560px (optional)

Recommended screenshots:
1. Dashboard with tasks
2. Leaderboard screen
3. Rewards shop
4. Task creation
5. Streak counter

### Preview Video (Optional)
- Create a 30-second video
- Format: MP4, H.264 codec
- Upload as **Preview video**

## Step 4: Generate Signing Key

### Create Keystore File (One-time)

Open Terminal and run:

```bash
keytool -genkey -v -keystore ~/dopamine-dasher.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias dopamine-dasher-key
```

When prompted:
- **Keystore password**: Create a strong password (save it!)
- **Key password**: Same as keystore password
- **First and last name**: Your name
- **Organization**: Your company
- **City**: Your city
- **State**: Your state
- **Country**: Your country code (US, etc.)

**IMPORTANT**: Save this keystore file and password securely. You'll need it for all future updates.

## Step 5: Build Release APK/AAB

### Using Android Studio:

1. **Open Project**:
   - Open `android` folder from your Dopamine Dasher project

2. **Configure Signing**:
   - Go to **Build → Generate Signed Bundle/APK**
   - Select **Android App Bundle** (AAB format - required for Google Play)
   - Click **Next**

3. **Select Keystore**:
   - Click **Create new...**
   - Navigate to `~/dopamine-dasher.keystore`
   - Enter keystore password
   - Enter key alias: `dopamine-dasher-key`
   - Enter key password
   - Click **Next**

4. **Select Build Variant**:
   - Select **release**
   - Click **Finish**

5. **Build**:
   - Android Studio generates `app-release.aab`
   - File location: `android/app/release/app-release.aab`

## Step 6: Upload to Google Play Console

1. Go to **Google Play Console**
2. Select your app
3. Go to **Release → Production**
4. Click **Create new release**
5. Click **Browse files** under **Android App Bundles**
6. Select your `app-release.aab` file
7. Review release notes:
```
Welcome to Dopamine Dasher!

Launch version includes:
- Task management with dopamine-boosting features
- Global leaderboards and contests
- Digital rewards shop
- Daily mood check-ins
- Shame-free task archiving
- Real-time streak tracking
```
8. Click **Review release**
9. Click **Rollout to Production** (or staged rollout)

## Step 7: Content Rating Questionnaire

1. Go to **App content**
2. Complete **Content rating questionnaire**
3. Select appropriate ratings for:
   - Violence
   - Sexual content
   - Profanity
   - Alcohol/Tobacco
   - Gambling
   - Other

For Dopamine Dasher, most should be "None"

## Step 8: Privacy Policy

1. Go to **App content → Privacy policy**
2. Provide link to your privacy policy
3. Ensure it covers:
   - Data collection practices
   - User authentication
   - Third-party services
   - Data retention

## Step 9: Permissions

1. Go to **App content → App permissions**
2. Review requested permissions
3. Ensure each permission has a clear use case

For Dopamine Dasher, you may need:
- **Internet**: For backend API calls
- **Camera**: If adding photo tasks (optional)
- **Microphone**: If adding voice tasks (optional)
- **Notifications**: For push notifications

## Step 10: Submit for Review

1. Go to **Release → Production**
2. Click **Review release**
3. Verify all information
4. Click **Start rollout to Production**

## Step 11: Review Process

- **Review Time**: Typically 2-4 hours (can be up to 24 hours)
- **Common Issues**:
  - Missing privacy policy
  - Crashes on launch
  - Misleading description
  - Inappropriate content

## Step 12: Monitor Release

1. Go to **Release → Production**
2. Monitor rollout percentage
3. Check for crashes in **Crashes and ANRs**
4. Read user reviews

## Troubleshooting

### Build Fails
```bash
# Clean build
cd android
./gradlew clean

# Rebuild
./gradlew assembleRelease
```

### Signing Issues
- Verify keystore file exists and is readable
- Check password is correct
- Try: `keytool -list -v -keystore ~/dopamine-dasher.keystore`

### App Crashes
- Test on real Android device before submitting
- Check logcat for errors
- Verify backend API is accessible

### Rejected for Crash
- Check **Crashes and ANRs** tab in Play Console
- Fix the crash
- Increment version number
- Resubmit

## After Launch

1. **Monitor Crashes**: Check **Crashes and ANRs** tab daily
2. **Read Reviews**: Respond to user feedback
3. **Track Analytics**: Use Play Console analytics
4. **Plan Updates**: Gather feedback for v1.1
5. **Push Notifications**: Set up Firebase Cloud Messaging

## Update Process

For future updates:
1. Increment version number in `android/app/build.gradle`
2. Run `./gradlew bundleRelease`
3. Upload new AAB to Play Console
4. Submit for review

## Support

For issues, contact Google Play Console support or visit [Android Developers](https://developer.android.com).
