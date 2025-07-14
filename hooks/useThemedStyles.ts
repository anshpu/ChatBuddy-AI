import {useThemeColor} from "@/hooks/useThemeColor";

export const useThemedStyles = () => {
    const background = useThemeColor({}, 'background');
    const tabIconDefault = useThemeColor({}, 'tabIconDefault');
    const tabIconSelected = useThemeColor({}, 'tabIconSelected');
    const text = useThemeColor({}, 'text');
    const placeholder = useThemeColor({}, 'placeholder');
    const icon = useThemeColor({}, 'icon');
    const divider = useThemeColor({}, 'divider');
    const buttonActive = useThemeColor({}, 'buttonActive');
    const buttonDisabled = useThemeColor({}, 'buttonDisabled');
    const buttonSecondary = useThemeColor({}, 'buttonSecondary');
    const chatBoxType1 = useThemeColor({}, 'chatBoxType1');
    const chatBoxType1Text = useThemeColor({}, 'chatBoxType1Text');
    const inputBg = useThemeColor({}, 'inputBg');

    return {
        background,
        tabIconDefault,
        tabIconSelected,
        text,
        placeholder,
        icon,
        divider,
        buttonActive,
        buttonDisabled,
        buttonSecondary,
        chatBoxType1,
        chatBoxType1Text,
        inputBg,
    };
};
