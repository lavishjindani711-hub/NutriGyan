import { TextStyle } from 'react-native';

export const Typography: Record<string, TextStyle> = {
    h1: {
        fontSize: 32,
        fontWeight: '700',
        lineHeight: 40,
        color: '#121212',
    },
    h2: {
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 32,
        color: '#121212',
    },
    h3: {
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 28,
        color: '#121212',
    },
    body: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        color: '#121212',
    },
    bodySmall: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
        color: '#666666',
    },
    button: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 24,
    },
    caption: {
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 16,
        color: '#666666',
    },
};
