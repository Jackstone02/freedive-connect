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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomerStackParamList, Booking } from '../../types';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { MOCK_CUSTOMER_BOOKINGS, isDemoMode } from '../../lib/mockData';
import { useAuthStore } from '../../store/authStore';

type Props = NativeStackScreenProps<CustomerStackParamList, 'BookingDetail'>;

const STATUS_COLORS: Record<string, string> = {
  pending: Colors.warning,
  confirmed: Colors.success,
  completed: Colors.textSecondary,
  cancelled: Colors.error,
};

export default function BookingDetailScreen({ navigation, route }: Props) {
  const { booking_id } = route.params;
  const { profile } = useAuthStore();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [booking_id]);

  const fetchBooking = async () => {
    if (isDemoMode(profile?.id)) {
      const found = MOCK_CUSTOMER_BOOKINGS.find((b) => b.id === booking_id) ?? null;
      setBooking(found);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('bookings')
      .select(`
        *,
        instructor:instructor_profiles(*, profile:profiles(*)),
        lesson_type:lesson_types(*)
      `)
      .eq('id', booking_id)
      .single();

    setBooking(data);
    setLoading(false);
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            if (isDemoMode(profile?.id)) {
              setBooking((prev) => prev ? { ...prev, status: 'cancelled' } : prev);
              setCancelling(false);
              Alert.alert('Cancelled', 'Your booking has been cancelled.');
              return;
            }
            await supabase
              .from('bookings')
              .update({ status: 'cancelled' })
              .eq('id', booking_id);
            setBooking((prev) => prev ? { ...prev, status: 'cancelled' } : prev);
            setCancelling(false);
            Alert.alert('Cancelled', 'Your booking has been cancelled.');
          },
        },
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

  if (!booking) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={Colors.primary} />
        </TouchableOpacity>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Booking not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const instructor = booking.instructor as any;
  const lessonType = booking.lesson_type as any;
  const statusColor = STATUS_COLORS[booking.status] ?? Colors.textSecondary;

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

        {/* Instructor info */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Instructor</Text>
          <Text style={styles.cardMain}>
            {instructor?.profile?.full_name ?? instructor?.full_name ?? 'Unknown'}
          </Text>
          <View style={styles.cardMetaRow}>
            <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
            <Text style={styles.cardSub}> {instructor?.location_name}</Text>
          </View>
        </View>

        {/* Session info */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Session Details</Text>
          {[
            { key: 'Lesson', val: lessonType?.name, icon: 'book-outline' },
            { key: 'Date', val: new Date(booking.booking_date + 'T00:00').toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), icon: 'calendar-outline' },
            { key: 'Time', val: booking.start_time, icon: 'time-outline' },
            { key: 'Participants', val: String(booking.participants_count), icon: 'people-outline' },
            { key: 'Price', val: `₱${lessonType?.price?.toLocaleString() ?? '—'} / person`, icon: 'wallet-outline' },
          ].map(({ key, val, icon }) => (
            <View key={key} style={styles.detailRow}>
              <View style={styles.detailKeyRow}>
                <Ionicons name={icon as any} size={13} color={Colors.textMuted} />
                <Text style={styles.detailKey}> {key}</Text>
              </View>
              <Text style={styles.detailVal}>{val}</Text>
            </View>
          ))}
          {booking.notes && (
            <View style={[styles.detailRow, { alignItems: 'flex-start' }]}>
              <View style={styles.detailKeyRow}>
                <Ionicons name="chatbubble-outline" size={13} color={Colors.textMuted} />
                <Text style={styles.detailKey}> Notes</Text>
              </View>
              <Text style={[styles.detailVal, { flex: 1, textAlign: 'right' }]}>{booking.notes}</Text>
            </View>
          )}
        </View>

        {/* Payment reminder */}
        {booking.status === 'confirmed' && instructor?.payment_info && (
          <View style={styles.paymentCard}>
            <View style={styles.paymentHeader}>
              <Ionicons name="wallet-outline" size={16} color={Colors.primary} />
              <Text style={styles.paymentTitle}> Payment Info</Text>
            </View>
            <Text style={styles.paymentNote}>
              Please pay the instructor directly before or after the session.
            </Text>
            <Text style={styles.paymentInfo}>{instructor.payment_info}</Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          {booking.status === 'confirmed' && (
            <TouchableOpacity
              style={styles.verifyBtn}
              onPress={() =>
                navigation.navigate('VideoCall' as any, {
                  room_url: 'https://demo.daily.co/freedive-verify',
                  other_user_name: instructor?.profile?.full_name ?? 'Instructor',
                })
              }
            >
              <Ionicons name="videocam-outline" size={18} color="#fff" />
              <Text style={styles.verifyBtnText}> Start Verification Call</Text>
            </TouchableOpacity>
          )}

          {booking.status === 'completed' && (
            <TouchableOpacity
              style={styles.reviewBtn}
              onPress={() =>
                navigation.navigate('LeaveReview', {
                  booking_id: booking.id,
                  instructor_id: booking.instructor_id,
                })
              }
            >
              <Ionicons name="star-outline" size={18} color="#fff" />
              <Text style={styles.reviewBtnText}> Leave a Review</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.messageBtn}
            onPress={() =>
              navigation.navigate('Chat' as any, {
                other_user_id: instructor?.user_id ?? booking.instructor_id,
                other_user_name: instructor?.profile?.full_name ?? 'Instructor',
                booking_id: booking.id,
              })
            }
          >
            <Ionicons name="chatbubble-outline" size={18} color={Colors.primary} />
            <Text style={styles.messageBtnText}> Message Instructor</Text>
          </TouchableOpacity>

          {['pending', 'confirmed'].includes(booking.status) && (
            <TouchableOpacity
              style={[styles.cancelBtn, cancelling && styles.disabled]}
              onPress={handleCancel}
              disabled={cancelling}
            >
              <Text style={styles.cancelBtnText}>
                {cancelling ? 'Cancelling...' : 'Cancel Booking'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
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
  cardMain: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  cardSub: { fontSize: FontSize.sm, color: Colors.textSecondary },
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

  paymentCard: {
    backgroundColor: Colors.primary + '0D',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    marginBottom: Spacing.md,
  },
  paymentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs },
  paymentTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },
  paymentNote: { fontSize: FontSize.xs, color: Colors.textSecondary, marginBottom: Spacing.xs },
  paymentInfo: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },

  actions: { gap: Spacing.sm, marginTop: Spacing.xs },
  verifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  verifyBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  reviewBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },
  messageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  messageBtnText: { color: Colors.primary, fontWeight: '700', fontSize: FontSize.md },
  cancelBtn: {
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.error,
  },
  cancelBtnText: { color: Colors.error, fontWeight: '600', fontSize: FontSize.md },
  disabled: { opacity: 0.5 },
  emptyText: { color: Colors.textSecondary, fontSize: FontSize.md },
});
