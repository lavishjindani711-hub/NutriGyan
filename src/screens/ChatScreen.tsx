import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { GlassContainer } from '../components/ui/GlassContainer';
import { Send, Camera, Mic, ChevronLeft, Volume2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';
import { aiService } from '../services/ai';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    image?: string;
}

export const ChatScreen = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Namaste! I am NutriGyani, your personal health coach. Kaise hain aap? Ready to crush your goals today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const response = await aiService.getChatResponse(newMessages);
            setMessages([...newMessages, { role: 'assistant', content: response || 'No response' }]);
        } catch (error) {
            setMessages([...newMessages, { role: 'assistant', content: 'Apologies, I hit a snag. Please try again!' }]);
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const userMsg: Message = { role: 'user', content: 'Analyzing your meal...', image: result.assets[0].uri };
            setMessages([...messages, userMsg]);
            setLoading(true);
            try {
                const response = await aiService.analyzeMealImage(result.assets[0].uri);
                setMessages(prev => [...prev, { role: 'assistant', content: response || 'Could not analyze' }]);
            } catch (error) {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Could not analyze that photo. Try again?' }]);
            } finally {
                setLoading(false);
            }
        }
    };

    const speak = (text: string) => {
        Speech.speak(text, {
            language: 'en-IN',
            pitch: 1.0,
            rate: 1.0,
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity><ChevronLeft color={Colors.text} /></TouchableOpacity>
                <Text style={Typography.h3}>AI Coach</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={styles.chatArea}
                contentContainerStyle={styles.chatContent}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
                {messages.map((msg, index) => (
                    <View key={index} style={[styles.messageRow, msg.role === 'user' ? styles.userRow : styles.aiRow]}>
                        <GlassContainer
                            intensity={msg.role === 'user' ? 10 : 30}
                            style={[
                                styles.messageBubble,
                                msg.role === 'user' ? styles.userBubble : styles.aiBubble
                            ]}
                        >
                            {msg.image && <Image source={{ uri: msg.image }} style={styles.msgImage} />}
                            <View style={styles.msgContainer}>
                                <Text style={[styles.msgText, msg.role === 'user' && { color: '#fff' }]}>{msg.content}</Text>
                                {msg.role === 'assistant' && (
                                    <TouchableOpacity style={styles.speakBtn} onPress={() => speak(msg.content)}>
                                        <Volume2 size={16} color={Colors.primary} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </GlassContainer>
                    </View>
                ))}
                {loading && (
                    <View style={styles.aiRow}>
                        <GlassContainer style={styles.messageBubble}>
                            <Text style={styles.msgText}>Thinking...</Text>
                        </GlassContainer>
                    </View>
                )}
            </ScrollView>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={100}>
                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.iconBtn} onPress={pickImage}><Camera color={Colors.textSecondary} /></TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}><Mic color={Colors.textSecondary} /></TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Talk to NutriGyani..."
                        value={input}
                        onChangeText={setInput}
                        multiline
                    />
                    <TouchableOpacity style={[styles.sendBtn, { opacity: input.trim() ? 1 : 0.5 }]} onPress={handleSend}>
                        <Send color="#fff" size={20} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerRight: { width: 40 },
    chatArea: { flex: 1 },
    chatContent: { padding: 20 },
    messageRow: { marginBottom: 15, maxWidth: '85%' },
    userRow: { alignSelf: 'flex-end' },
    aiRow: { alignSelf: 'flex-start' },
    messageBubble: { padding: 12, borderRadius: 20 },
    userBubble: { backgroundColor: Colors.primary },
    aiBubble: { backgroundColor: 'rgba(255, 255, 255, 0.4)' },
    msgText: { fontSize: 15, lineHeight: 22 },
    msgContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    speakBtn: {
        marginLeft: 10,
        padding: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: 8,
    },
    msgImage: { width: 200, height: 150, borderRadius: 12, marginBottom: 10 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: Colors.surface,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingBottom: 40,
    },
    iconBtn: { padding: 10 },
    input: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        maxHeight: 100,
        marginHorizontal: 10,
    },
    sendBtn: {
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 20,
    },
});
