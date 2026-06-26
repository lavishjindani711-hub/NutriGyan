import React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../../theme/colors';

interface GlassContainerProps extends ViewProps {
    intensity?: number;
    tint?: 'light' | 'dark' | 'default';
    borderRadius?: number;
    style?: StyleProp<ViewStyle>;
}


export const GlassContainer: React.FC<GlassContainerProps> = ({
    children,
    intensity = 30,
    tint = 'light',
    borderRadius = 24,
    style,
    ...props
}) => {
    return (
        <View style={[styles.container, { borderRadius }, style]} {...props}>
            <BlurView
                intensity={intensity}
                tint={tint}
                style={[StyleSheet.absoluteFill, { borderRadius }]}
            />
            <View style={styles.content}>{children}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    content: {
        padding: 20,
    },
});
