import React from 'react';
import {View, Image, TouchableOpacity, ImageSourcePropType} from 'react-native';
import {ThemedText} from "@/components/ThemedText";
import {router} from "expo-router";

type AssistantCardProps = {
    title: string;
    description: string;
    icon: ImageSourcePropType;
    onPress?: () => void;
    accessibilityLabel?: string;
};

const AssistantCard: React.FC<AssistantCardProps> = ({
    title,
    description,
    icon,
    onPress,
    accessibilityLabel,
}) => {
    const handlePress = () => {
        console.log('Press');
        router.push({
            pathname: '/chat/[id]',
            params: {
                id: 'new',
                assistant: title,
                description: description,
            },
        })
    }
    return (
        <TouchableOpacity
            onPress={onPress || handlePress}
            accessibilityLabel={accessibilityLabel}
            accessible={true}
            className='bg-greyscale-50 dark:bg-dark-2 border-4 border-greyscale-100 dark:border-dark-3 p-5 rounded-2xl w-[160px] items-start mr-3 max-h-60'>
            <View className="bg-white/10 rounded-xl mb-4">
                <Image source={icon} className="w-14 h-14" resizeMode="contain"/>
            </View>

            <ThemedText type='customText' className="text-lg font-bold mb-1 text-greyscale-900 dark:text-others-white" numberOfLines={2}>
                {title}
            </ThemedText>
            <ThemedText type='customText' className="text-sm font-normal text-greyscale-900 dark:text-others-white"
                        numberOfLines={3}>
                {description}
            </ThemedText>
        </TouchableOpacity>
    );
};

export default AssistantCard;
