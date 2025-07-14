import React from 'react';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    GestureResponderEvent,
    ViewStyle,
    TextStyle, ActivityIndicator,
} from 'react-native';
import {PRIMARY_900, COLOR_WHITE} from "@/constants/colors";
import {useThemedStyles} from "@/hooks/useThemedStyles";

type ButtonType = 'primary' | 'secondary';

interface FancyButtonProps {
    title?: string;
    onPress?: (event: GestureResponderEvent) => void;
    type?: ButtonType;
    style?: ViewStyle;
    textStyle?: TextStyle;
    ready?: boolean;
    className?: string;
    children?: React.ReactNode;
    loading?: boolean;
}

const CustomButton: React.FC<FancyButtonProps> = ({
                                                      title,
                                                      onPress,
                                                      type = 'primary',
                                                      style,
                                                      textStyle,
                                                      className,
                                                      ready = true,
                                                      children,
                                                        loading = false,
                                                  }) => {
    const isPrimary = type === 'primary';
    const {buttonActive, buttonDisabled, buttonSecondary} = useThemedStyles();

    return (
        <TouchableOpacity
            className={className}
            onPress={onPress}
            disabled={!ready}
            activeOpacity={0.9}
            style={[
                !isPrimary && ready && {
                    backgroundColor: buttonSecondary,
                },
                isPrimary && ready && {
                    backgroundColor: buttonActive,
                },
                styles.buttonBase,
                isPrimary && !ready && {
                    backgroundColor: buttonDisabled,
                },
                style,
            ]}
        >
            {
                loading ? (
                    <ActivityIndicator color={isPrimary ? COLOR_WHITE : PRIMARY_900} />
                ) : (
                    title && (
                        <Text
                            style={[
                                styles.textBase,
                                isPrimary ? styles.primaryText : styles.secondaryText,
                                textStyle,
                            ]}
                        >
                            {title}
                        </Text>
                    )
                )
            }
            {
                !loading && children
            }
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonBase: {
        width: '100%',
        height: 60,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textBase: {
        fontSize: 18,
        fontWeight: '600',
    },
    primaryText: {
        color: COLOR_WHITE,
    },
    secondaryText: {
        color: PRIMARY_900,
    },
});

export default CustomButton;
