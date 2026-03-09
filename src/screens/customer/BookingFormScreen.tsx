import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomerStackParamList, LessonType, AvailabilitySlot } from '../../types';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { MOCK_LESSON_TYPES, MOCK_SLOTS, isDemoMode } from '../../lib/mockData';
import { useAuthStore } from '../../store/authStore';

type Props = NativeStackScreenProps<CustomerStackParamList, 'BookingForm'>;

export default function BookingFormScreen({ navigation, route }: Props) {
  const { instructor_id, lesson_type_id } = route.params;
  const { profile } = useAuthStore();

  const [lessonType, setLessonType] = useState<LessonType | null>(null);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [participants, setParticipants] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (isDemoMode(profile?.id)) {
      const allLessons = Object.values(MOCK_LESSON_TYPES).flat();
      const lt = allLessons.find((l) => l.id === lesson_type_id) ?? null;
      const availSlots = (MOCK_SLOTS[instructor_id] ?? []).filter((s) => !s.is_booked);
      setLessonType(lt);
      setSlots(availSlots);
      setLoading(false);
      return;
    }

    const [{ data: lt }, { data: availSlots }] = await Promise.all([
      supabase.from('lesson_types').select('*').eq('id', lesson_type_id).single(),
      supabase
        .from('availability_slots')
        .select('*')
        .eq('instructor_id', instructor_id)
        .eq('is_booked', false)
        .gte('slot_date', new Date().toISOString().split('T')[0])
        .order('slot_date')
        .order('start_time'),
    ]);

    setLessonType(lt);
    setSlots(availSlots || []);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!selectedSlot) {
      Alert.alert('Please select a time slot.');
      return;
    }
    if (!profile) return;

    setSubmitting(true);

    if (isDemoMode(profile?.id)) {
      await new Promise((r) => setTimeout(r, 800));
      navigation.replace('BookingConfirmation', { booking_id: 'demo-new-booking' });
      setSubmitting(false);
      return;
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        customer_id: profile.id,
        instructor_id,
        lesson_type_id,
        availability_slot_id: selectedSlot.id,
        booking_date: selectedSlot.slot_date,
        start_time: selectedSlot.start_time,
        participants_count: participants,
        notes: notes || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      Alert.alert('Error', 'Failed to submit booking. Please try again.');
      setSubmitting(false);
      return;
    }

    await supabase
      .from('availability_slots')
      .update({ is_booked: true })
      .eq('id', selectedSlot.id);

    navigation.replace('BookingConfirmation', { booking_id: booking.id });
    setSubmitting(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        {/* Header */}
        <View style={styles.pageHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Book a Session</Text>
        </View>

        {/* Lesson summary card */}
        {lessonType && (
          <View style={styles.lessonCard}>
            <View style={styles.lessonCardAccent} />
            <View style={styles.lessonCardBody}>
              <Text style={styles.lessonName}>{lessonType.name}</Text>
              <Text style={styles.lessonMeta}>
                {lessonType.duration_minutes} min · {lessonType.skill_level} · {lessonType.lesson_format.replace('_', ' ')}
              </Text>
              <Text style={styles.lessonPrice}>₱{lessonType.price.toLocaleString()}</Text>
            </View>
            <Ionicons name="water-outline" size={28} color={Colors.primary + '40'} />
          </View>
        )}

        {/* Time slots */}
        <Text style={styles.sectionLabel}>Select a Time Slot</Text>
        {slots.length === 0 ? (
          <View style={styles.emptySlots}>
            <Ionicons name="calendar-outline" size={28} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No available slots from this instructor yet.</Text>
          </View>
        ) : (
          slots.map((slot) => {
            const isSelected = selectedSlot?.id === slot.id;
            return (
              <TouchableOpacity
                key={slot.id}
                style={[styles.slot, isSelected && styles.slotSelected]}
                onPress={() => setSelectedSlot(slot)}
                activeOpacity={0.8}
              >
                <View style={styles.slotLeft}>
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color={isSelected ? Colors.primary : Colors.textMuted}
                  />
                  <Text style={[styles.slotDate, isSelected && styles.slotTextSelected]}>
                    {' '}{new Date(slot.slot_date).toLocaleDateString('en-PH', {
                      weekday: 'short', month: 'short', day: 'numeric',
                    })}
                  </Text>
                </View>
                <View style={styles.slotRight}>
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={isSelected ? Colors.primary : Colors.textMuted}
                  />
                  <Text style={[styles.slotTime, isSelected && styles.slotTextSelected]}>
                    {' '}{slot.start_time} – {slot.end_time}
                  </Text>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
                )}
              </TouchableOpacity>
            );
          })
        )}

        {/* Participants */}
        {lessonType && lessonType.max_participants > 1 && (
          <>
            <Text style={styles.sectionLabel}>Number of Participants</Text>
            <View style={styles.participantsRow}>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => setParticipants(Math.max(1, participants - 1))}
              >
                <Ionicons name="remove" size={20} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{participants}</Text>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => setParticipants(Math.min(lessonType.max_participants, participants + 1))}
              >
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.participantsMax}>(max {lessonType.max_participants})</Text>
            </View>
          </>
        )}

        {/* Notes */}
        <Text style={styles.sectionLabel}>Notes to Instructor (optional)</Text>
        <View style={styles.notesWrap}>
          <TextInput
            style={styles.notesInput}
            placeholder="Any questions, experience level, etc."
            placeholderTextColor={Colors.textMuted}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, (!selectedSlot || submitting) && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={!selectedSlot || submitting}
          activeOpacity={0.85}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.submitText}>Send Booking Request</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 6 }} />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  inner: { padding: Spacing.lg, paddingBottom: Spacing.xxl },

  pageHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.border,
  },
  title: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text },

  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  lessonCardAccent: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: 4,
    backgroundColor: Colors.primary,
  },
  lessonCardBody: { flex: 1, paddingLeft: Spacing.xs },
  lessonName: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  lessonMeta: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  lessonPrice: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary, marginTop: Spacing.xs },

  sectionLabel: {
    fontSize: FontSize.sm, fontWeight: '700', color: Colors.textSecondary,
    marginBottom: Spacing.sm, marginTop: Spacing.md,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },

  emptySlots: { alignItems: 'center', gap: Spacing.sm, padding: Spacing.xl, backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border },
  emptyText: { color: Colors.textSecondary, fontSize: FontSize.sm, textAlign: 'center' },

  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  slotSelected: { borderColor: Colors.primary, backgroundColor: Colors.surfaceBlue },
  slotLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  slotRight: { flexDirection: 'row', alignItems: 'center' },
  slotDate: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text },
  slotTime: { fontSize: FontSize.sm, color: Colors.textSecondary },
  slotTextSelected: { color: Colors.primary, fontWeight: '700' },

  participantsRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  counterBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  counterValue: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text, minWidth: 30, textAlign: 'center' },
  participantsMax: { fontSize: FontSize.sm, color: Colors.textSecondary },

  notesWrap: { marginBottom: Spacing.lg },
  notesInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontSize: FontSize.md,
    minHeight: 90,
    textAlignVertical: 'top',
    color: Colors.text,
  },

  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    padding: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitDisabled: { opacity: 0.5, shadowOpacity: 0 },
  submitText: { color: '#fff', fontSize: FontSize.md, fontWeight: '700', letterSpacing: 0.5 },
});
