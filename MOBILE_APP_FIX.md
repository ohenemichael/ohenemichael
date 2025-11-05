# Mobile App Fix Guide

This guide fixes the "ExpoLinking" and "main not registered" errors.

## 🔧 Quick Fix

Run these commands in the `medbook-mobile` directory:

```bash
# 1. Navigate to mobile app
cd medbook-mobile

# 2. Clean everything
rm -rf node_modules
rm -rf .expo
rm package-lock.json
rm yarn.lock

# 3. Install dependencies
npm install

# 4. Clear Metro cache
npx expo start --clear

# 5. Press 'a' for Android or 'i' for iOS
```

## ✅ What Was Fixed

### 1. Added Missing Dependencies
- `expo-linking` - Required for deep linking and navigation
- `expo-font` - Font loading support

### 2. Created Configuration Files
- `babel.config.js` - Babel configuration for Expo Router
- `metro.config.js` - Metro bundler configuration
- `index.js` - Entry point fallback
- `.gitignore` - Ignore build files

### 3. Fixed app.json
- Removed references to missing asset files
- Simplified splash screen configuration
- Fixed adaptive icon configuration

## 📦 Updated Dependencies

```json
{
  "expo-linking": "~6.2.2",
  "expo-font": "~11.10.2"
}
```

## 🚀 Full Setup Instructions

### Option 1: Quick Start (Recommended)

```bash
cd medbook-mobile
npm install
npx expo start --clear
```

Then press:
- `a` - Open on Android emulator/device
- `i` - Open on iOS simulator
- `w` - Open in web browser
- `r` - Reload app

### Option 2: Complete Clean Install

```bash
cd medbook-mobile

# Remove all caches and dependencies
rm -rf node_modules .expo .expo-shared
rm package-lock.json yarn.lock

# Reinstall everything
npm install

# Clear Metro bundler cache
npx expo start --clear
```

### Option 3: With Watchman (if you have it)

```bash
cd medbook-mobile

# Clean watchman
watchman watch-del-all

# Clear caches
rm -rf node_modules .expo
npm install

# Start fresh
npx expo start --clear
```

## 🛠️ Troubleshooting

### Error: "ExpoLinking not found"
**Solution:**
```bash
npm install expo-linking@~6.2.2
npx expo start --clear
```

### Error: "main has not been registered"
**Solution:**
```bash
# Make sure you're in the correct directory
cd medbook-mobile

# Clear everything and restart
rm -rf .expo node_modules
npm install
npx expo start --clear
```

### Error: "Unable to resolve module"
**Solution:**
```bash
# Reset Metro bundler
npx expo start --clear

# If that doesn't work
npx react-native start --reset-cache
```

### Metro bundler stuck at 0%
**Solution:**
```bash
# Kill any running Metro processes
killall -9 node

# Start fresh
npx expo start --clear
```

### Android build fails
**Solution:**
```bash
# Clear Android cache
cd android
./gradlew clean
cd ..

# Restart
npx expo start --clear
```

### iOS build fails
**Solution:**
```bash
# Clear iOS cache
cd ios
pod deintegrate
pod install
cd ..

# Restart
npx expo start --clear
```

## 📱 Testing the Fix

After starting the app, you should see:

1. ✅ Metro bundler starts successfully
2. ✅ App loads without errors
3. ✅ Login/Register screens appear
4. ✅ Navigation works correctly

## 🔍 Verify Installation

Check that all required packages are installed:

```bash
npm list expo-linking
npm list expo-font
npm list expo-router
```

Should show:
```
expo-linking@6.2.2
expo-font@11.10.2
expo-router@3.4.6
```

## 🎯 Expected Behavior

After the fix:
- ✅ App starts without errors
- ✅ Navigation works (tabs, screens)
- ✅ Authentication screens load
- ✅ Deep linking enabled
- ✅ No "module not found" errors

## 📝 Files Created/Modified

### Created:
- `babel.config.js` - Babel preset configuration
- `metro.config.js` - Metro bundler config
- `index.js` - Entry point
- `.gitignore` - Ignore build files

### Modified:
- `package.json` - Added expo-linking, expo-font
- `app.json` - Fixed asset references

## 💡 Tips

1. **Always clear cache** when changing configuration:
   ```bash
   npx expo start --clear
   ```

2. **Kill Metro** if it's stuck:
   ```bash
   killall -9 node
   ```

3. **Check React Native version** compatibility:
   ```bash
   npm list react-native
   ```

4. **Update Expo** if needed:
   ```bash
   npm install expo@latest
   ```

5. **Use Expo Doctor** to check for issues:
   ```bash
   npx expo-doctor
   ```

## 🔄 Complete Reset (Last Resort)

If nothing works, complete reset:

```bash
# 1. Delete everything
cd medbook-mobile
rm -rf node_modules .expo .expo-shared
rm package-lock.json yarn.lock

# 2. Reinstall Expo CLI globally
npm install -g expo-cli

# 3. Reinstall project dependencies
npm install

# 4. Clear all caches
npx expo start --clear --reset-cache

# 5. If on Mac, clear watchman
watchman watch-del-all

# 6. Start fresh
npx expo start --clear
```

## ✅ Success Checklist

- [ ] No "ExpoLinking" errors
- [ ] No "main not registered" errors
- [ ] App starts successfully
- [ ] Can navigate between screens
- [ ] Can see login/register pages
- [ ] Metro bundler shows 100% loaded

## 🆘 Still Having Issues?

If you still see errors:

1. **Check Node version:**
   ```bash
   node --version  # Should be 18+
   ```

2. **Check npm version:**
   ```bash
   npm --version  # Should be 9+
   ```

3. **Check Expo version:**
   ```bash
   npx expo --version
   ```

4. **Run diagnostics:**
   ```bash
   npx expo-doctor
   ```

5. **Check for port conflicts:**
   ```bash
   lsof -i :8081  # Metro bundler port
   ```

## 📚 Additional Resources

- [Expo Router Docs](https://expo.github.io/router/docs/)
- [Expo Troubleshooting](https://docs.expo.dev/troubleshooting/overview/)
- [React Native Debugging](https://reactnative.dev/docs/debugging)

---

**🎉 Your mobile app should now work perfectly!**

After running the fix, you should be able to:
- Start the development server
- Launch on iOS/Android
- Navigate through the app
- Test authentication features
