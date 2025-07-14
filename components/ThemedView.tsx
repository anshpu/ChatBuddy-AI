import { View, type ViewProps } from 'react-native';
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { SafeAreaView } from "react-native-safe-area-context";

export type ThemedViewProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
    isMain?: boolean;
    className?: string;
};

export function ThemedView({
                               style,
                               className,
                               isMain = false,
                               lightColor,
                               darkColor,
                               ...otherProps
                           }: ThemedViewProps) {
    const { background } = useThemedStyles();

    const view = (
        <View
            className={className}
            style={[{ backgroundColor: background }, style]}
            {...otherProps}
        />
    );

    return isMain ? <SafeAreaView className="flex-1">{view}</SafeAreaView> : view;
}
