import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import {HelloWave} from "@/components/HelloWave";
import React from "react";
import {images} from "@/constants/images";
import {useThemedStyles} from "@/hooks/useThemedStyles";
import CustomButton from "@/components/ui/CustomButton";
import {router} from "expo-router";

export default function Index() {
    const Logo = images.logo;
    const {buttonActive} = useThemedStyles();
    return (
        <ThemedView isMain={true} className='flex-1 justify-start pt-4 pb-6 px-6'>
            <ThemedText
                className='text-greyscale-900 dark:text-others-white'
                style={{
                fontSize: 24,
                lineHeight: 38,
                textAlign: 'center',
                fontWeight: '700',
                marginBottom: 28,
            }}>
                ChatBuddy AI
            </ThemedText>

            <ThemedView className='flex-1 items-center gap-11'>
                <Logo fill={buttonActive} width={180} height={180}/>
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

                    <ThemedView className='mt-8'>
                        <ThemedText className='text-base text-center text-greyscale-900 dark:text-others-white'>
                            Start chatting with ChatBuddy AI now.{'\n'}
                            You can ask me anything.
                        </ThemedText>
                    </ThemedView>
                </ThemedView>
                <CustomButton title='Start Chat' className='mt-6' type='primary' onPress={
                    () => {
                        router.push({
                            pathname: '/chat/[id]',
                            params: {
                                id: 'new',
                            },
                        })
                    }
                }/>
            </ThemedView>

        </ThemedView>
    );
}