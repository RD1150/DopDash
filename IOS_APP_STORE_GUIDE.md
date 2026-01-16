# Dopamine Dasher - iOS App Store Submission Guide

## Prerequisites

- Mac with Xcode installed (version 15+)
- Apple Developer Account ($99/year)
- App Store Connect access
- Your app icons and splash screens (already prepared)

## Step 1: Set Up App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **My Apps**
3. Click **+** to create a new app
4. Select **iOS**
5. Fill in:
   - **App Name**: Dopamine Dasher
   - **Primary Language**: English
   - **Bundle ID**: com.Reena.Dopamine-Dasher (or your bundle ID)
   - **SKU**: dopamine-dasher-001
   - **User Access**: Full Access

## Step 2: Configure App Information

### General Information
- **App Name**: Dopamine Dasher
- **Subtitle**: Finally, a task app that doesn't make you feel broken
- **Category**: Productivity
- **Content Rights**: Select appropriate option
- **Age Rating**: Complete the questionnaire (should be 4+)

### App Description
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
```

### Keywords
- ADHD task management
- productivity app
- dopamine motivation
- task planner
- focus timer
- habit tracker

### Support URL
- Your website or support email

### Privacy Policy URL
- Link to your privacy policy (required)

## Step 3: Add App Icons & Screenshots

### App Icon
1. In App Store Connect, go to **App Information**
2. Upload **app-icon-1024-dd.png** (1024x1024px)
3. The system will generate all required sizes

### Screenshots
Upload screenshots for each device type:
- **iPhone 6.7"**: 1284x2778px
- **iPhone 5.5"**: 1242x2208px
- **iPad Pro 12.9"**: 2048x2732px

Recommended screenshots:
1. Dashboard with tasks
2. Leaderboard screen
3. Rewards shop
4. Task creation flow
5. Streak counter

### Preview Video (Optional)
- Create a 30-second video showing your app in action
- Format: MP4, H.264 codec

## Step 4: Configure Version Information

1. Click **+ Version** to create a new version
2. **Version Number**: 1.0.0
3. **Copyright**: © 2026 [Your Name/Company]
4. **Release Notes**:
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

## Step 5: Build & Archive Your App

### In Xcode:

1. **Open Project**:
   - Open `ios/App/App.xcworkspace` (NOT .xcodeproj)

2. **Select Target**:
   - Select **App** target
   - Select **Generic iOS Device** (not simulator)

3. **Configure Signing**:
   - Go to **Signing & Capabilities**
   - Select your Team
   - Let Xcode auto-manage signing

4. **Archive for Release**:
   ```
   Product → Archive
   ```
   - Wait for build to complete (5-10 minutes)

5. **Distribute to App Store**:
   - Click **Distribute App**
   - Select **App Store Connect**
   - Select **Upload**
   - Choose your distribution certificate
   - Click **Upload**

## Step 6: Submit for Review

1. Return to App Store Connect
2. Go to your app version
3. Scroll to **Build** section
4. Select the build you just uploaded
5. Review all information
6. Click **Submit for Review**

## Step 7: App Review Process

- **Review Time**: Typically 24-48 hours
- **Common Issues**:
  - Missing privacy policy (fix immediately)
  - Unclear app purpose (update description)
  - Crash on launch (test thoroughly)
  - Requires account but no sign-up option (ensure login works)

## Step 8: Release to App Store

Once approved:
1. Go to **App Store Connect**
2. Click **Release**
3. Choose **Automatic Release** or **Manual Release**
4. Your app appears in App Store within hours

## Troubleshooting

### Build Fails
- Ensure you're using `.xcworkspace`, not `.xcodeproj`
- Check that all dependencies are installed: `cd ios/App && pod install`

### Signing Issues
- Verify your Apple Developer account is active
- Check that your certificate is valid
- Try: **Xcode → Preferences → Accounts → Download Manual Profiles**

### App Rejected
- Read the rejection reason carefully
- Most common: Privacy policy or crash on launch
- Fix and resubmit

### App Crashes on Launch
- Test on a real device before submitting
- Check that your backend API is accessible
- Verify all required permissions are requested

## After Launch

1. **Monitor Reviews**: Respond to user feedback
2. **Track Analytics**: Use App Store Connect analytics
3. **Plan Updates**: Gather user feedback for v1.1
4. **Push Notifications**: Set up push notification certificates

## Support

For issues, contact Apple Developer Support through App Store Connect.
