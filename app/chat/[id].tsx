import {ScrollView, View, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback} from 'react-native'
import React, {useState, useRef, useEffect} from 'react'
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import BackButton from "@/components/ui/BackButton";
import CapabilityBox from "@/components/ui/CapabilityBox";
import {images} from "@/constants/images";
import {useThemedStyles} from "@/hooks/useThemedStyles";
import CustomButton from "@/components/ui/CustomButton";
import ThemedInput from "@/components/ThemedInput";
import {icons} from "@/constants/icons";
import ChatBubble from "@/components/ui/ChatBubble";
import {sendMessage, generateImage} from "@/lib/ai";
import { PRIMARY_900 } from "@/constants/colors";
import {router, useLocalSearchParams} from "expo-router";
import {getAssistantPrompt} from "@/lib/ai/assistantPrompts";
import {saveMessage, getChatMessages, createChat, checkChatExists} from '@/lib/services/chatService';
import {useAuth} from "@clerk/clerk-expo";

const TypingIndicator = () => {
    return (
        <View
            className="flex-row items-center gap-2 p-4 max-w-[20%] bg-greyscale-100 dark:bg-dark-4 rounded-t-xl rounded-br-xl rounded-bl-none">
            <View
                className="w-2 h-2 rounded-full bg-primary-500 animate-bounce"
                style={{animationDelay: '0ms'}}
            />
            <View
                className="w-2 h-2 rounded-full bg-primary-500 animate-bounce"
                style={{animationDelay: '200ms'}}
            />
            <View
                className="w-2 h-2 rounded-full bg-primary-500 animate-bounce"
                style={{animationDelay: '400ms'}}
            />
        </View>
    );
};

