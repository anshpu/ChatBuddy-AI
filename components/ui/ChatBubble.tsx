import React from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { icons } from "@/constants/icons";
import { GREYSCALE_400, GREYSCALE_700, PRIMARY_900 } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import clsx from "clsx";
import Markdown from 'react-native-markdown-display';
import { useThemeColor } from '@/hooks/useThemeColor';

import { Image, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

type ChatBubbleProps = {
    message: string;
    imageUri?: string;
    isSender?: boolean;
    assistantType?: string;
};

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, imageUri, isSender = false }) => {
    const Copy = icons.copy;
    const Download = icons.download;
    const theme = useColorScheme() ?? 'light';
    const textColor = useThemeColor({}, 'text');

    const [imageLoading, setImageLoading] = React.useState<boolean>(!!imageUri);
    const [downloading, setDownloading] = React.useState<boolean>(false);

    const handleCopy = () => {
        Clipboard.setStringAsync(message);
    };

    const handleDownload = async () => {
        if (!imageUri) return;
        try {
            setDownloading(true);
            // Request permission
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'Permission to access media library is required!');
                setDownloading(false);
                return;
            }
            // Download to a temporary file
            const filename = imageUri.split('/').pop() || 'image.jpg';
            const fileUri = FileSystem.cacheDirectory + filename;
            const downloadResumable = FileSystem.createDownloadResumable(
                imageUri,
                fileUri
            );
            const downloadResult = await downloadResumable.downloadAsync();
            if (!downloadResult || !downloadResult.uri) {
                Alert.alert('Error', 'Failed to download image.');
                setDownloading(false);
                return;
            }
            // Save to gallery
            await MediaLibrary.saveToLibraryAsync(downloadResult.uri);
            Alert.alert('Downloaded', 'Image has been saved to your gallery.');
        } catch (e) {
            Alert.alert('Error', 'Failed to download image.');
        } finally {
            setDownloading(false);
        }
    };

    const markdownStyles = {
        body: {
            color: isSender ? '#ffffff' : textColor,
        },
        paragraph: {
            marginVertical: 0,
        },
        heading1: {
            fontWeight: '700' as const,
            fontSize: 20,
            marginVertical: 10,
            color: isSender ? '#ffffff' : textColor,
        },
        heading2: {
            fontWeight: '700' as const,
            fontSize: 18,
            marginVertical: 8,
            color: isSender ? '#ffffff' : textColor,
        },
        heading3: {
            fontWeight: '600' as const,
            fontSize: 16,
            marginVertical: 6,
            color: isSender ? '#ffffff' : textColor,
        },
        hr: {
            backgroundColor: '#cccccc',
            height: 1,
            marginVertical: 12,
        },
        list_item: {
            marginVertical: 2,
        },
        strong: {
            fontWeight: '700' as const,
        },
        code_inline: {
            backgroundColor: isSender ? 'rgba(255,255,255,0.2)' : '#f5f5f5',
            padding: 4,
            borderRadius: 4,
        },
        code_block: {
            backgroundColor: isSender ? 'rgba(255,255,255,0.2)' : '#f5f5f5',
            padding: 8,
            borderRadius: 4,
        },
        blockquote: {
            borderLeftWidth: 4,
            borderLeftColor: isSender ? '#ffffff' : '#cccccc',
            paddingLeft: 10,
        }
    };

    const rendererRules = {
        image: (_node: any, _children: any, _parent: any, _styles: any) => {
            return null;
        },
    };

    if (isSender) {
        return (
            <View className="bg-primary-900 self-end my-2 max-w-[80%] px-4 py-2 rounded-t-xl rounded-bl-xl rounded-br-none">
                <Markdown style={markdownStyles} rules={rendererRules}>
                    {message}
                </Markdown>
            </View>
        );
    }

    return (
        <View className="relative self-start my-2 max-w-[80%]">
            <View className={clsx(
                "bg-greyscale-100 dark:bg-dark-4 px-4 py-2 rounded-t-xl rounded-br-xl rounded-bl-none"
            )}>
                {imageUri ? (
                    <View style={{ width: 220, height: 220, marginBottom: 8, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0', overflow: 'hidden' }}>
                        {imageLoading && (
                            <ActivityIndicator size="large" color="#888" style={{ position: 'absolute', alignSelf: 'center' }} />
                        )}
                        <Image
                            source={{ uri: imageUri }}
                            style={{ width: 220, height: 220, borderRadius: 12, opacity: imageLoading ? 0 : 1 }}
                            resizeMode="contain"
                            onLoadStart={() => setImageLoading(true)}
                            onLoadEnd={() => setImageLoading(false)}
                        />
                    </View>
                ) : null}
                <Markdown style={markdownStyles} rules={rendererRules}>
                    {message}
                </Markdown>
            </View>

            <View className="absolute top-2 -right-10 flex-col gap-4">
                {imageUri ? (
                    <TouchableOpacity onPress={handleDownload} disabled={downloading}>
                        {downloading ? (
                            <ActivityIndicator size="small" color={theme === 'dark' ? PRIMARY_900 : GREYSCALE_400} />
                        ) : (
                            <Download stroke={theme === 'dark' ? PRIMARY_900 : GREYSCALE_400} width={24} height={24} />
                        )}
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={handleCopy}>
                        <Copy fill={theme === 'dark' ? GREYSCALE_700 : GREYSCALE_400} width={24} height={24} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default ChatBubble;
