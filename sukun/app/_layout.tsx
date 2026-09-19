/** Kök düzen — şartname §11. Tüm sağlayıcılar burada kurulur. */
import React from 'react';
import { Stack, Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProviders, useBoot } from '@/boot/AppProviders';
import { useTheme } from '@/theme/ThemeProvider';

export default function RootLayout() {
  return (
    <AppProviders>
      <RootStack />
    </AppProviders>
  );
}

function RootStack() {
  const theme = useTheme();
  const { onboardingDone } = useBoot();
  // İlk açılışta onboarding'e yönlendirilir; sonraki açılışlarda görünmez (§12).
  if (!onboardingDone) return <Redirect href="/onboarding" />;
  return (
    <>
      <StatusBar style={theme.name === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="location" options={{ presentation: 'modal' }} />
        <Stack.Screen name="prayer-settings" />
        <Stack.Screen name="prayer-calendar" />
        <Stack.Screen name="home-layout" />
        <Stack.Screen name="names" />
        <Stack.Screen name="duas" />
        <Stack.Screen name="knowledge" />
        <Stack.Screen name="hijri" />
        <Stack.Screen name="reader" />
        <Stack.Screen name="quran-search" />
      </Stack>
    </>
  );
}