const Chat = () => {
    const Logo = images.logo;
    const Send = icons.send;
    const {buttonActive, divider, chatBoxType1Text} = useThemedStyles();
    const params = useLocalSearchParams();
    const assistantType = params.assistant as string;
    const assistantDescription = params.description as string;
    const chatId = params.id as string;
    console.log('Chat ID:', chatId);
    const isNewChat = chatId === 'new';
    const {userId} = useAuth();

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [currentChat, setCurrentChat] = useState<{ id: string, title: string }>({
        id: isNewChat ? '' : chatId,
        title: assistantType || 'ChatBuddy AI'
    });

    const [currentAssistant, setCurrentAssistant] = useState({
        title: assistantType || 'ChatBuddy AI',
        description: assistantDescription || '',
    })

    const [pendingNewChatId, setPendingNewChatId] = useState<string | null>(null);

    const [messages, setMessages] = useState<{ id: string, text: string, sender: 'user' | 'bot', imageUri?: string }[]>([]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const scrollViewRef = useRef<ScrollView>(null);

    // Keyboard event listeners
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
                // Allow layout to adjust before scrolling
                setTimeout(() => scrollToBottom(true), 100);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const assistantCapabilities: Record<string, { text: string }[]> = {
        'Write an Article': [
            { text: 'Write well-structured articles on any topic.' },
            { text: 'Ensure clarity and coherence in writing.' },
            { text: 'Adapt tone and style as needed.' },
        ],
        'Academic Writer': [
            { text: 'Compose essays, reports, and academic papers.' },
            { text: 'Cite sources and references properly.' },
            { text: 'Maintain formal academic tone.' },
        ],
        'Summarize (TL;DR)': [
            { text: 'Extract key points from long texts.' },
            { text: 'Provide concise summaries.' },
            { text: 'Highlight main ideas and arguments.' },
        ],
        'Translate Language': [
            { text: 'Translate text between languages.' },
            { text: 'Preserve meaning and context.' },
            { text: 'Support multiple language pairs.' },
        ],
        'Plagiarism Checker': [
            { text: 'Detect copied content in text.' },
            { text: 'Provide originality reports.' },
            { text: 'Suggest ways to improve originality.' },
        ],
        'Songs/Lyrics': [
            { text: 'Write creative song lyrics.' },
            { text: 'Support various music genres.' },
            { text: 'Rhyme and structure verses.' },
        ],
        'Storyteller': [
            { text: 'Create engaging stories.' },
            { text: 'Develop characters and plots.' },
            { text: 'Write in different genres.' },
        ],
        'Poems': [
            { text: 'Compose poems in various styles.' },
            { text: 'Use rhyme and meter creatively.' },
            { text: 'Express emotions through poetry.' },
        ],
        'Movie Script': [
            { text: 'Write scripts for movies.' },
            { text: 'Format dialogues and scenes.' },
            { text: 'Develop story arcs.' },
        ],
        'Email Writer': [
            { text: 'Draft professional emails.' },
            { text: 'Use proper etiquette and tone.' },
            { text: 'Create templates for various scenarios.' },
        ],
        'Answer Interviewer': [
            { text: 'Prepare answers for interview questions.' },
            { text: 'Highlight strengths and experiences.' },
            { text: 'Practice common interview scenarios.' },
        ],
        'Job Post': [
            { text: 'Write clear job descriptions.' },
            { text: 'Highlight required skills and roles.' },
            { text: 'Attract suitable candidates.' },
        ],
        'Advertisements': [
            { text: 'Create catchy ad copy.' },
            { text: 'Promote products or services.' },
            { text: 'Target specific audiences.' },
        ],
        'LinkedIn': [
            { text: 'Write professional LinkedIn posts.' },
            { text: 'Highlight achievements and skills.' },
            { text: 'Engage with professional audience.' },
        ],
        'Instagram': [
            { text: 'Write creative Instagram captions.' },
            { text: 'Use hashtags effectively.' },
            { text: 'Engage followers with stories.' },
        ],
        'Twitter': [
            { text: 'Craft concise and impactful tweets.' },
            { text: 'Use trending hashtags.' },
            { text: 'Engage with followers.' },
        ],
        'TikTok': [
            { text: 'Write viral TikTok captions.' },
            { text: 'Suggest creative video ideas.' },
            { text: 'Engage with trends.' },
        ],
        'Facebook': [
            { text: 'Write engaging Facebook posts.' },
            { text: 'Promote events and pages.' },
            { text: 'Interact with community.' },
        ],
        'Write Code': [
            { text: 'Write code in any programming language.' },
            { text: 'Solve coding problems.' },
            { text: 'Provide code explanations.' },
        ],
        'Explain Code': [
            { text: 'Explain complex code snippets.' },
            { text: 'Break down logic step by step.' },
            { text: 'Suggest improvements.' },
        ],
        'Birthday': [
            { text: 'Write heartfelt birthday wishes.' },
            { text: 'Personalize messages for loved ones.' },
            { text: 'Suggest gift ideas.' },
        ],
        'Apology': [
            { text: 'Write sincere apologies.' },
            { text: 'Express empathy and understanding.' },
            { text: 'Offer ways to make amends.' },
        ],
        'Invitation': [
            { text: 'Draft invitations for any event.' },
            { text: 'Set the right tone and details.' },
            { text: 'Personalize for recipients.' },
        ],
        'Create Conversation': [
            { text: 'Create conversation templates.' },
            { text: 'Support multiple participants.' },
            { text: 'Vary tone and context.' },
        ],
        'Tell a Joke': [
            { text: 'Tell funny jokes.' },
            { text: 'Use puns and wordplay.' },
            { text: 'Lighten the mood.' },
        ],
        'Food Recipes': [
            { text: 'Suggest recipes for any cuisine.' },
            { text: 'List ingredients and steps.' },
            { text: 'Offer cooking tips.' },
        ],
        'Diet Plan': [
            { text: 'Create personalized diet plans.' },
            { text: 'Consider dietary preferences.' },
            { text: 'Suggest healthy meal options.' },
        ],
    };

    const capabilities =
        assistantType && assistantCapabilities[assistantType]
            ? assistantCapabilities[assistantType]
            : [
                { text: 'Answer all your questions. \n(Just ask me anything you like!)' },
                { text: 'Generate all the text you want.\n (essays, articles, reports, stories, & more)' },
                { text: 'Conversational AI.\n (I can talk to you like a natural human)' },
            ];

    useEffect(() => {
        const initChat = async () => {
            setError(null);
            if (isNewChat) {
                setIsInitializing(false);
                setCurrentChat({
                    id: '',
                    title: assistantType || 'ChatBuddy AI'
                });
                setCurrentAssistant({
                    title: assistantType || 'ChatBuddy AI',
                    description: assistantDescription || ''
                });
            } else {
                try {
                    const chatDoc = await checkChatExists(chatId);
                    if (chatDoc) {
                        await loadChatHistory();
                        
                        if (assistantType) {
                            setCurrentAssistant({
                                title: assistantType,
                                description: assistantDescription || ''
                            });
                        }
                        setIsInitializing(false);
                    } else {
                        setError("Chat doesn't exist or doesn't belong to user");
                        router.replace('/');
                        setIsInitializing(false);
                    }
                } catch (error) {
                    setError("Error checking chat");
                    setIsInitializing(false);
                }
            }
        };

        if(userId) {
            initChat();
        }
    }, [userId, assistantType, assistantDescription]);

    useEffect(() => {
        if (currentChat.id && !isNewChat) {
            loadChatHistory();
        }
    }, [currentChat.id]);

    const effectiveChatId = isNewChat && pendingNewChatId ? pendingNewChatId : currentChat.id;

    const loadChatHistory = async () => {
        if (!effectiveChatId || !userId) return;

        try {
            const chatMessages = await getChatMessages(
                String(effectiveChatId),
                String(userId)
            );
            if (chatMessages.length > 0) {
                setMessages(chatMessages.map(msg => ({
                    id: msg.id || Date.now().toString(),
                    text: msg.text,
                    sender: msg.sender,
                    imageUri: msg.imageUri
                })));
                
                // Wait for render cycle to complete before scrolling
                setTimeout(() => scrollToBottom(false), 300);
            }
        } catch (error) {
            setError("Error loading chat history");
        }
    };

    const scrollToBottom = (animated = true) => {
        if (scrollViewRef.current && messages.length > 0) {
            try {
                // Use a delay to ensure layout is complete
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({animated});
                }, 150);
            } catch (e) {
                console.error("Scroll error:", e);
            }
        }
    };

    // Make sure we scroll when messages change
    useEffect(() => {
        if (messages.length > 0) {
            // Use a slightly longer delay for message updates
            setTimeout(() => scrollToBottom(true), 200);
        }
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim() || !userId) return;

        Keyboard.dismiss();
        setError(null);

        let chatIdToUse = effectiveChatId;

        // If assistant is Image Generator, skip chat creation and saving messages
        if (currentAssistant.title === "Image Generator") {
            const newUserMessage = {
                text: inputText,
                sender: 'user' as const,
                timestamp: new Date().toISOString()
            };
            const tempUIMessage = {
                id: Date.now().toString(),
                ...newUserMessage
            };
            setMessages(prev => [...prev, tempUIMessage]);
            setInputText("");
            setIsLoading(true);
            try {
                // Only generate image, do not save anything to Firebase
                const imageResult = await generateImage(inputText);
                const botMessage = {
                    text: imageResult.text,
                    imageUri: imageResult.imageUri,
                    sender: 'bot' as const,
                    timestamp: new Date().toISOString()
                };
                const tempUIBotMessage = {
                    id: (Date.now() + 1).toString(),
                    ...botMessage
                };
                setMessages(prev => [...prev, tempUIBotMessage]);
            } catch (error: any) {
                setError(error.message || "Failed to get response");
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    text: `Error: ${error.message || "Failed to get response"}`,
                    sender: 'bot' as const
                }]);
            } finally {
                setIsLoading(false);
            }
            return;
        }

        if (isNewChat && !chatIdToUse) {
            try {
                const assistantTitle = assistantType || 'ChatBuddy AI';
                const assistantDesc = assistantDescription || '';
                const newChat = await createChat(
                    assistantTitle,
                    assistantTitle,
                    assistantDesc,
                    String(userId)
                );
                if (newChat && newChat.id) {
                    setCurrentChat({
                        id: newChat.id,
                        title: assistantTitle
                    });
                    setPendingNewChatId(newChat.id);
                    chatIdToUse = newChat.id;
                } else {
                    setError('Error creating new chat');
                    return;
                }
            } catch (error) {
                setError('Error creating new chat');
                return;
            }
        }

        if (!chatIdToUse) {
            setError('No chat ID available');
            return;
        }

        const newUserMessage = {
            text: inputText,
            sender: 'user' as const,
            timestamp: new Date().toISOString()
        };

        const tempUIMessage = {
            id: Date.now().toString(),
            ...newUserMessage
        };

        setMessages(prev => [...prev, tempUIMessage]);
        setInputText("");
        setIsLoading(true);

        try {
            await saveMessage(chatIdToUse, newUserMessage, String(userId));

            const systemPromptText = getAssistantPrompt(currentAssistant.title, currentAssistant.description);

            const formattedMessages = [
                {
                    role: 'user',
                    content: systemPromptText
                },
                ...messages.concat(tempUIMessage).map(m => ({
                    role: m.sender === 'user' ? 'user' : 'assistant',
                    content: m.text
                }))
            ];

            const aiResponse = await sendMessage(formattedMessages);

            const botMessage = {
                text: aiResponse,
                sender: 'bot' as const,
                timestamp: new Date().toISOString()
            };

            const tempUIBotMessage = {
                id: (Date.now() + 1).toString(),
                ...botMessage
            };
            
            setMessages(prev => [...prev, tempUIBotMessage]);
            await saveMessage(chatIdToUse, botMessage, String(userId));
        } catch (error: any) {
            setError(error.message || "Failed to get response");

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: `Error: ${error.message || "Failed to get response"}`,
                sender: 'bot' as const
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (isInitializing) {
        return (
            <ThemedView isMain={true} className="flex-1 justify-center items-center">
                <ThemedText className='text-greyscale-900 dark:text-others-white'>Loading chat...</ThemedText>
            </ThemedView>
        );
    }

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <ThemedView isMain={true} className='flex-1 pt-4 pb-6 px-6'>
                <ThemedView className="flex-row items-center justify-between mb-2">
                    <BackButton/>
                    <ThemedText
                        className='text-greyscale-900 dark:text-others-white'
                        style={{
                            fontSize: 24,
                            lineHeight: 38,
                            textAlign: 'center',
                            fontWeight: '700',
                            flex: 1,
                        }}>
                        {currentAssistant.title}
                    </ThemedText>
                </ThemedView>

                {error && (
                    <ThemedView className="flex items-center justify-center my-4">
                        <ThemedText className="text-red-500">{error}</ThemedText>
                    </ThemedView>
                )}

                {
                    !messages.length && !error && (
                        <ScrollView className="flex-1">
                            <ThemedView className="flex items-center justify-center gap-6 mt-6">
                                <Logo fill={divider} width={80} height={80}/>
                                <ThemedText type='title'
                                            className='text-greyscale-400 dark:text-greyscale-800'>Capabilities</ThemedText>

                                <ThemedView className="w-full items-center gap-3">
                                    {
                                        capabilities.map((capability, index) => (
                                            <CapabilityBox text={capability.text} key={index}/>
                                        ))
                                    }
                                </ThemedView>

                                <ThemedText style={{
                                    color: chatBoxType1Text,
                                }} type='labels' className='text-base text-center'>
                                    I can do much more than this.
                                </ThemedText>
                            </ThemedView>
                        </ScrollView>
                    )
                }

                {messages.length > 0 && (
                    <ScrollView
                        ref={scrollViewRef}
                        className="flex-1"
                        contentContainerStyle={{
                            paddingBottom: 20,
                            flexGrow: 1,
                        }}
                        showsVerticalScrollIndicator={true}
                        scrollEventThrottle={16}
                        onContentSizeChange={() => scrollToBottom(true)}
                        onLayout={() => scrollToBottom(false)}
                    >
                        {messages.map((message) => (
                            <ChatBubble
                                message={message.text}
                                imageUri={message.imageUri}
                                key={message.id}
                                isSender={message.sender === 'user'}
                                assistantType={message.sender === 'bot' ? currentAssistant.title : undefined}
                            />
                        ))}
                        {isLoading && <TypingIndicator/>}
                    </ScrollView>
                )}

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ThemedView 
                        className="w-full border-t py-4" 
                        style={{borderColor: divider}}
                    >
                        <ThemedView className='w-full flex-row items-center gap-4'>
                            <ThemedInput
                                value={inputText}
                                onChangeText={setInputText}
                                onFocus={() => setTimeout(() => scrollToBottom(true), 300)}
                            />

                            <CustomButton
                                style={{
                                    width: 55,
                                    height: 55,
                                    padding: 16,
                                    boxShadow: `4px 8px 24px 0px ${PRIMARY_900}40`,
                                    display: "flex",
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 8,
                                    borderRadius: 100,
                                }}
                                type='primary'
                                ready={!!inputText.trim() && !isLoading}
                                onPress={handleSend}
                            >
                                <Send fill={buttonActive} width={28} height={28}/>
                            </CustomButton>
                        </ThemedView>
                    </ThemedView>
                </TouchableWithoutFeedback>
            </ThemedView>
        </KeyboardAvoidingView>
    )
}

export default Chat