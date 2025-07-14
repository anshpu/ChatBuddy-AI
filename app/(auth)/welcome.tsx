import React from 'react'
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import {images} from "@/constants/images";
import CustomButton from "@/components/ui/CustomButton";
import {HelloWave} from "@/components/HelloWave";
import {router} from "expo-router";
import {useThemedStyles} from "@/hooks/useThemedStyles";

const Welcome = () => {
    const Logo = images.logo;
    const {buttonActive} = useThemedStyles();
    return (
        <ThemedView className='flex-1 justify-between items-center pt-16 pb-8 px-6'>
            <Logo fill={buttonActive} width={140} height={140}/>
            <ThemedView className="justify-center items-center">
                <ThemedText type="custom" className='text-greyscale-900 dark:text-others-white'>
                    Welcome to
                </ThemedText>
                <ThemedView className="flex-row justify-between items-center gap-4">
                    <ThemedText type="custom" className="text-primary-900">
                        ChatBuddy AI
                    </ThemedText>
                    <HelloWave/>
                </ThemedView>
            </ThemedView>

            <ThemedView className="w-full gap-6">
                <CustomButton title="Log in" type="primary"
                              onPress={() => router.navigate('/(auth)/login')}/>
                <CustomButton title="Sign up" type="secondary"
                              onPress={() => router.navigate('/(auth)/register')}/>
            </ThemedView>

        </ThemedView>
    )
}
export default Welcome
