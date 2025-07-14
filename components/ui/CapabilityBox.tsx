import React from 'react'
import {useThemedStyles} from "@/hooks/useThemedStyles";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";

interface CapabilityBoxProps {
    text?: string;
}

const CapabilityBox: React.FC<CapabilityBoxProps> = ({
                                                         text,
                                                     }) => {
    const {chatBoxType1, chatBoxType1Text} = useThemedStyles();
    return (

        <ThemedView
            style={{
                width: '100%',
                height: 92,
                backgroundColor: chatBoxType1,
                borderRadius: 16,
            }}
            className='flex items-center justify-center p-5'
        >
            <ThemedText
                type='labels'
                className='text-center'
                style={{
                    color: chatBoxType1Text,
                }}
            >
                {text}
            </ThemedText>

        </ThemedView>

    )
}
export default CapabilityBox
