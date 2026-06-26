import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { GlassContainer } from '../components/ui/GlassContainer';
import { FileText, Download, Share2, Calendar } from 'lucide-react-native';
import { reportService } from '../services/reports';

export const ReportsScreen = () => {
    const [loading, setLoading] = useState(false);

    const generateReport = async () => {
        setLoading(true);
        try {
            const mockData = {
                averageScore: 82,
                totalCalories: 1850,
                avgProtein: 75,
                avgCarbs: 210,
                coachAdvice: "Bohot badiya progress! You have been consistent with your protein intake. Try adding more local leafy greens like Palak to your lunch for better fiber index.",
                recommendations: [
                    "Swap afternoon biscuits for a handful of roasted Makhana.",
                    "Increase water intake by 500ml daily.",
                    "Maintain the 8-hour sleep window you started this week."
                ]
            };
            await reportService.generateWeeklyPDF(mockData);
        } catch (error) {
            Alert.alert('Error', 'Failed to generate report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={Typography.h2}>Health Reports</Text>
            </View>

            <GlassContainer style={styles.summaryCard}>
                <View style={styles.summaryInfo}>
                    <FileText color={Colors.primary} size={32} />
                    <View style={{ marginLeft: 16 }}>
                        <Text style={Typography.h3}>Weekly Summary</Text>
                        <Text style={Typography.bodySmall}>Available for June 20 - 26</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.generateBtn, { backgroundColor: Colors.primary }]}
                    onPress={generateReport}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Text style={[Typography.button, { color: '#fff', marginRight: 8 }]}>Generate PDF</Text>
                            <Download color="#fff" size={20} />
                        </>
                    )}
                </TouchableOpacity>
            </GlassContainer>

            <Text style={[Typography.h3, { paddingHorizontal: 20, marginBottom: 15 }]}>Past Reports</Text>

            <View style={{ paddingHorizontal: 20 }}>
                <GlassContainer style={styles.pastReport}>
                    <View style={styles.reportDate}>
                        <Calendar size={18} color={Colors.textSecondary} />
                        <Text style={[Typography.bodySmall, { marginLeft: 8 }]}>June 13 - 19, 2026</Text>
                    </View>
                    <TouchableOpacity><Share2 size={20} color={Colors.primary} /></TouchableOpacity>
                </GlassContainer>
            </View>
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
        marginBottom: 20,
    },
    summaryCard: {
        margin: 20,
        padding: 24,
    },
    summaryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    generateBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
    },
    pastReport: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    reportDate: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
