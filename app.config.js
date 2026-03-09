module.exports = {
  expo: {
    name: 'FreeDive Connect',
    slug: 'freedive-connect',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#0077B6',
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.freediveconnect.app',
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'FreeDive Connect needs your location to show nearby instructors.',
        NSCameraUsageDescription:
          'FreeDive Connect needs camera access for profile photos and verification.',
        NSPhotoLibraryUsageDescription:
          'FreeDive Connect needs photo library access to upload profile photos and certifications.',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#0077B6',
      },
      package: 'com.freediveconnect.app',
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      },
      permissions: [
        'ACCESS_FINE_LOCATION',
        'ACCESS_COARSE_LOCATION',
        'CAMERA',
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE',
      ],
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
          },
        },
      ],
      'expo-location',
      'expo-image-picker',
      [
        'expo-notifications',
        {
          icon: './assets/notification-icon.png',
          color: '#0077B6',
        },
      ],
    ],
  },
};
