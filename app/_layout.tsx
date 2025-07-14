import { useEffect, useState } from 'react';
import {Stack} from "expo-router";
import {StatusBar} from 'expo-status-bar';
import './globals.css';
import {useColorScheme} from '@/hooks/useColorScheme';
import {ClerkProvider} from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { View, Text, ActivityIndicator } from 'react-native';
import { PRIMARY_900 } from '@/constants/colors';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [clerkReady, setClerkReady] = useState(false);
    const [navThemes, setNavThemes] = useState<{
        ThemeProvider?: any;
        DarkTheme?: any;
        DefaultTheme?: any;
    }>({});

    const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

    useEffect(() => {
        if (!publishableKey) {
            console.error("Missing Clerk publishable key. Make sure it's properly set in your environment.");
        } else {
            console.log("Clerk publishable key found");
            setClerkReady(true);
        }
    }, [publishableKey]);

    useEffect(() => {
        (async () => {
            const nav = await import('@react-navigation/native');
            setNavThemes({
                ThemeProvider: nav.ThemeProvider,
                DarkTheme: nav.DarkTheme,
                DefaultTheme: nav.DefaultTheme,
            });
        })();
    }, []);

    if (!clerkReady || !navThemes.ThemeProvider || !navThemes.DarkTheme || !navThemes.DefaultTheme) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={PRIMARY_900} />
                <Text style={{ marginTop: 20 }}>Loading authentication...</Text>
            </View>
        );
    }

    const { ThemeProvider, DarkTheme, DefaultTheme } = navThemes;

    return (
        <ClerkProvider 
            publishableKey={publishableKey}
            tokenCache={tokenCache}
        >
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen name="index" options={{headerShown: false}}/>
                    <Stack.Screen name="(auth)" options={{headerShown: false}}/>
                    <Stack.Screen name="chat/[id]" options={{headerShown: false}}/>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                </Stack>
                <StatusBar style="auto"/>
            </ThemeProvider>
        </ClerkProvider>
    )
}
