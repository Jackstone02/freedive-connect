import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomerStackParamList, Booking, BookingStatus } from '../../types';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { MOCK_CUSTOMER_BOOKINGS, isDemoMode } from '../../lib/mockData';
import { useAuthStore } from '../../store/authStore';
import BookingCard from '../../components/BookingCard';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<CustomerStackParamList, 'CustomerTabs'>;

const TABS: { label: string; statuses: BookingStatus[] }[] = [
  { label: 'Upcoming', statuses: ['pending', 'confirmed'] },
  { label: 'Completed', statuses: ['completed'] },
  { label: 'Cancelled', statuses: ['cancelled'] },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const toDateStr = (d: Date) => d.toISOString().split('T')[0];

const STATUS_DOT: Record<BookingStatus, string> = {
  pending: '#F59E0B',
  confirmed: '#10B981',
  completed: '#94A3B8',
  cancelled: '#EF4444',
};

export default function MyBookingsScreen({ navigation }: Props) {
  const { profile } = useAuthStore();
  const [activeTab, setActiveTab] = useState(0);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Calendar state
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [])
  );

  const fetchBookings = async () => {
    if (!profile) return;

    if (isDemoMode(profile.id)) {
      setAllBookings(MOCK_CUSTOMER_BOOKINGS);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    const { data } = await supabase
      .from('bookings')
      .select(`
        *,
        instructor:instructor_profiles(*, profile:profiles(*)),
        lesson_type:lesson_types(*)
      `)
      .eq('customer_id', profile.id)
      .order('booking_date', { ascending: true });

    setAllBookings(data || []);
    setLoading(false);
    setRefreshing(false);
  };

  // ─── Calendar helpers ─────────────────────────────────────────
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfWeek = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const prevMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  // Map date strings to statuses for dot indicators
  const bookingsByDate: Record<string, BookingStatus[]> = {};
  allBookings.forEach((b) => {
    const d = b.booking_date.split('T')[0];
    if (!bookingsByDate[d]) bookingsByDate[d] = [];
    bookingsByDate[d].push(b.status);
  });

  const todayStr = toDateStr(today);

  // ─── Filtered display list ─────────────────────────────────────
  const displayedBookings = selectedDate
    ? allBookings.filter((b) => b.booking_date.split('T')[0] === selectedDate)
    : allBookings.filter((b) => TABS[activeTab].statuses.includes(b.status));

  const totalCount = selectedDate
    ? displayedBookings.length
    : allBookings.filter((b) => TABS[activeTab].statuses.includes(b.status)).length;

  const selectedLabel = selectedDate
    ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      })
    : TABS[activeTab].label;

  // ─── Calendar grid cells ──────────────────────────────────────
  const calendarCells: (number | null)[] = [
    ...Array.from({ length: firstDayOfWeek }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <View style={styles.container}>
      {/* Hero header */}
      <View style={styles.hero}>
        <SafeAreaView edges={['top']}>
          <View style={styles.heroContent}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroTitle}>My Bookings</Text>
              <Text style={styles.heroSub}>
                {totalCount} booking{totalCount !== 1 ? 's' : ''} · {selectedLabel}
              </Text>
            </View>
            <View style={styles.heroIconWrap}>
              <Ionicons name="calendar" size={26} color={Colors.accent} />
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* ── Calendar ─────────────────────────────────────────── */}
      <View style={styles.calendarCard}>
        {/* Month navigation */}
        <View style={styles.calMonthRow}>
          <TouchableOpacity onPress={prevMonth} style={styles.calArrow}>
            <Ionicons name="chevron-back" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.calMonthLabel}>
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </Text>
          <TouchableOpacity onPress={nextMonth} style={styles.calArrow}>
            <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Day headers */}
        <View style={styles.calDayRow}>
          {DAYS.map((d) => (
            <Text key={d} style={styles.calDayHeader}>{d}</Text>
          ))}
        </View>

        {/* Grid */}
        <View style={styles.calGrid}>
          {calendarCells.map((day, idx) => {
            if (!day) return <View key={`empty-${idx}`} style={styles.calCell} />;

            const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;
            const statuses = bookingsByDate[dateStr] ?? [];

            return (
              <TouchableOpacity
                key={dateStr}
                style={[
                  styles.calCell,
                  isToday && !isSelected && styles.calCellToday,
                  isSelected && styles.calCellSelected,
                ]}
                onPress={() => setSelectedDate(isSelected ? null : dateStr)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.calDayNum,
                    isToday && !isSelected && styles.calDayNumToday,
                    isSelected && styles.calDayNumSelected,
                  ]}
                >
                  {day}
                </Text>
                {/* Status dots */}
                {statuses.length > 0 && (
                  <View style={styles.dotsRow}>
                    {[...new Set(statuses)].slice(0, 3).map((s) => (
                      <View
                        key={s}
                        style={[styles.dot, { backgroundColor: STATUS_DOT[s] }]}
                      />
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          {[
            { label: 'Pending', color: STATUS_DOT.pending },
            { label: 'Confirmed', color: STATUS_DOT.confirmed },
            { label: 'Completed', color: STATUS_DOT.completed },
            { label: 'Cancelled', color: STATUS_DOT.cancelled },
          ].map(({ label, color }) => (
            <View key={label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text style={styles.legendLabel}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Tab pills (only visible when no date selected) ───── */}
      {!selectedDate && (
        <View style={styles.tabsContainer}>
          <View style={styles.tabs}>
            {TABS.map((tab, i) => (
              <TouchableOpacity
                key={tab.label}
                style={[styles.tab, activeTab === i && styles.tabActive]}
                onPress={() => {
                  setActiveTab(i);
                  setLoading(true);
                  fetchBookings();
                }}
              >
                <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* ── Selected date clear pill ─────────────────────────── */}
      {selectedDate && (
        <TouchableOpacity
          style={styles.clearPill}
          onPress={() => setSelectedDate(null)}
        >
          <Ionicons name="close-circle" size={16} color={Colors.primary} />
          <Text style={styles.clearPillText}>
            Showing {selectedLabel} · tap to clear
          </Text>
        </TouchableOpacity>
      )}

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
      ) : (
        <FlatList
          data={displayedBookings}
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
                <Ionicons name="calendar-outline" size={40} color={Colors.primary} />
              </View>
              <Text style={styles.emptyText}>
                {selectedDate ? 'No bookings on this day' : 'No bookings here yet'}
              </Text>
              <Text style={styles.emptySubText}>
                {selectedDate
                  ? 'Select another date or clear the filter.'
                  : activeTab === 0
                  ? 'Browse instructors to book your first session.'
                  : 'Your completed sessions will appear here.'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              viewAs="customer"
              onPress={() =>
                (navigation as any).navigate('BookingDetail', { booking_id: item.id })
              }
              onReview={
                item.status === 'completed'
                  ? () =>
                      (navigation as any).navigate('LeaveReview', {
                        booking_id: item.id,
                        instructor_id: item.instructor_id,
                      })
                  : undefined
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

  // Hero
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

  // Calendar card
  calendarCard: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  calMonthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  calArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  calMonthLabel: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
  },
  calDayRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  calDayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
    paddingVertical: 2,
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    paddingVertical: 2,
  },
  calCellToday: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  calCellSelected: {
    backgroundColor: Colors.primary,
  },
  calDayNum: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: '500',
  },
  calDayNumToday: {
    color: Colors.primary,
    fontWeight: '700',
  },
  calDayNumSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 1,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },

  // Legend
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexWrap: 'wrap',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 11, color: Colors.textSecondary },

  // Tab pills
  tabsContainer: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
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
  tabText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: '#fff' },

  // Clear pill
  clearPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary + '15',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  clearPillText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: '600',
  },

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
