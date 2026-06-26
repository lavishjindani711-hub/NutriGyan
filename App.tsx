import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, StatusBar, Animated } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { Outfit_400Regular, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { Colors } from './src/theme/colors';
import { Typography } from './src/theme/typography';
import { NavigationContainer } from '@react-navigation/native';
import { TabNavigator } from './src/navigation/TabNavigator';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AuthScreen } from './src/screens/AuthScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { profileService } from './src/services/profile';
import { notificationService } from './src/services/notifications';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function RootApp() {
  const { session, user, loading: authLoading } = useAuth();
  const [appIsReady, setAppIsReady] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          Inter_400Regular,
          Inter_700Bold,
          Outfit_400Regular,
          Outfit_700Bold,
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady && session) {
      notificationService.registerForPushNotificationsAsync();
    }
  }, [appIsReady, session]);

  useEffect(() => {
    async function checkProfile() {
      if (user) {
        try {
          const profile = await profileService.getProfile(user.id);
          setHasProfile(!!profile);
        } catch (e) {
          console.error('Profile check error:', e);
        } finally {
          setCheckingProfile(false);
        }
      } else {
        setCheckingProfile(false);
      }
    }
    checkProfile();
  }, [user]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we need this to play an animation,
      // we can do that here.
      await SplashScreen.hideAsync();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  // If not authenticated, show AuthScreen
  if (!session) {
    return (
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <AuthScreen />
      </View>
    );
  }

  // If authenticated but no profile, show Onboarding
  if (!hasProfile && !checkingProfile) {
    return (
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <OnboardingScreen onComplete={() => setHasProfile(true)} />
      </View>
    );
  }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <StatusBar barStyle="dark-content" />
      <TabNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootApp />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 40,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  glass: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 30,
  },
});
