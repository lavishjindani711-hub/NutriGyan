import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { GlassContainer } from '../components/ui/GlassContainer';
import { Plus, Refrigerator, ShoppingBasket, Zap, ChefHat } from 'lucide-react-native';
import { aiService } from '../services/ai';

const INITIAL_INVENTORY = [
    { id: '1', name: 'Alphonso Mangoes', quantity: '4 pieces', cat: 'Fruits' },
    { id: '2', name: 'Paneer', quantity: '200g', cat: 'Dairy' },
    { id: '3', name: 'Greek Yogurt', quantity: '1 pack', cat: 'Dairy' },
    { id: '4', name: 'Spinach', quantity: '1 bunch', cat: 'Veg' },
];

export const KitchenScreen = () => {
    const [loading, setLoading] = useState(false);
    const [recipe, setRecipe] = useState<string | null>(null);

    const suggestRecipe = async () => {
        setLoading(true);
        try {
            const inventoryNames = INITIAL_INVENTORY.map(i => i.name).join(', ');
            const prompt = `I have ${inventoryNames}. Suggest a healthy Indian recipe I can make in 15 mins. Give a short, catchy title and 3-4 steps.`;
            const response = await aiService.getChatResponse([{ role: 'user', content: prompt }]);
            setRecipe(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={Typography.h2}>Smart Kitchen</Text>
                <TouchableOpacity style={styles.addBtn}><Plus color="#fff" /></TouchableOpacity>
            </View>

            <TouchableOpacity onPress={suggestRecipe} disabled={loading}>
                <GlassContainer style={styles.scanBanner}>
                    <View style={styles.bannerText}>
                        <Text style={[Typography.h3, { color: Colors.primary }]}>What to cook?</Text>
                        <Text style={Typography.bodySmall}>AI suggestion based on your fridge!</Text>
                    </View>
                    {loading ? <ActivityIndicator color={Colors.primary} /> : <ChefHat size={40} color={Colors.primary} />}
                </GlassContainer>
            </TouchableOpacity>

            {recipe && (
                <GlassContainer style={styles.recipeCard}>
                    <View style={styles.recipeHeader}>
                        <Zap size={16} color={Colors.secondary} />
                        <Text style={[Typography.h3, { marginLeft: 8 }]}>Quick Suggestion</Text>
                    </View>
                    <Text style={[Typography.bodySmall, { marginTop: 8 }]}>{recipe}</Text>
                    <TouchableOpacity onPress={() => setRecipe(null)} style={{ marginTop: 15 }}>
                        <Text style={[Typography.caption, { color: Colors.primary, textAlign: 'right' }]}>Clear</Text>
                    </TouchableOpacity>
                </GlassContainer>
            )}

            <View style={styles.sectionHeader}>
                <Text style={Typography.h3}>Your Inventory</Text>
                <ShoppingBasket color={Colors.textSecondary} size={20} />
            </View>

            <FlatList
                data={INITIAL_INVENTORY}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <GlassContainer style={styles.itemCard}>
                        <View>
                            <Text style={Typography.h3}>{item.name}</Text>
                            <Text style={Typography.caption}>{item.cat}</Text>
                        </View>
                        <Text style={[Typography.body, { color: Colors.primary }]}>{item.quantity}</Text>
                    </GlassContainer>
                )}
                contentContainerStyle={styles.listContent}
            />
        </View>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    addBtn: {
        backgroundColor: Colors.primary,
        padding: 8,
        borderRadius: 12,
    },
    scanBanner: {
        margin: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    recipeCard: {
        margin: 20,
        marginTop: 0,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.secondary,
        backgroundColor: 'rgba(251, 140, 0, 0.05)',
    },
    recipeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bannerText: { flex: 1, marginRight: 10 },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    listContent: { padding: 20 },
    itemCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
});
