import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useRouter, usePathname} from 'expo-router';
import {icons} from '@/constants/icons';
import {useThemedStyles} from "@/hooks/useThemedStyles";

const tabs = [
    {name: 'Chat', route: '/', icon: icons.chat, iconActive: icons.chatActive},
    {name: 'AI Assistants', route: '/assistants', icon: icons.assistants, iconActive: icons.assistantsActive},
    {name: 'History', route: '/history', icon: icons.history, iconActive: icons.historyActive},
    {name: 'Account', route: '/account', icon: icons.account, iconActive: icons.accountActive},
] as const;

const CustomTabBar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { background, tabIconDefault, tabIconSelected } = useThemedStyles();

    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                backgroundColor: background,
                paddingBottom: 10,
                paddingTop: 10,
            }}>
            {tabs.map((tab, index) => {
                const focused = pathname === tab.route;
                const IconComponent = focused && tab.iconActive ? tab.iconActive : tab.icon;
                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => router.push(tab.route)}
                        style={{alignItems: 'center', justifyContent: 'center'}}
                    >
                        <IconComponent
                            width={24}
                            height={24}
                            style={{
                                marginBottom: 4,
                            }}
                        />
                        <Text style={{
                            fontSize: 12,
                            color: focused ? tabIconSelected : tabIconDefault,
                            fontWeight: focused ? '600' : '400',
                        }}>
                            {tab.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default CustomTabBar;
