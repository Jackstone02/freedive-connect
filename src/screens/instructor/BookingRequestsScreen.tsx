import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Booking, BookingStatus } from '../../types';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { MOCK_INSTRUCTOR_BOOKINGS, isDemoMode } from '../../lib/mockData';
import { useAuthStore } from '../../store/authStore';
import BookingCard from '../../components/BookingCard';

const TABS: { label: string; statuses: BookingStatus[] }[] = [
  { label: 'Pending', statuses: ['pending'] },
  { label: 'Confirmed', statuses: ['confirmed'] },
  { label: 'Completed', statuses: ['completed'] },
  { label: 'Cancelled', statuses: ['cancelled'] },
];

export default function BookingRequestsScreen({ navigation }: any) {
  const { profile, instructorProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [activeTab])
  );

  const fetchBookings = async () => {
    if (!instructorProfile) return;
    const statuses = TABS[activeTab].statuses;

    if (isDemoMode(profile?.id)) {
      const filtered = MOCK_INSTRUCTOR_BOOKINGS.filter((b) =>
        statuses.includes(b.status)
      );
      setBookings(filtered);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    const { data } = await supabase
      .from('bookings')
      .select(`
        *,
        customer:profiles(*),
        lesson_type:lesson_types(*)
      `)
      .eq('instructor_id', instructorProfile.id)
      .in('status', statuses)
      .order('booking_date', { ascending: true });

    setBookings(data || []);
    setLoading(false);
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {/* Hero header */}
      <View style={styles.hero}>
        <SafeAreaView edges={['top']}>
          <View style={styles.heroContent}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroTitle}>Booking Requests</Text>
              <Text style={styles.heroSub}>Manage your incoming bookings</Text>
            </View>
            <View style={styles.heroIconWrap}>
              <Ionicons name="clipboard" size={26} color={Colors.accent} />
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* Pill tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabs}>
          {TABS.map((tab, i) => (
            <TouchableOpacity
              key={tab.label}
              style={[styles.tab, activeTab === i && styles.tabActive]}
              onPress={() => {
                setActiveTab(i);
                setLoading(true);
              }}
            >
              <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchBookings();
              }}
              colors={[Colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="clipboard-outline" size={40} color={Colors.primary} />
              </View>
              <Text style={styles.emptyText}>
                {activeTab === 0 ? 'No pending requests' : 'No bookings here'}
              </Text>
              <Text style={styles.emptySubText}>
                {activeTab === 0
                  ? 'New booking requests will appear here.'
                  : 'This section will populate as bookings progress.'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              viewAs="instructor"
              onPress={() =>
                navigation.navigate('InstructorBookingDetail', { booking_id: item.id })
              }
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  hero: {
    backgroundColor: Colors.primaryDeep,
    paddingBottom: Spacing.lg,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  heroLeft: {},
  heroTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: '#FFFFFF' },
  heroSub: { fontSize: FontSize.xs, color: Colors.accentLight, marginTop: 3 },
  heroIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF18',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF30',
  },

  tabsContainer: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.xs + 2,
    alignItems: 'center',
    borderRadius: Radius.full,
  },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: '#fff', fontSize: FontSize.xs },

  list: { padding: Spacing.md, gap: Spacing.sm },

  emptyState: { alignItems: 'center', paddingTop: Spacing.xxl, gap: Spacing.sm },
  emptyIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  emptyText: { color: Colors.text, fontSize: FontSize.lg, fontWeight: '700' },
  emptySubText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
    lineHeight: 20,
  },
});
