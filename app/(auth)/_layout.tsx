import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function AuthRoutesLayout() {
    const { isSignedIn } = useAuth();
    if (isSignedIn) {
        return <Redirect href={'/(tabs)'} />
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: 'transparent' }
            }}
        >
            <Stack.Screen
                name="welcome"
                options={{
                    animation: 'fade'
                }}
            />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
        </Stack>
    )
}
