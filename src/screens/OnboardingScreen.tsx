import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { GlassContainer } from '../components/ui/GlassContainer';
import { ChevronRight, Check } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profile';

const STEPS = [
    { key: 'full_name', question: "Namaste! What's your name?", placeholder: "Your Name", type: 'text' },
    { key: 'age', question: "And how old are you?", placeholder: "Age", type: 'numeric' },
    { key: 'weight_kg', question: "What is your current weight in kg?", placeholder: "Weight in kg", type: 'numeric' },
    { key: 'height_cm', question: "Almost there! Your height in cm?", placeholder: "Height in cm", type: 'numeric' },
    { key: 'dietary_preference', question: "Do you have any dietary preferences? (Veg, Non-Veg, Vegan)", placeholder: "e.g. Veg", type: 'text' },
];

export const OnboardingScreen = ({ onComplete }: { onComplete: () => void }) => {
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<any>({});
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }, [currentStep]);

    const handleNext = async () => {
        if (!inputValue.trim()) return;

        const key = STEPS[currentStep].key;
        const newAnswers = { ...answers, [key]: inputValue };
        setAnswers(newAnswers);
        setInputValue('');

        if (currentStep < STEPS.length - 1) {
            fadeAnim.setValue(0);
            setCurrentStep(currentStep + 1);
        } else {
            setLoading(true);
            try {
                if (user) {
                    await profileService.updateProfile(user.id, newAnswers);
                    onComplete();
                }
            } catch (error) {
                console.error('Onboarding Error:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <View style={styles.header}>
                <View style={styles.progressArea}>
                    {STEPS.map((_, i) => (
                        <View key={i} style={[styles.dot, i <= currentStep && { backgroundColor: Colors.primary }]} />
                    ))}
                </View>
            </View>

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <Text style={[Typography.h2, { color: Colors.primary, marginBottom: 10 }]}>NutriGyani Coach</Text>
                <GlassContainer style={styles.questionCard}>
                    <Text style={Typography.body}>{STEPS[currentStep].question}</Text>
                </GlassContainer>

                <TextInput
                    style={styles.input}
                    placeholder={STEPS[currentStep].placeholder}
                    value={inputValue}
                    onChangeText={setInputValue}
                    keyboardType={STEPS[currentStep].type === 'numeric' ? 'numeric' : 'default'}
                    autoFocus
                />

                <TouchableOpacity
                    style={[styles.nextBtn, { backgroundColor: Colors.primary }]}
                    onPress={handleNext}
                    disabled={loading}
                >
                    {loading ? (
                        <Check color="#fff" />
                    ) : (
                        <ChevronRight color="#fff" />
                    )}
                </TouchableOpacity>
            </Animated.View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    progressArea: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        width: 20,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.border,
    },
    content: {
        flex: 1,
        padding: 30,
        justifyContent: 'center',
    },
    questionCard: {
        marginBottom: 30,
        padding: 24,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        fontSize: 18,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: 20,
    },
    nextBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
});
