import {Animated, Easing, Text} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {router} from "expo-router";
import {images} from "@/constants/images";
import {ThemedView} from "@/components/ThemedView";
import {useThemedStyles} from "@/hooks/useThemedStyles";
import {ThemedText} from "@/components/ThemedText";

const Index = () => {
    const Logo = images.logo;
    const Loader = images.loader;
    const [error, setError] = useState<string | null>(null);

    const spinValue = useRef(new Animated.Value(0)).current;
    const {buttonActive} = useThemedStyles();

    useEffect(() => {
        const animation = Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );
        
        animation.start();
        
        const validateEnvironment = () => {
            const missingVars = [];
            
            if (!process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY) {
                missingVars.push('CLERK_PUBLISHABLE_KEY');
            }
            
            if (!process.env.EXPO_PUBLIC_FIREBASE_API_KEY) {
                missingVars.push('FIREBASE_API_KEY');
            }
            
            return missingVars;
        };

        const fetchDataAndInit = async () => {
            try {
                const missingVars = validateEnvironment();
                if (missingVars.length > 0) {
                    console.warn(`Missing environment variables: ${missingVars.join(', ')}`);
                }
                
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                router.replace('/(auth)/welcome');
            } catch (err) {
                console.error("Startup error:", err);
                setError(`Error initializing app. Please check your connection and restart.`);
            }
        };

        fetchDataAndInit();
        
        return () => {
            animation.stop();
        };
    }, []);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <ThemedView className='flex-1 justify-center items-center'>
            <Logo fill={buttonActive} width={160} height={160}/>
            <ThemedText className='text-5xl text-greyscale-900 dark:text-others-white pt-8'>ChatBuddy AI</ThemedText>
            {error ? (
                <ThemedText className='text-alerts-error mt-8 mx-8 text-center'>{error}</ThemedText>
            ) : (
                <Animated.View style={{transform: [{rotate: spin}], marginTop: 120}}>
                    <Loader width={60} height={60}/>
                </Animated.View>
            )}
        </ThemedView>
    );
};

export default Index;