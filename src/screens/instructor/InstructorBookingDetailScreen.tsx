import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Booking } from '../../types';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { MOCK_INSTRUCTOR_BOOKINGS, isDemoMode } from '../../lib/mockData';
import { useAuthStore } from '../../store/authStore';

export default function InstructorBookingDetailScreen({ navigation, route }: any) {
  const { booking_id } = route.params;
  const { profile } = useAuthStore();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    if (isDemoMode(profile?.id)) {
      const found = MOCK_INSTRUCTOR_BOOKINGS.find((b) => b.id === booking_id) ?? null;
      setBooking(found);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('bookings')
      .select(`
        *,
        customer:profiles(*),
        lesson_type:lesson_types(*),
        instructor:instructor_profiles(*, profile:profiles(*))
      `)
      .eq('id', booking_id)
      .single();

    setBooking(data);
    setLoading(false);
  };

  const updateStatus = async (status: 'confirmed' | 'cancelled' | 'completed', reason?: string) => {
    if (!booking) return;
    setUpdating(true);

    if (isDemoMode(profile?.id)) {
      await new Promise((r) => setTimeout(r, 500));
      setBooking({ ...booking, status });
      Alert.alert('Done', `Booking ${status}.`);
      setUpdating(false);
      return;
    }

    const updates: any = { status };
    if (reason) updates.cancel_reason = reason;

    const { error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', booking.id);

    if (error) {
      Alert.alert('Error', 'Failed to update booking.');
    } else {
      setBooking({ ...booking, status });
      Alert.alert('Done', `Booking ${status}.`);
    }
    setUpdating(false);
  };

  const handleDecline = () => {
    Alert.alert(
      'Decline Booking',
      'Are you sure you want to decline this booking request?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes, Decline', style: 'destructive', onPress: () => updateStatus('cancelled') },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  if (!booking) return null;

  const customer = booking.customer as any;
  const lessonType = booking.lesson_type as any;
  const statusColors: Record<string, string> = {
    pending: Colors.warning,
    confirmed: Colors.success,
    completed: Colors.textSecondary,
    cancelled: Colors.error,
  };
  const statusColor = statusColors[booking.status] ?? Colors.textSecondary;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        {/* Back + title */}
        <View style={styles.pageHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Booking Detail</Text>
        </View>

        {/* Status banner */}
        <View style={[styles.statusBanner, { backgroundColor: statusColor + '18', borderColor: statusColor + '40' }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {booking.status.toUpperCase()}
          </Text>
        </View>

        {/* Customer info */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Customer</Text>
          <Text style={styles.customerName}>{customer?.full_name}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="call-outline" size={13} color={Colors.textSecondary} />
            <Text style={styles.customerPhone}> {customer?.phone ?? 'No phone provided'}</Text>
          </View>
          {customer?.emergency_contact_name && (
            <View style={styles.emergencyRow}>
              <Ionicons name="alert-circle-outline" size={13} color={Colors.warning} />
              <Text style={styles.emergency}>
                {' '}Emergency: {customer.emergency_contact_name} ({customer.emergency_contact_phone})
              </Text>
            </View>
          )}
        </View>

        {/* Session info */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Session Details</Text>
          {[
            { icon: 'book-outline', label: 'Lesson', val: lessonType?.name },
            { icon: 'calendar-outline', label: 'Date', val: new Date(booking.booking_date).toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
            { icon: 'time-outline', label: 'Time', val: booking.start_time },
            { icon: 'people-outline', label: 'Participants', val: String(booking.participants_count) },
          ].map(({ icon, label, val }) => (
            <View key={label} style={styles.detailRow}>
              <View style={styles.detailKeyRow}>
                <Ionicons name={icon as any} size={13} color={Colors.textMuted} />
                <Text style={styles.detailKey}> {label}</Text>
              </View>
              <Text style={styles.detailVal}>{val}</Text>
            </View>
          ))}
          {booking.notes && (
            <View style={styles.notesBox}>
              <Ionicons name="chatbubble-outline" size={13} color={Colors.textMuted} />
              <Text style={styles.notesText}> {booking.notes}</Text>
            </View>
          )}
        </View>

        {/* Pending actions */}
        {booking.status === 'pending' && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.acceptBtn, updating && styles.disabled]}
              onPress={() => updateStatus('confirmed')}
              disabled={updating}
            >
              <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
              <Text style={styles.acceptText}> Accept Booking</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.declineBtn, updating && styles.disabled]}
              onPress={handleDecline}
              disabled={updating}
            >
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Confirmed actions */}
        {booking.status === 'confirmed' && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.verifyBtn}
              onPress={() =>
                navigation.navigate('VideoCall', {
                  room_url: 'https://your-daily-room.daily.co/verify',
                  other_user_name: customer?.full_name,
                })
              }
            >
              <Ionicons name="videocam-outline" size={18} color="#fff" />
              <Text style={styles.verifyText}> Start Verification Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.completeBtn, updating && styles.disabled]}
              onPress={() => updateStatus('completed')}
              disabled={updating}
            >
              <Ionicons name="checkmark-done-outline" size={18} color="#fff" />
              <Text style={styles.completeText}> Mark as Completed</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Message customer */}
        <TouchableOpacity
          style={styles.messageBtn}
          onPress={() =>
            navigation.navigate('Chat', {
              other_user_id: booking.customer_id,
              other_user_name: customer?.full_name,
              booking_id: booking.id,
            })
          }
        >
          <Ionicons name="chatbubble-outline" size={18} color={Colors.primary} />
          <Text style={styles.messageBtnText}> Message Customer</Text>
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  title: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text },

  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: FontSize.md, fontWeight: '800', letterSpacing: 1 },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  customerName: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginBottom: 3 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  customerPhone: { fontSize: FontSize.sm, color: Colors.textSecondary },
  emergencyRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.xs },
  emergency: { fontSize: FontSize.sm, color: Colors.warning, flex: 1 },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailKeyRow: { flexDirection: 'row', alignItems: 'center' },
  detailKey: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600' },
  detailVal: { fontSize: FontSize.sm, color: Colors.text, textAlign: 'right', maxWidth: '55%' },
  notesBox: { flexDirection: 'row', alignItems: 'flex-start', marginTop: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border },
  notesText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontStyle: 'italic', flex: 1 },

  actions: { gap: Spacing.sm, marginBottom: Spacing.md },
  acceptBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.success, borderRadius: Radius.md, padding: Spacing.md,
  },
  acceptText: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },
  declineBtn: {
    borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.error,
  },
  declineText: { color: Colors.error, fontWeight: '700', fontSize: FontSize.md },
  verifyBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.secondary, borderRadius: Radius.md, padding: Spacing.md,
  },
  verifyText: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },
  completeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primary, borderRadius: Radius.md, padding: Spacing.md,
  },
  completeText: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },
  disabled: { opacity: 0.5 },
  messageBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: Radius.md, padding: Spacing.md, borderWidth: 2, borderColor: Colors.primary,
  },
  messageBtnText: { color: Colors.primary, fontSize: FontSize.md, fontWeight: '700' },
});
