import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

import DashboardScreen from '../screens/instructor/DashboardScreen';
import BookingRequestsScreen from '../screens/instructor/BookingRequestsScreen';
import InstructorProfileScreen from '../screens/instructor/InstructorProfileScreen';
import AvailabilityScreen from '../screens/instructor/AvailabilityScreen';
import MessagesListScreen from '../screens/shared/MessagesListScreen';

// Stack screens
import InstructorBookingDetailScreen from '../screens/instructor/InstructorBookingDetailScreen';
import ChatScreen from '../screens/shared/ChatScreen';
import VideoCallScreen from '../screens/shared/VideoCallScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function InstructorTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          borderTopColor: Colors.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 8,
          backgroundColor: '#FFFFFF',
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, string> = {
            Dashboard: focused ? 'grid' : 'grid-outline',
            BookingRequests: focused ? 'clipboard' : 'clipboard-outline',
            InstructorProfile: focused ? 'person' : 'person-outline',
            Availability: focused ? 'calendar' : 'calendar-outline',
            Messages: focused ? 'chatbubbles' : 'chatbubbles-outline',
          };
          return <Ionicons name={icons[route.name] as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="BookingRequests" component={BookingRequestsScreen} options={{ title: 'Requests' }} />
      <Tab.Screen name="Availability" component={AvailabilityScreen} />
      <Tab.Screen name="Messages" component={MessagesListScreen} />
      <Tab.Screen name="InstructorProfile" component={InstructorProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

export default function InstructorStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InstructorTabs" component={InstructorTabNavigator} />
      <Stack.Screen name="InstructorBookingDetail" component={InstructorBookingDetailScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="VideoCall" component={VideoCallScreen} />
    </Stack.Navigator>
  );
}
