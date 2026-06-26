import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { GlassContainer } from '../components/ui/GlassContainer';
import { supabase } from '../lib/supabase';

export const AuthScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) Alert.alert('Error', error.message);
        setLoading(false);
    };

    const handleSignUp = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) Alert.alert('Error', error.message);
        else Alert.alert('Success', 'Check your email for the confirmation link!');
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <GlassContainer style={styles.card}>
                <Text style={[Typography.h2, { color: Colors.primary, marginBottom: 20 }]}>Welcome to NutriGyani</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: Colors.primary }]}
                    onPress={handleSignIn}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={[Typography.button, { color: '#fff' }]}>Sign In</Text>}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: Colors.secondary, marginTop: 10 }]}
                    onPress={handleSignUp}
                    disabled={loading}
                >
                    <Text style={[Typography.button, { color: '#fff' }]}>Sign Up</Text>
                </TouchableOpacity>
            </GlassContainer>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: Colors.background,
    },
    card: {
        padding: 30,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    button: {
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
});
