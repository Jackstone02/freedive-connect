import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { MOCK_INSTRUCTOR_BOOKINGS, isDemoMode } from '../../lib/mockData';
import { useAuthStore } from '../../store/authStore';
import { Booking } from '../../types';

const QUICK_ACTIONS = [
  { key: 'BookingRequests', label: 'View Requests', icon: 'clipboard-outline' as const, color: Colors.primary },
  { key: 'Availability', label: 'Set Availability', icon: 'calendar-outline' as const, color: Colors.accent },
  { key: 'InstructorProfile', label: 'Edit Profile', icon: 'create-outline' as const, color: Colors.success },
];

export default function DashboardScreen({ navigation }: any) {
  const { profile, instructorProfile } = useAuthStore();
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    if (!instructorProfile) return;

    if (isDemoMode(profile?.id)) {
      const today = new Date().toISOString().split('T')[0];
      const todayData = MOCK_INSTRUCTOR_BOOKINGS.filter(
        (b) => b.booking_date === today && ['confirmed', 'pending'].includes(b.status)
      );
      const pending = MOCK_INSTRUCTOR_BOOKINGS.filter((b) => b.status === 'pending');
      setTodayBookings(todayData);
      setPendingCount(pending.length);
      setLoading(false);
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    const [{ data: todayData }, { count }] = await Promise.all([
      supabase
        .from('bookings')
        .select('*, customer:profiles(*), lesson_type:lesson_types(*)')
        .eq('instructor_id', instructorProfile.id)
        .eq('booking_date', today)
        .in('status', ['confirmed', 'pending']),
      supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('instructor_id', instructorProfile.id)
        .eq('status', 'pending'),
    ]);

    setTodayBookings(todayData || []);
    setPendingCount(count || 0);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Instructor';

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>

        {/* Greeting header */}
        <View style={styles.greetingCard}>
          {/* Decorative rings */}
          <View style={styles.decorRing1} />
          <View style={styles.decorRing2} />

          <View style={styles.greetingLeft}>
            <Text style={styles.greetingHello}>Hello, {firstName}!</Text>
            <Text style={styles.greetingSub}>FreeDive Connect Instructor</Text>
          </View>
          {instructorProfile?.is_active ? (
            <View style={styles.activeBadge}>
              <View style={styles.activeDot} />
              <Text style={styles.activeText}>Active</Text>
            </View>
          ) : (
            <View style={styles.inactiveBadge}>
              <Text style={styles.inactiveText}>Inactive</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderTopColor: Colors.warning }]}>
            <Ionicons name="warning-outline" size={16} color={Colors.warning} style={styles.statIcon} />
            <Text style={[styles.statValue, { color: Colors.warning }]}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={[styles.statCard, { borderTopColor: Colors.primary }]}>
            <Ionicons name="calendar-outline" size={16} color={Colors.primary} style={styles.statIcon} />
            <Text style={[styles.statValue, { color: Colors.primary }]}>{todayBookings.length}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
          <View style={[styles.statCard, { borderTopColor: Colors.accent }]}>
            <Ionicons name="star-outline" size={16} color={Colors.accent} style={styles.statIcon} />
            <Text style={[styles.statValue, { color: Colors.accent }]}>
              {instructorProfile?.rating_avg?.toFixed(1) ?? '—'}
            </Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.key}
              style={styles.actionBtn}
              onPress={() => navigation.navigate(action.key)}
              activeOpacity={0.8}
            >
              {action.key === 'BookingRequests' && pendingCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{pendingCount}</Text>
                </View>
              )}
              <View style={[styles.actionIconWrap, { backgroundColor: action.color + '18' }]}>
                <Ionicons name={action.icon} size={24} color={action.color} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Today's sessions */}
        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionTitleAccent} />
          <Text style={styles.sectionTitleAccented}>Today's Sessions</Text>
        </View>
        {todayBookings.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="sunny-outline" size={32} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No sessions scheduled for today.</Text>
          </View>
        ) : (
          todayBookings.map((booking) => (
            <TouchableOpacity
              key={booking.id}
              style={styles.bookingCard}
              onPress={() => navigation.navigate('InstructorBookingDetail', { booking_id: booking.id })}
              activeOpacity={0.85}
            >
              <View style={[styles.bookingAccent, { backgroundColor: Colors[booking.status as keyof typeof Colors] as string }]} />
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingCustomer}>
                  {(booking.customer as any)?.full_name}
                </Text>
                <View style={styles.bookingMetaRow}>
                  <Ionicons name="time-outline" size={12} color={Colors.textSecondary} />
                  <Text style={styles.bookingMeta}> {booking.start_time} · {(booking.lesson_type as any)?.name}</Text>
                </View>
                <View style={styles.bookingMetaRow}>
                  <Ionicons name="people-outline" size={12} color={Colors.textSecondary} />
                  <Text style={styles.bookingMeta}> {booking.participants_count} participant(s)</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: (Colors[booking.status as keyof typeof Colors] as string) + '20' }]}>
                <Text style={[styles.statusText, { color: Colors[booking.status as keyof typeof Colors] as string }]}>
                  {booking.status}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  inner: { padding: Spacing.lg, paddingBottom: Spacing.xxl },

  greetingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primaryDeep,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  decorRing1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: '#FFFFFF18',
    right: -30,
    top: -40,
  },
  decorRing2: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: '#FFFFFF25',
    right: 10,
    top: 0,
  },
  greetingLeft: {},
  greetingHello: { fontSize: FontSize.xl, fontWeight: '800', color: '#FFFFFF' },
  greetingSub: { fontSize: FontSize.xs, color: Colors.accentLight, marginTop: 2 },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.success + '25',
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.success + '50',
  },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  activeText: { color: Colors.success, fontSize: FontSize.xs, fontWeight: '700' },
  inactiveBadge: {
    backgroundColor: Colors.warning + '25',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  inactiveText: { color: Colors.warning, fontSize: FontSize.xs, fontWeight: '700' },

  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderTopWidth: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIcon: { marginBottom: 4 },
  statValue: { fontSize: FontSize.xxl, fontWeight: '800' },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, textAlign: 'center', marginTop: 2 },

  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm },

  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitleAccent: {
    width: 3,
    height: 18,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginRight: Spacing.xs,
  },
  sectionTitleAccented: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
    paddingLeft: 4,
    borderLeftWidth: 0,
  },

  actionsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  actionBtn: {
    flex: 1,
    backgroundColor: Colors.surfaceBlue,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  actionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { fontSize: FontSize.xs, color: Colors.text, textAlign: 'center', fontWeight: '600' },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },

  bookingCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  bookingAccent: { width: 4, alignSelf: 'stretch' },
  bookingInfo: { flex: 1, padding: Spacing.md },
  bookingCustomer: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginBottom: 3 },
  bookingMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 1 },
  bookingMeta: { fontSize: FontSize.xs, color: Colors.textSecondary },
  statusBadge: { borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, marginRight: Spacing.md },
  statusText: { fontSize: FontSize.xs, fontWeight: '700', textTransform: 'capitalize' },

  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyText: { color: Colors.textSecondary, fontSize: FontSize.sm, textAlign: 'center' },
});
