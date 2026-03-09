import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Booking } from '../types';
import { Colors, Spacing, FontSize, Radius } from '../constants/theme';

interface Props {
  booking: Booking;
  viewAs: 'customer' | 'instructor';
  onPress: () => void;
  onReview?: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  pending: Colors.warning,
  confirmed: Colors.success,
  completed: Colors.textSecondary,
  cancelled: Colors.error,
};

export default function BookingCard({ booking, viewAs, onPress, onReview }: Props) {
  const instructor = booking.instructor as any;
  const customer = booking.customer as any;
  const lessonType = booking.lesson_type as any;
  const statusColor = STATUS_COLORS[booking.status] ?? Colors.textSecondary;

  const otherName =
    viewAs === 'customer'
      ? instructor?.profile?.full_name
      : customer?.full_name;

  const formattedDate = new Date(booking.booking_date).toLocaleDateString('en-PH', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Left status accent bar */}
      <View style={[styles.accentBar, { backgroundColor: statusColor }]} />

      <View style={styles.content}>
        <View style={styles.row}>
          <View style={styles.info}>
            <Text style={styles.otherName}>{otherName}</Text>
            <Text style={styles.lessonName}>{lessonType?.name}</Text>

            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={12} color={Colors.textMuted} />
              <Text style={styles.metaText}> {formattedDate} at {booking.start_time}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="people-outline" size={12} color={Colors.textMuted} />
              <Text style={styles.metaText}> {booking.participants_count} participant(s)</Text>
            </View>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {booking.status}
            </Text>
          </View>
        </View>

        {onReview && (
          <TouchableOpacity style={styles.reviewBtn} onPress={onReview}>
            <Ionicons name="star-outline" size={14} color={Colors.primary} />
            <Text style={styles.reviewBtnText}>Leave a Review</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  accentBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  content: { flex: 1, padding: Spacing.md },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  info: { flex: 1 },
  otherName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginBottom: 1 },
  lessonName: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.xs },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  metaText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  statusBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    alignSelf: 'flex-start',
  },
  statusText: { fontSize: FontSize.xs, fontWeight: '700', textTransform: 'capitalize' },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    justifyContent: 'center',
  },
  reviewBtnText: { color: Colors.primary, fontWeight: '600', fontSize: FontSize.sm },
});
