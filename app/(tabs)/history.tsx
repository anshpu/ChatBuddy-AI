import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, TextInput, Alert, Keyboard, View, Platform, ActivityIndicator } from 'react-native';
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from '@/hooks/useThemeColor';
import { getUserChats, deleteAllUserChats, deleteUserChat } from '@/lib/services/chatService';
import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { icons } from '@/constants/icons';
import Svg, { Path } from 'react-native-svg';

import type { Chat } from "@/lib/services/chatService";
import CustomCheckbox from '@/components/ui/CustomCheckbox';

type ThemeMode = 'light' | 'dark';

const History = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchMode, setSearchMode] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedChats, setSelectedChats] = useState<Set<string>>(new Set());
    const [deleting, setDeleting] = useState(false);
    const { userId } = useAuth();

    // Derived: are all visible chats selected?
    const allSelected = filteredChats.length > 0 && selectedChats.size === filteredChats.length;

    // Theme colors
    const background = useThemeColor({}, 'background');
    const cardBg = useThemeColor({ light: '#f5f5f5', dark: '#262a35' }, 'inputBg');
    const textColor = useThemeColor({}, 'text');
    const iconColor = useThemeColor({}, 'icon');
    const placeholderColor = useThemeColor({}, 'placeholder');

    useEffect(() => {
        loadChats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    useEffect(() => {
        if (searchText.trim() === '') {
            setFilteredChats(chats);
        } else {
            const lower = searchText.toLowerCase();
            setFilteredChats(
                chats.filter(chat =>
                    (chat.lastMessage || '').toLowerCase().includes(lower)
                )
            );
        }
    }, [searchText, chats]);

    const loadChats = async () => {
        setLoading(true);
        setError(null);
        if (!userId) {
            setChats([]);
            setLoading(false);
            return;
        }
        try {
            const userChats = await getUserChats(userId as string);
            setChats(userChats.filter(chat => !!chat.id));
        } catch (err) {
            setError("Failed to load chats. Please try again.");
            setChats([]);
        }
        setLoading(false);
    };

    // Enter selection mode
    const handleEnterSelectionMode = () => {
        setSelectionMode(true);
        setSelectedChats(new Set());
    };

    // Exit selection mode
    const handleExitSelectionMode = () => {
        setSelectionMode(false);
        setSelectedChats(new Set());
    };

    // Toggle single chat selection
    const handleToggleChat = (chatId: string) => {
        setSelectedChats(prev => {
            const newSet = new Set(prev);
            if (newSet.has(chatId)) {
                newSet.delete(chatId);
            } else {
                newSet.add(chatId);
            }
            return newSet;
        });
    };

    // Confirm delete selected chats
    const handleDeleteSelected = () => {
        if (selectedChats.size === 0) {
            Alert.alert("No chats selected", "Please select at least one chat to delete.");
            return;
        }
        Alert.alert(
            allSelected ? "Delete All Chats" : "Delete Selected Chats",
            allSelected
                ? "Are you sure you want to delete all chat history? This action cannot be undone."
                : "Are you sure you want to delete the selected chats?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        setDeleting(true);
                        try {
                            if (allSelected) {
                                await deleteAllUserChats(userId as string);
                                setChats([]);
                            } else {
                                await Promise.all(
                                    Array.from(selectedChats).map(chatId => deleteUserChat(chatId))
                                );
                                setChats(prev => prev.filter(chat => !selectedChats.has(chat.id!)));
                            }
                            setFilteredChats(prev => prev.filter(chat => !selectedChats.has(chat.id!)));
                            handleExitSelectionMode();
                        } catch (err) {
                            Alert.alert("Error", "Failed to delete chat(s).");
                        } finally {
                            setDeleting(false);
                        }
                    }
                }
            ]
        );
    };

    const handleSearchOpen = () => {
        setSearchMode(true);
    };

    const handleSearchClose = () => {
        setSearchMode(false);
        setSearchText('');
        Keyboard.dismiss();
    };

    const formatDate = (dateValue: any) => {
        if (!dateValue) return '';
        let date: Date;
        // Handle Firestore Timestamp (has toDate method)
        if (typeof dateValue?.toDate === 'function') {
            date = dateValue.toDate();
        } else {
            date = new Date(dateValue);
        }
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        if (hours === 0) hours = 12;
        return `${day} ${month} ${year}  -  ${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    };

    // Use available icons as placeholders if search/trash are missing
    const SearchIcon = () => (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
                d="M11 4a7 7 0 105.196 11.933l3.935 3.936a1 1 0 001.415-1.415l-3.936-3.935A7 7 0 0011 4zm0 2a5 5 0 110 10A5 5 0 0111 6z"
                stroke={iconColor}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
    const TrashIcon = () => (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
                d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"
                stroke={iconColor}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
    const ChevronIcon = () => (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
                d="M9 6l6 6-6 6"
                stroke={iconColor}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
    const BackIcon = () => (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
                d="M15 18l-6-6 6-6"
                stroke={iconColor}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );

    // Render header: normal, search, or selection mode
    const renderHeader = () => {
        if (searchMode) {
            return (
                <ThemedView
                    className="flex-row items-center mb-4"
                    style={{
                        marginTop: Platform.OS === 'ios' ? 0 : 16,
                        paddingHorizontal: 0,
                    }}
                >
                    <TouchableOpacity
                        onPress={handleSearchClose}
                        accessibilityLabel="Close search"
                        style={{
                            marginRight: 8,
                            padding: 8,
                        }}
                    >
                        <BackIcon />
                    </TouchableOpacity>
                    <ThemedView
                        style={{
                            flex: 1,
                            backgroundColor: cardBg,
                            borderRadius: 18,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 12,
                            height: 48,
                        }}
                    >
                        <SearchIcon />
                        <TextInput
                            value={searchText}
                            onChangeText={setSearchText}
                            placeholder="Give me"
                            placeholderTextColor={placeholderColor}
                            style={{
                                flex: 1,
                                marginLeft: 8,
                                color: textColor,
                                fontSize: 18,
                                fontWeight: '500',
                                backgroundColor: 'transparent',
                            }}
                            autoFocus
                            returnKeyType="search"
                        />
                    </ThemedView>
                </ThemedView>
            );
        }
        if (selectionMode) {
            return (
                <ThemedView className="flex-row items-center mb-4" style={{ marginTop: Platform.OS === 'ios' ? 0 : 16 }}>
                    <TouchableOpacity
                        onPress={handleDeleteSelected}
                        accessibilityLabel="Delete selected"
                        style={{ marginLeft: 'auto', padding: 8 }}
                    >
                        <TrashIcon />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleExitSelectionMode}
                        accessibilityLabel="Cancel selection"
                        style={{ marginLeft: 8, padding: 8 }}
                    >
                        <BackIcon />
                    </TouchableOpacity>
                </ThemedView>
            );
        }
        return (
            <ThemedView className="flex-row items-center justify-end mb-4" style={{ marginTop: Platform.OS === 'ios' ? 0 : 16 }}>
                <TouchableOpacity
                    onPress={handleSearchOpen}
                    accessibilityLabel="Search"
                    style={{ marginRight: 12, padding: 8 }}
                >
                    <SearchIcon />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleEnterSelectionMode}
                    accessibilityLabel="Select chats to delete"
                    style={{ padding: 8 }}
                >
                    <TrashIcon />
                </TouchableOpacity>
            </ThemedView>
        );
    };

    // Render each chat card
    const renderItem = ({ item }: { item: Chat }) => {
        if (selectionMode) {
            return (
                <TouchableOpacity
                    onPress={() => handleToggleChat(item.id!)}
                    accessibilityLabel={`Select chat: ${item.lastMessage}`}
                    accessible={true}
                    style={{
                        backgroundColor: cardBg,
                        borderRadius: 18,
                        marginBottom: 16,
                        paddingVertical: 18,
                        paddingHorizontal: 18,
                        flexDirection: 'row',
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOpacity: 0.04,
                        shadowRadius: 4,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 1,
                    }}
                >
                    <CustomCheckbox
                        checked={selectedChats.has(item.id!)}
                        onChange={() => handleToggleChat(item.id!)}
                    />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <ThemedText
                            numberOfLines={1}
                            style={{
                                fontSize: 20,
                                fontWeight: '700',
                                color: textColor,
                                marginBottom: 8,
                            }}
                        >
                            {item.lastMessage}
                        </ThemedText>
                        <ThemedText
                            style={{
                                fontSize: 14,
                                color: placeholderColor,
                                fontWeight: '400',
                            }}
                        >
                            {formatDate(item.updatedAt || item.createdAt || '')}
                        </ThemedText>
                    </View>
                    <ChevronIcon />
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity
                onPress={() => router.push(`/chat/${item.id}`)}
                accessibilityLabel={`Open chat: ${item.lastMessage}`}
                accessible={true}
                style={{
                    backgroundColor: cardBg,
                    borderRadius: 18,
                    marginBottom: 16,
                    paddingVertical: 18,
                    paddingHorizontal: 18,
                    flexDirection: 'row',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOpacity: 0.04,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 1,
                }}
            >
                <View style={{ flex: 1 }}>
                    <ThemedText
                        numberOfLines={1}
                        style={{
                            fontSize: 20,
                            fontWeight: '700',
                            color: textColor,
                            marginBottom: 8,
                        }}
                    >
                        {item.lastMessage}
                    </ThemedText>
                    <ThemedText
                        style={{
                            fontSize: 14,
                            color: placeholderColor,
                            fontWeight: '400',
                        }}
                    >
                        {formatDate(item.updatedAt || item.createdAt || '')}
                    </ThemedText>
                </View>
                <ChevronIcon />
            </TouchableOpacity>
        );
    };

    return (
        <ThemedView isMain={true} className='flex-1 pt-4 pb-6 px-6' style={{ backgroundColor: background }}>
            {renderHeader()}
            {loading ? (
                <ThemedView className="flex-1 justify-center items-center">
                    <ThemedText className='text-greyscale-900 dark:text-others-white'>Loading chats...</ThemedText>
                </ThemedView>
            ) : error ? (
                <ThemedView className="flex-1 justify-center items-center">
                    <ThemedText className="text-red-500">{error}</ThemedText>
                </ThemedView>
            ) : deleting ? (
                <ThemedView className="flex-1 justify-center items-center">
                    {/* Loader for deleting chats */}
                    <FlatList
                        data={[]}
                        renderItem={null}
                        ListEmptyComponent={
                            <>
                                <ThemedText style={{ marginBottom: 16 }}>Deleting chats...</ThemedText>
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    {/* Native ActivityIndicator for loader */}
                                    {/* @ts-ignore */}
                                    {Platform.OS === 'ios' || Platform.OS === 'android' ? (
                                        <>
                                            {/* @ts-ignore */}
                                            
                                            <ActivityIndicator size="large" color={iconColor} />
                                        </>
                                    ) : (
                                        <ThemedText>...</ThemedText>
                                    )}
                                </View>
                            </>
                        }
                    />
                </ThemedView>
            ) : (
                <FlatList
                    data={filteredChats}
                    keyExtractor={(item) => item.id!}
                    renderItem={renderItem}
                    keyboardShouldPersistTaps="handled"
                    ListEmptyComponent={() => (
                        <ThemedView className="flex-1 justify-center items-center py-10">
                            <ThemedText className='text-greyscale-900 dark:text-others-white'>
                                {searchText
                                    ? "No chats match your search."
                                    : "No chats yet. Start a new conversation!"}
                            </ThemedText>
                        </ThemedView>
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 24 }}
                    refreshing={loading}
                    onRefresh={loadChats}
                />
            )}
        </ThemedView>
    );
};

export default History;
