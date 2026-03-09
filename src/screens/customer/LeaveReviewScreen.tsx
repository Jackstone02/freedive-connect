import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomerStackParamList } from '../../types';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

type Props = NativeStackScreenProps<CustomerStackParamList, 'LeaveReview'>;

export default function LeaveReviewScreen({ navigation, route }: Props) {
  const { booking_id, instructor_id } = route.params;
  const { profile } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Please select a rating.');
      return;
    }
    if (!profile) return;

    setSubmitting(true);

    const { error } = await supabase.from('reviews').insert({
      booking_id,
      reviewer_id: profile.id,
      reviewed_id: instructor_id,
      rating,
      comment: comment || null,
    });

    if (error) {
      Alert.alert('Error', 'Failed to submit review.');
      setSubmitting(false);
      return;
    }

    // Mark booking as reviewed
    await supabase
      .from('bookings')
      .update({ status: 'completed' })
      .eq('id', booking_id);

    Alert.alert('Review Submitted!', 'Thank you for your feedback.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
    setSubmitting(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Leave a Review</Text>
        <Text style={styles.subtitle}>How was your freediving session?</Text>

        {/* Star selector */}
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Text style={[styles.star, star <= rating && styles.starActive]}>
                {star <= rating ? '★' : '☆'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Comment (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Share your experience..."
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.submitBtn, (rating === 0 || submitting) && styles.disabled]}
          onPress={handleSubmit}
          disabled={rating === 0 || submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit Review</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: { flex: 1, padding: Spacing.lg },
  back: { color: Colors.primary, fontWeight: '600', fontSize: FontSize.md, marginBottom: Spacing.lg },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: Spacing.xs, marginBottom: Spacing.xl },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  star: { fontSize: 48, color: Colors.border },
  starActive: { color: Colors.warning },
  label: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontSize: FontSize.md,
    minHeight: 120,
    marginBottom: Spacing.lg,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  disabled: { opacity: 0.5 },
  submitText: { color: '#fff', fontSize: FontSize.md, fontWeight: '700' },
});
