import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Animated } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { GlassContainer } from '../components/ui/GlassContainer';
import { Activity, Flame, Utensils, Zap, TrendingUp } from 'lucide-react-native';

export const HomeScreen = () => {
    const fadeAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <View>
                    <Text style={Typography.bodySmall}>Namaste,</Text>
                    <Text style={Typography.h2}>Let's get healthy!</Text>
                </View>
                <TouchableOpacity>
                    <Image
                        source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nutri' }}
                        style={styles.avatar}
                    />
                </TouchableOpacity>
            </View>

            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
                <GlassContainer style={styles.scoreBoard}>
                    <View style={styles.scoreInfo}>
                        <View style={styles.scoreBadge}>
                            <TrendingUp size={12} color={Colors.primary} />
                            <Text style={[Typography.caption, { color: Colors.primary, marginLeft: 4 }]}>+5% since yesterday</Text>
                        </View>
                        <Text style={[Typography.body, { color: Colors.primary, marginTop: 8 }]}>Daily Nutrition Score</Text>
                        <Text style={[Typography.h1, { fontSize: 48, marginTop: 4 }]}>85</Text>
                        <Text style={[Typography.caption, { color: Colors.secondary }]}>Bohot badiya! You're doing great.</Text>
                    </View>
                    <Zap color={Colors.secondary} size={40} />
                </GlassContainer>
            </Animated.View>

            <View style={styles.grid}>
                <GlassContainer style={styles.statCard}>
                    <Flame color={Colors.error} size={24} />
                    <Text style={[Typography.h3, { marginTop: 8 }]}>1,240</Text>
                    <Text style={Typography.caption}>Calories</Text>
                </GlassContainer>
                <GlassContainer style={styles.statCard}>
                    <Zap color={Colors.primary} size={24} />
                    <Text style={[Typography.h3, { marginTop: 8 }]}>65g</Text>
                    <Text style={Typography.caption}>Protein</Text>
                </GlassContainer>
            </View>

            <Text style={[Typography.h3, { marginTop: 24, marginBottom: 16 }]}>Today's Recommendation</Text>

            <TouchableOpacity style={styles.mealCard}>
                <View style={styles.mealImageContainer}>
                    <View style={styles.mealBadge}><Text style={styles.badgeText}>Lunch</Text></View>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200' }}
                        style={styles.mealThumb}
                    />
                </View>
                <View style={styles.mealInfo}>
                    <Text style={Typography.h3}>Quinoa Pulao</Text>
                    <Text style={Typography.bodySmall}>Indian style with local veggies</Text>
                    <View style={styles.mealStats}>
                        <Text style={Typography.caption}>🔥 350 kcal</Text>
                        <Text style={Typography.caption}>💪 12g protein</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: 24,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.glass,
    },
    scoreBoard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    scoreInfo: {
        flex: 1,
    },
    scoreBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(27, 67, 50, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statCard: {
        width: '48%',
        alignItems: 'center',
        paddingVertical: 15,
    },
    mealCard: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        borderRadius: 24,
        padding: 12,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    mealImageContainer: {
        position: 'relative',
    },
    mealThumb: {
        width: 80,
        height: 80,
        borderRadius: 16,
    },
    mealBadge: {
        position: 'absolute',
        top: -8,
        left: -8,
        backgroundColor: Colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        zIndex: 1,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    mealInfo: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    mealStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
});
