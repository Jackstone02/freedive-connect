import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AvailabilitySlot, Booking } from '../../types';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { useFocusEffect } from '@react-navigation/native';
import { getMockSlots, isDemoMode, MOCK_INSTRUCTOR_BOOKINGS } from '../../lib/mockData';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const todayStr = new Date().toISOString().split('T')[0];

const toDateStr = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

export default function AvailabilityScreen({ navigation }: any) {
  const { instructorProfile } = useAuthStore();

  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // Add slot form
  const [showAddForm, setShowAddForm] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    if (!instructorProfile) return;

    if (isDemoMode(instructorProfile.user_id)) {
      setSlots(getMockSlots(instructorProfile.id));
      setBookings(MOCK_INSTRUCTOR_BOOKINGS as any);
      return;
    }

    const [{ data: slotsData }, { data: bookingsData }] = await Promise.all([
      supabase
        .from('availability_slots')
        .select('*')
        .eq('instructor_id', instructorProfile.id)
        .gte('slot_date', todayStr)
        .order('slot_date')
        .order('start_time'),
      supabase
        .from('bookings')
        .select('*, customer:profiles(*), lesson_type:lesson_types(*)')
        .eq('instructor_id', instructorProfile.id)
        .gte('booking_date', todayStr)
        .order('booking_date'),
    ]);

    setSlots(slotsData || []);
    setBookings(bookingsData || []);
  };

  // ── Calendar helpers ──────────────────────────────────────────
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = () => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() - 1);
    setCurrentMonth(d);
  };
  const nextMonth = () => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() + 1);
    setCurrentMonth(d);
  };

  // Dot indicator sets
  const openSlotDates  = new Set(slots.filter(s => !s.is_booked).map(s => s.slot_date));
  const pendingDates   = new Set(bookings.filter(b => b.status === 'pending').map(b => b.booking_date));
  const confirmedDates = new Set(bookings.filter(b => b.status === 'confirmed').map(b => b.booking_date));

  // Selected date data
  const selectedSlots    = slots.filter(s => s.slot_date === selectedDate);
  const selectedBookings = bookings.filter(b => b.booking_date === selectedDate);

  // ── Add / Delete slot ─────────────────────────────────────────
  const addSlot = async () => {
    if (!instructorProfile) return;
    const start = startTime.toTimeString().slice(0, 5);
    const end   = endTime.toTimeString().slice(0, 5);
    if (start >= end) {
      Alert.alert('Invalid Time', 'End time must be after start time.');
      return;
    }

    if (isDemoMode(instructorProfile.user_id)) {
      const newSlot: AvailabilitySlot = {
        id: `dslot-local-${Date.now()}`,
        instructor_id: instructorProfile.id,
        slot_date: selectedDate,
        start_time: start,
        end_time: end,
        is_booked: false,
      };
      setSlots(prev =>
        [...prev, newSlot].sort(
          (a, b) =>
            a.slot_date.localeCompare(b.slot_date) ||
            a.start_time.localeCompare(b.start_time)
        )
      );
      setShowAddForm(false);
      return;
    }

    const { error } = await supabase.from('availability_slots').insert({
      instructor_id: instructorProfile.id,
      slot_date: selectedDate,
      start_time: start,
      end_time: end,
      is_booked: false,
    });
    if (error) {
      Alert.alert('Error', 'Failed to add slot.');
    } else {
      fetchData();
      setShowAddForm(false);
    }
  };

  const deleteSlot = (slotId: string, isBooked: boolean) => {
    if (isBooked) {
      Alert.alert('Cannot Delete', 'This slot already has a booking.');
      return;
    }
    Alert.alert('Delete Slot', 'Remove this availability slot?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          if (isDemoMode(instructorProfile?.user_id)) {
            setSlots(prev => prev.filter(s => s.id !== slotId));
            return;
          }
          await supabase.from('availability_slots').delete().eq('id', slotId);
          setSlots(prev => prev.filter(s => s.id !== slotId));
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Hero */}
      <View style={styles.hero}>
        <SafeAreaView edges={['top']}>
          <View style={styles.heroContent}>
            <View>
              <Text style={styles.heroTitle}>My Schedule</Text>
              <Text style={styles.heroSub}>Calendar & availability</Text>
            </View>
            <View style={styles.heroIconWrap}>
              <Ionicons name="calendar" size={26} color={Colors.accent} />
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>

        {/* ── Month navigation ─────────────────────────── */}
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={prevMonth} style={styles.monthNavBtn}>
            <Ionicons name="chevron-back" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>{MONTHS[month]} {year}</Text>
          <TouchableOpacity onPress={nextMonth} style={styles.monthNavBtn}>
            <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* ── Calendar grid ────────────────────────────── */}
        <View style={styles.calendar}>
          {/* Weekday headers */}
          <View style={styles.weekRow}>
            {WEEKDAYS.map(d => (
              <Text key={d} style={styles.weekDay}>{d}</Text>
            ))}
          </View>

          {/* Day cells */}
          {Array.from({ length: cells.length / 7 }, (_, row) => (
            <View key={row} style={styles.weekRow}>
              {cells.slice(row * 7, row * 7 + 7).map((day, col) => {
                if (!day) return <View key={col} style={styles.dayCell} />;
                const dateStr = toDateStr(year, month, day);
                const isSelected = dateStr === selectedDate;
                const isToday    = dateStr === todayStr;
                const hasOpen    = openSlotDates.has(dateStr);
                const hasPending = pendingDates.has(dateStr);
                const hasConf    = confirmedDates.has(dateStr);
                return (
                  <TouchableOpacity
                    key={col}
                    style={[
                      styles.dayCell,
                      isSelected && styles.dayCellSelected,
                      isToday && !isSelected && styles.dayCellToday,
                    ]}
                    onPress={() => { setSelectedDate(dateStr); setShowAddForm(false); }}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.dayNum,
                      isSelected && styles.dayNumSelected,
                      isToday && !isSelected && styles.dayNumToday,
                    ]}>
                      {day}
                    </Text>
                    <View style={styles.dots}>
                      {hasOpen    && <View style={[styles.dot, { backgroundColor: Colors.primary }]} />}
                      {hasPending && <View style={[styles.dot, { backgroundColor: Colors.warning }]} />}
                      {hasConf    && <View style={[styles.dot, { backgroundColor: Colors.success }]} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
            <Text style={styles.legendText}>Open slot</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.warning }]} />
            <Text style={styles.legendText}>Pending</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
            <Text style={styles.legendText}>Confirmed</Text>
          </View>
        </View>

        {/* ── Selected date detail panel ────────────────── */}
        <View style={styles.panel}>
          <Text style={styles.panelDate}>
            {new Date(selectedDate + 'T00:00').toLocaleDateString('en-PH', {
              weekday: 'long', month: 'long', day: 'numeric',
            })}
          </Text>

          {/* Bookings for selected date */}
          {selectedBookings.length > 0 && (
            <>
              <Text style={styles.panelLabel}>Bookings</Text>
              {selectedBookings.map(b => {
                const statusColor =
                  b.status === 'confirmed' ? Colors.success :
                  b.status === 'pending'   ? Colors.warning : Colors.textMuted;
                return (
                  <TouchableOpacity
                    key={b.id}
                    style={styles.bookingRow}
                    onPress={() => navigation.navigate('InstructorBookingDetail', { booking_id: b.id })}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.bookingAccent, { backgroundColor: statusColor }]} />
                    <View style={styles.bookingBody}>
                      <Text style={styles.bookingName}>
                        {(b.customer as any)?.full_name ?? 'Customer'}
                      </Text>
                      <Text style={styles.bookingMeta}>
                        {b.start_time} · {(b.lesson_type as any)?.name ?? 'Lesson'} · {b.participants_count} pax
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor + '22' }]}>
                      <Text style={[styles.statusText, { color: statusColor }]}>{b.status}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
                  </TouchableOpacity>
                );
              })}
            </>
          )}

          {/* Slots header + Add button */}
          <View style={styles.slotHeader}>
            <Text style={styles.panelLabel}>
              Availability Slots {selectedSlots.length > 0 ? `(${selectedSlots.length})` : ''}
            </Text>
            <TouchableOpacity
              style={[styles.addSlotBtn, showAddForm && styles.addSlotBtnCancel]}
              onPress={() => setShowAddForm(v => !v)}
              activeOpacity={0.8}
            >
              <Ionicons name={showAddForm ? 'close' : 'add'} size={14} color="#fff" />
              <Text style={styles.addSlotBtnText}>{showAddForm ? 'Cancel' : 'Add Slot'}</Text>
            </TouchableOpacity>
          </View>

          {/* Add slot form */}
          {showAddForm && (
            <View style={styles.addForm}>
              <View style={styles.timeRow}>
                <View style={styles.timeField}>
                  <Text style={styles.timeLabel}>Start</Text>
                  <TouchableOpacity style={styles.timeBtn} onPress={() => setShowStartPicker(true)}>
                    <Ionicons name="time-outline" size={15} color={Colors.primary} />
                    <Text style={styles.timeBtnText}> {startTime.toTimeString().slice(0, 5)}</Text>
                  </TouchableOpacity>
                  {showStartPicker && (
                    <DateTimePicker
                      value={startTime}
                      mode="time"
                      onChange={(_, d) => { setShowStartPicker(false); if (d) setStartTime(d); }}
                    />
                  )}
                </View>
                <View style={styles.timeField}>
                  <Text style={styles.timeLabel}>End</Text>
                  <TouchableOpacity style={styles.timeBtn} onPress={() => setShowEndPicker(true)}>
                    <Ionicons name="time-outline" size={15} color={Colors.primary} />
                    <Text style={styles.timeBtnText}> {endTime.toTimeString().slice(0, 5)}</Text>
                  </TouchableOpacity>
                  {showEndPicker && (
                    <DateTimePicker
                      value={endTime}
                      mode="time"
                      onChange={(_, d) => { setShowEndPicker(false); if (d) setEndTime(d); }}
                    />
                  )}
                </View>
              </View>
              <TouchableOpacity style={styles.confirmBtn} onPress={addSlot} activeOpacity={0.85}>
                <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
                <Text style={styles.confirmBtnText}> Confirm Add Slot</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Slot list */}
          {selectedSlots.length === 0 && !showAddForm && (
            <View style={styles.emptyDay}>
              <Ionicons name="time-outline" size={26} color={Colors.textMuted} />
              <Text style={styles.emptyDayText}>No slots set for this day</Text>
              <Text style={styles.emptyDayHint}>Tap "Add Slot" to create one.</Text>
            </View>
          )}
          {selectedSlots.map(slot => (
            <View key={slot.id} style={styles.slotRow}>
              <Ionicons name="time-outline" size={15} color={Colors.textSecondary} />
              <Text style={styles.slotTime}> {slot.start_time} – {slot.end_time}</Text>
              <View style={[
                styles.slotStatus,
                { backgroundColor: slot.is_booked ? Colors.success + '20' : Colors.primary + '15' },
              ]}>
                <Text style={[
                  styles.slotStatusText,
                  { color: slot.is_booked ? Colors.success : Colors.primary },
                ]}>
                  {slot.is_booked ? 'Booked' : 'Open'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => deleteSlot(slot.id, slot.is_booked)}
                style={styles.deleteBtn}
              >
                <Ionicons
                  name="trash-outline"
                  size={16}
                  color={slot.is_booked ? Colors.textMuted : Colors.error}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Hero
  hero: { backgroundColor: Colors.primaryDeep, paddingBottom: Spacing.lg },
  heroContent: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
  },
  heroTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: '#FFFFFF' },
  heroSub: { fontSize: FontSize.xs, color: Colors.accentLight, marginTop: 3 },
  heroIconWrap: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#FFFFFF18', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#FFFFFF30',
  },

  inner: { padding: Spacing.md, paddingBottom: Spacing.xxl },

  // Month nav
  monthNav: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: Spacing.sm,
  },
  monthNavBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  monthTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text },

  // Calendar
  calendar: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border, padding: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  weekRow: { flexDirection: 'row' },
  weekDay: {
    flex: 1, textAlign: 'center', fontSize: 10, fontWeight: '700',
    color: Colors.textMuted, paddingVertical: Spacing.xs,
  },
  dayCell: { flex: 1, alignItems: 'center', paddingVertical: 5, borderRadius: Radius.sm, margin: 1 },
  dayCellSelected: { backgroundColor: Colors.primary },
  dayCellToday: { backgroundColor: Colors.surfaceBlue, borderWidth: 1.5, borderColor: Colors.primary },
  dayNum: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text },
  dayNumSelected: { color: '#fff', fontWeight: '800' },
  dayNumToday: { color: Colors.primary, fontWeight: '800' },
  dots: { flexDirection: 'row', gap: 2, marginTop: 2, minHeight: 5 },
  dot: { width: 4, height: 4, borderRadius: 2 },

  // Legend
  legend: {
    flexDirection: 'row', gap: Spacing.lg,
    marginBottom: Spacing.md, paddingHorizontal: Spacing.xs,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '600' },

  // Panel
  panel: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border, padding: Spacing.md,
  },
  panelDate: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text, marginBottom: Spacing.md },
  panelLabel: {
    fontSize: FontSize.xs, fontWeight: '700', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },

  // Booking row
  bookingRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.background, borderRadius: Radius.md,
    marginBottom: Spacing.xs, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.border,
    paddingRight: Spacing.sm,
  },
  bookingAccent: { width: 4, alignSelf: 'stretch' },
  bookingBody: { flex: 1, paddingVertical: Spacing.sm, paddingLeft: Spacing.sm },
  bookingName: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text },
  bookingMeta: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  statusBadge: { borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 3, marginRight: Spacing.xs },
  statusText: { fontSize: FontSize.xs, fontWeight: '700', textTransform: 'capitalize' },

  // Slot header row
  slotHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginTop: Spacing.md, marginBottom: Spacing.sm,
  },
  addSlotBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingHorizontal: Spacing.md, paddingVertical: 6, gap: 4,
  },
  addSlotBtnCancel: { backgroundColor: Colors.textMuted },
  addSlotBtnText: { fontSize: FontSize.xs, color: '#fff', fontWeight: '700' },

  // Add form
  addForm: {
    backgroundColor: Colors.surfaceBlue, borderRadius: Radius.md,
    padding: Spacing.md, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  timeRow: { flexDirection: 'row', gap: Spacing.md },
  timeField: { flex: 1 },
  timeLabel: {
    fontSize: FontSize.xs, fontWeight: '700', color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  timeBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    padding: Spacing.sm, borderWidth: 1, borderColor: Colors.border,
  },
  timeBtnText: { fontSize: FontSize.sm, color: Colors.text, fontWeight: '500' },
  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primary, borderRadius: Radius.md,
    padding: Spacing.sm, marginTop: Spacing.md,
  },
  confirmBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSize.sm },

  // Slot row
  slotRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.background, borderRadius: Radius.md,
    padding: Spacing.sm, marginBottom: Spacing.xs,
    gap: Spacing.xs, borderWidth: 1, borderColor: Colors.border,
  },
  slotTime: { flex: 1, fontSize: FontSize.sm, color: Colors.text, fontWeight: '600' },
  slotStatus: { borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 3 },
  slotStatusText: { fontSize: FontSize.xs, fontWeight: '700' },
  deleteBtn: { padding: Spacing.xs },

  // Empty
  emptyDay: { alignItems: 'center', paddingVertical: Spacing.lg, gap: 4 },
  emptyDayText: { color: Colors.text, fontSize: FontSize.sm, fontWeight: '600' },
  emptyDayHint: { color: Colors.textMuted, fontSize: FontSize.xs },
});
