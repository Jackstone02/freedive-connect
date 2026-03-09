import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

import HomeMapScreen from '../screens/customer/HomeMapScreen';
import SearchScreen from '../screens/customer/SearchScreen';
import MyBookingsScreen from '../screens/customer/MyBookingsScreen';
import CustomerProfileScreen from '../screens/customer/CustomerProfileScreen';
import MessagesListScreen from '../screens/shared/MessagesListScreen';

// Stack screens (not in tabs)
import InstructorDetailScreen from '../screens/customer/InstructorDetailScreen';
import BookingFormScreen from '../screens/customer/BookingFormScreen';
import BookingConfirmationScreen from '../screens/customer/BookingConfirmationScreen';
import BookingDetailScreen from '../screens/customer/BookingDetailScreen';
import LeaveReviewScreen from '../screens/customer/LeaveReviewScreen';
import ChatScreen from '../screens/shared/ChatScreen';
import VideoCallScreen from '../screens/shared/VideoCallScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CustomerTabNavigator() {
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
            HomeMap: focused ? 'map' : 'map-outline',
            Search: focused ? 'search' : 'search-outline',
            MyBookings: focused ? 'calendar' : 'calendar-outline',
            Messages: focused ? 'chatbubbles' : 'chatbubbles-outline',
            CustomerProfile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name] as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeMap" component={HomeMapScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="MyBookings" component={MyBookingsScreen} options={{ title: 'Bookings' }} />
      <Tab.Screen name="Messages" component={MessagesListScreen} />
      <Tab.Screen name="CustomerProfile" component={CustomerProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

export default function CustomerStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CustomerTabs" component={CustomerTabNavigator} />
      <Stack.Screen name="InstructorDetail" component={InstructorDetailScreen} />
      <Stack.Screen name="BookingForm" component={BookingFormScreen} />
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
      <Stack.Screen name="LeaveReview" component={LeaveReviewScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="VideoCall" component={VideoCallScreen} />
    </Stack.Navigator>
  );
}
