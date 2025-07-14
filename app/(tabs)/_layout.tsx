import React from 'react';
import { Tabs } from 'expo-router';
import CustomTabBar from '@/components/CustomTabBar';

const _Layout = () => {
    return (
        <Tabs
            tabBar={() => <CustomTabBar />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen name="index" />
            <Tabs.Screen name="assistants" />
            <Tabs.Screen name="history" />
            <Tabs.Screen name="account" />
        </Tabs>
    );
};

export default _Layout;
