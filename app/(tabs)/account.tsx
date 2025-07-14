import React from 'react';
import { Text, TouchableOpacity, View, Linking, Image, ActivityIndicator, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Colors, ALERT_ERROR } from '@/constants/colors';
import * as ImagePicker from 'expo-image-picker';
import { useColorScheme } from '../../hooks/useColorScheme';
import * as FileSystem from 'expo-file-system';

const PRIVACY_POLICY_URL = 'https://dummy-privacy-policy-url.com';
const ABOUT_URL = 'https://dummy-about-chatbuddyai-url.com';

const Account = () => {
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  const [uploading, setUploading] = React.useState(false);

  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const dangerColor = ALERT_ERROR;

  // Avatar upload handler
  const handlePickAvatar = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'Permission to access media library is required!');
        return;
      }
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: false,
      });
      if (pickerResult.canceled || !pickerResult.assets || !pickerResult.assets[0].uri) {
        return;
      }
      setUploading(true);

      const asset = pickerResult.assets[0];
      const uri = asset.uri;
      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      // Compose data URI
      const mimeType = asset.type || 'image/jpeg';
      const dataUri = `data:${mimeType};base64,${base64}`;

      // Use Clerk's setProfileImage with base64 string
      // @ts-ignore: setProfileImage accepts base64 string
      await user?.setProfileImage({ file: dataUri });
      await user?.reload();
    } catch (err) {
      Alert.alert('Upload failed', 'Could not update avatar. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/welcome');
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    onPress?: () => void | Promise<void>;
    right?: React.ReactNode;
    color?: string;
    testID?: string;
  }

  const MenuItem: React.FC<MenuItemProps> = ({
    icon,
    label,
    onPress,
    right,
    color,
    testID,
  }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      className="flex-row items-center justify-between py-4 px-2"
      testID={testID}
    >
      <View className="flex-row items-center">
        {icon}
        <Text className="ml-3 text-base" style={{ color: color || palette.text }}>
          {label}
        </Text>
      </View>
      {right}
    </TouchableOpacity>
  );

  // Avatar UI
  const renderAvatar = () => {
    const avatarSize = 88;
    const avatarUrl = user?.imageUrl;
    return (
      <View className="items-center mb-4">
        <View style={{ position: 'relative', width: avatarSize, height: avatarSize }}>
          <Image
            source={{ uri: avatarUrl }}
            style={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
              borderWidth: 2,
              borderColor: palette.divider,
              backgroundColor: palette.background,
            }}
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={handlePickAvatar}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: palette.background,
              borderRadius: 16,
              padding: 4,
              borderWidth: 1,
              borderColor: palette.divider,
            }}
            activeOpacity={0.7}
          >
            {uploading ? (
              <ActivityIndicator size={16} color={palette.text} />
            ) : (
              <Feather name="camera" size={18} color={palette.icon} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ThemedView className="flex-1 pt-16 pb-8 px-6 bg-white dark:bg-black">
      {/* Header */}
      <Text className="text-2xl font-bold text-center" style={{ color: palette.text, marginBottom: 16 }}>
        Account
      </Text>

      {/* Avatar and User Info */}
      {isLoaded && (
        <>
          {renderAvatar()}
          <View className="items-center mb-2">
            <Text className="text-base font-medium" style={{ color: palette.text }}>
              {user?.primaryEmailAddress?.emailAddress || 'No email'}
            </Text>
            <Text className="text-sm mt-1" style={{ color: palette.placeholder }}>
              Welcome back!
            </Text>
          </View>
        </>
      )}

      {/* Menu */}
      <View className="rounded-2xl bg-white dark:bg-neutral-900 px-2 py-2 shadow-sm mt-4">
        {/* App Info Section */}
        <Text className="text-xs font-semibold uppercase px-2 py-1 mb-1" style={{ color: palette.placeholder }}>
          App Info
        </Text>
        <MenuItem
          icon={<Feather name="lock" size={22} color={palette.icon} />}
          label="Privacy Policy"
          onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
          right={<Feather name="chevron-right" size={20} color={palette.icon} />}
        />
        <View className="h-px bg-neutral-200 dark:bg-neutral-700 my-1" />
        <MenuItem
          icon={<Feather name="info" size={22} color={palette.icon} />}
          label="About ChatBuddyAI"
          onPress={() => Linking.openURL(ABOUT_URL)}
          right={<Feather name="chevron-right" size={20} color={palette.icon} />}
        />

        {/* Danger Zone Section */}
        <Text className="text-xs font-semibold uppercase px-2 py-1 mt-4 mb-1" style={{ color: dangerColor }}>
          Danger Zone
        </Text>
        <MenuItem
          icon={<Feather name="log-out" size={22} color={dangerColor} />}
          label="Logout"
          onPress={handleSignOut}
          color={dangerColor}
          testID="logout"
        />
      </View>
    </ThemedView>
  );
};

export default Account;
