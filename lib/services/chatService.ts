import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    doc,
    getDoc,
    updateDoc,
    serverTimestamp,
    deleteDoc,
    Firestore
} from 'firebase/firestore';
import { db } from '../firebase';

export type ChatMessage = {
    id?: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: any;
};

export const deleteAllUserChats = async (userId: string): Promise<void> => {
    const firestore = verifyFirestore();
    if (!firestore || !userId) return;

    try {
        const q = query(
            collection(firestore, 'chats'),
            where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        const deletePromises = querySnapshot.docs.map(docSnap =>
            deleteDoc(doc(firestore, 'chats', docSnap.id))
        );
        await Promise.all(deletePromises);
    } catch (error) {
        console.error('Error deleting all user chats:', error);
    }
};

export type Chat = {
    id?: string;
    title: string;
    assistantType: string;
    assistantDescription?: string;
    createdAt: any;
    updatedAt: any;
    lastMessage?: string;
};

const dbTyped: Firestore | undefined = db;

const verifyFirestore = (): Firestore | null => {
    if (!dbTyped) {
        console.error('Firestore is not initialized');
        return null;
    }
    return dbTyped;
};

export const checkChatExists = async (chatId: string) => {
    const firestore = verifyFirestore();
    if (!firestore || !chatId) return false;

    try {
        const chatRef = doc(firestore, 'chats', chatId);
        const chatSnap = await getDoc(chatRef);
        return chatSnap.exists();
    } catch (error) {
        console.error('Error checking chat:', error);
        return false;
    }
};

export const createChat = async (
    title: string,
    assistantType: string,
    assistantDescription: string = '',
    userId: string
) => {
    const firestore = verifyFirestore();
    if (!firestore || !userId) return null;

    try {
        const chatRef = await addDoc(collection(firestore, 'chats'), {
            userId,
            title,
            assistantType,
            assistantDescription,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        return { id: chatRef.id, title, assistantType, assistantDescription };
    } catch (error) {
        console.error('Error creating chat:', error);
        return null;
    }
};

export const getUserChats = async (userId: string) => {
    const firestore = verifyFirestore();
    if (!firestore || !userId) return [];

    try {
        const q = query(
            collection(firestore, 'chats'),
            where('userId', '==', userId),
            orderBy('updatedAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Chat[];
    } catch (error) {
        console.error('Error getting chats:', error);
        return [];
    }
};

export const saveMessage = async (
    chatId: string,
    message: ChatMessage,
    userId: string
) => {
    const firestore = verifyFirestore();
    if (!firestore || !userId) return null;

    try {
        const messageRef = await addDoc(collection(firestore, 'chats', chatId, 'messages'), {
            ...message,
            timestamp: serverTimestamp()
        });

        const chatRef = doc(firestore, 'chats', chatId);
        await updateDoc(chatRef, {
            lastMessage: message.text,
            updatedAt: serverTimestamp()
        });

        return { id: messageRef.id, ...message };
    } catch (error) {
        console.error('Error saving message:', error);
        return null;
    }
};

export const getChatMessages = async (chatId: string, userId: string) => {
    const firestore = verifyFirestore();
    if (!firestore || !userId) return [];

    try {
        const q = query(
            collection(firestore, 'chats', chatId, 'messages'),
            orderBy('timestamp', 'asc')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as ChatMessage[];
    } catch (error) {
        console.error('Error getting messages:', error);
        return [];
    }
};

/**
 * Delete a single chat by its ID.
 */
export const deleteUserChat = async (chatId: string): Promise<void> => {
    const firestore = verifyFirestore();
    if (!firestore || !chatId) return;

    try {
        await deleteDoc(doc(firestore, 'chats', chatId));
    } catch (error) {
        console.error('Error deleting chat:', error);
    }
};
