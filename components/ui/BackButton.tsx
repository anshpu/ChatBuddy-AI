import {TouchableOpacity, ViewStyle} from 'react-native'
import React from 'react'
import {router} from "expo-router";
import {icons} from "@/constants/icons";
import {useThemedStyles} from "@/hooks/useThemedStyles";

interface BackButtonProps {
    className?: string;
    style?: ViewStyle;
    onPress?: () => void;
    fill?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
                                                   className,
                                                   style,
                                                    onPress,
                                                    fill,
                                               }) => {
    const BackIcon = icons.back;
    const {icon} = useThemedStyles();
    const classNames = className ? className : 'pt-3 pb-3';
    return (
        <TouchableOpacity style={style} onPress={
            onPress ? onPress : () => {
                router.back()
            }
        } className={classNames}>
            <BackIcon fill={fill ? fill : icon} />
        </TouchableOpacity>
    )
}
export default BackButton
