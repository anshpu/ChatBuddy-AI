import React, {useEffect, useState} from 'react';
import {Keyboard, TextInput, TextInputProps} from 'react-native';
import {ThemedView} from "@/components/ThemedView";
import {useThemedStyles} from "@/hooks/useThemedStyles";
import {PRIMARY_900, TRANSPARENT_GREEN} from "@/constants/colors";

type ThemedInputProps = TextInputProps & {
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
};

const ThemedInput: React.FC<ThemedInputProps> = ({placeholder = 'Ask me anything...', value, onChangeText, style, ...props}) => {
    const [focused, setFocused] = useState(false);
    const {inputBg, text, placeholder: placeHolderTextColor} = useThemedStyles();
    const [inputHeight, setInputHeight] = useState(40);

    useEffect(() => {
        const keyboardListener = Keyboard.addListener('keyboardDidHide', () => setFocused(false));
        const keyboardListener2 = Keyboard.addListener('keyboardDidShow', () => setFocused(true));
        return () => {
            keyboardListener.remove();
            keyboardListener2.remove();
        }
    }, []);

    return (
        <ThemedView
            style={{
                flex: 1,
                backgroundColor: focused ? TRANSPARENT_GREEN : inputBg,
                borderRadius: 16,
                justifyContent: 'flex-start', // align input to top
                alignItems: 'stretch',
                padding: 8,
                borderColor: PRIMARY_900,
                borderWidth: focused ? 1 : 0,
                ...style,
            }}
        >
            <TextInput
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                autoCapitalize="none"
                multiline={true}
                scrollEnabled={false}
                placeholderTextColor={placeHolderTextColor}
                className="text-base w-full"
                cursorColor={text}
                selectionColor={placeholder}
                style={{
                    color: text,
                    minHeight: 40,
                    maxHeight: 120,
                    height: Math.max(40, Math.min(inputHeight, 120)),
                    textAlignVertical: 'top',
                }}
                onContentSizeChange={e => setInputHeight(e.nativeEvent.contentSize.height)}
                {...props}
            />
        </ThemedView>
    );
};

export default ThemedInput;
