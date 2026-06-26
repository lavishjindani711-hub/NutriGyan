import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { KitchenScreen } from '../screens/KitchenScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { Home, MessageSquare, Refrigerator, FileText } from 'lucide-react-native';
import { Colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: Colors.surface,
                    borderTopColor: Colors.border,
                    height: 60,
                    paddingBottom: 8,
                },
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Coach"
                component={ChatScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <MessageSquare color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Kitchen"
                component={KitchenScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Refrigerator color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Reports"
                component={ReportsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <FileText color={color} size={size} />,
                }}
            />
        </Tab.Navigator>
    );
};
