import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomerStackParamList, InstructorProfile, LessonType, Review } from '../../types';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { MOCK_INSTRUCTORS, MOCK_LESSON_TYPES, MOCK_REVIEWS, MOCK_CERTIFICATIONS, isDemoMode } from '../../lib/mockData';
import { useAuthStore } from '../../store/authStore';
import StarRating from '../../components/StarRating';
import CertBadge from '../../components/CertBadge';

type Props = NativeStackScreenProps<CustomerStackParamList, 'InstructorDetail'>;

export default function InstructorDetailScreen({ navigation, route }: Props) {
  const { instructor_id } = route.params;
  const { profile } = useAuthStore();
  const insets = useSafeAreaInsets();
  const [instructor, setInstructor] = useState<InstructorProfile | null>(null);
  const [lessonTypes, setLessonTypes] = useState<LessonType[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstructor();
  }, [instructor_id]);

  const fetchInstructor = async () => {
    if (isDemoMode(profile?.id)) {
      const mockInst = MOCK_INSTRUCTORS.find((i) => i.id === instructor_id);
      if (mockInst) {
        const certifications = MOCK_CERTIFICATIONS[instructor_id] ?? [];
        setInstructor({ ...mockInst, certifications } as any);
        setLessonTypes(MOCK_LESSON_TYPES[instructor_id] ?? []);
        setReviews(MOCK_REVIEWS[instructor_id] ?? []);
      }
      setLoading(false);
      return;
    }

    const [{ data: inst }, { data: lessons }, { data: revs }] = await Promise.all([
      supabase
        .from('instructor_profiles')
        .select('*, profile:profiles(*), certifications(*)')
        .eq('id', instructor_id)
        .single(),
      supabase
        .from('lesson_types')
        .select('*')
        .eq('instructor_id', instructor_id)
        .eq('is_active', true),
      supabase
        .from('reviews')
        .select('*, reviewer:profiles(*)')
        .eq('reviewed_id', instructor_id)
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    setInstructor(inst);
    setLessonTypes(lessons || []);
    setReviews(revs || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  if (!instructor) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: Colors.textSecondary }}>Instructor not found.</Text>
      </View>
    );
  }

  const initials = instructor.profile?.full_name
    ? instructor.profile.full_name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')
    : 'FI';

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom }}>
        {/* Hero header */}
        <View style={styles.header}>
          <SafeAreaView edges={['top']}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
          </SafeAreaView>

          <View style={styles.avatarWrap}>
            {instructor.profile?.avatar_url ? (
              <Image source={{ uri: instructor.profile.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>{initials}</Text>
              </View>
            )}
            {instructor.is_verified && (
              <View style={styles.verifiedDot}>
                <Ionicons name="checkmark" size={10} color="#fff" />
              </View>
            )}
          </View>

          <Text style={styles.name}>{instructor.profile?.full_name}</Text>

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={Colors.accentLight} />
            <Text style={styles.location}> {instructor.location_name}</Text>
          </View>

          <StarRating rating={instructor.rating_avg} count={instructor.rating_count} />

          {instructor.is_verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark" size={13} color={Colors.success} />
              <Text style={styles.verifiedText}> Verified Instructor</Text>
            </View>
          )}
        </View>

        {/* Horizontal stats strip */}
        <View style={styles.statsStrip}>
          <View style={styles.statPill}>
            <Ionicons name="time-outline" size={14} color={Colors.primary} />
            <Text style={styles.statPillText}>
              {(instructor as any).experience_years ?? '—'} Yrs
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statPill}>
            <Ionicons name="star-outline" size={14} color={Colors.primary} />
            <Text style={styles.statPillText}>
              {instructor.rating_count} Reviews
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statPill}>
            <Ionicons name="book-outline" size={14} color={Colors.primary} />
            <Text style={styles.statPillText}>
              {lessonTypes.length} Lessons
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.body}>
          {instructor.bio && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.bio}>{instructor.bio}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {(instructor as any).certifications?.map((cert: any) => (
                <CertBadge key={cert.id} certType={cert.cert_type} isVerified={cert.is_verified} />
              ))}
            </ScrollView>
          </View>

          {instructor.payment_info && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment</Text>
              <View style={styles.paymentRow}>
                <Ionicons name="wallet-outline" size={16} color={Colors.primary} />
                <Text style={styles.paymentInfo}> {instructor.payment_info}</Text>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lesson Types</Text>
            {lessonTypes.map((lesson) => (
              <TouchableOpacity
                key={lesson.id}
                style={styles.lessonCard}
                onPress={() =>
                  navigation.navigate('BookingForm', {
                    instructor_id: instructor.id,
                    lesson_type_id: lesson.id,
                  })
                }
                activeOpacity={0.85}
              >
                <View style={styles.lessonInfo}>
                  <Text style={styles.lessonName}>{lesson.name}</Text>
                  <Text style={styles.lessonMeta}>
                    {lesson.duration_minutes} min · {lesson.skill_level} · {lesson.lesson_format.replace('_', ' ')}
                  </Text>
                  {lesson.max_participants > 1 && (
                    <Text style={styles.lessonMeta}>Up to {lesson.max_participants} participants</Text>
                  )}
                </View>
                <View style={styles.lessonRight}>
                  <Text style={styles.lessonPrice}>₱{lesson.price.toLocaleString()}</Text>
                  <View style={styles.bookBtn}>
                    <Text style={styles.bookBtnText}>Book →</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews ({instructor.rating_count})</Text>
            {reviews.length === 0 ? (
              <Text style={styles.emptyText}>No reviews yet.</Text>
            ) : (
              reviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerName}>{review.reviewer?.full_name}</Text>
                    <StarRating rating={review.rating} />
                  </View>
                  {review.comment && (
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                  )}
                </View>
              ))
            )}
          </View>

          <TouchableOpacity
            style={styles.messageBtn}
            onPress={() =>
              (navigation as any).navigate('Chat', {
                other_user_id: instructor.user_id,
                other_user_name: instructor.profile?.full_name ?? 'Instructor',
              })
            }
            activeOpacity={0.85}
          >
            <Ionicons name="chatbubble-outline" size={18} color="#fff" />
            <Text style={styles.messageBtnText}> Send Message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: {
    backgroundColor: Colors.primaryDeep,
    alignItems: 'center',
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF18',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#FFFFFF25',
  },
  avatarWrap: { position: 'relative', marginBottom: Spacing.sm },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: Colors.accent,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.accent,
  },
  avatarInitial: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.accent },
  verifiedDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primaryDeep,
  },
  name: { fontSize: FontSize.xl, fontWeight: '800', color: '#fff', marginBottom: Spacing.xs },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  location: { fontSize: FontSize.sm, color: Colors.accentLight },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '20',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.success + '40',
  },
  verifiedText: { color: Colors.success, fontSize: FontSize.xs, fontWeight: '700' },

  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  statPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceBlue,
    borderRadius: Radius.full,
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm,
    gap: 4,
  },
  statPillText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: '700',
  },
  statDivider: {
    width: Spacing.sm,
  },

  body: { padding: Spacing.md },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
    paddingLeft: 8,
  },
  bio: { fontSize: FontSize.md, color: Colors.text, lineHeight: 22 },
  paymentRow: { flexDirection: 'row', alignItems: 'center' },
  paymentInfo: { fontSize: FontSize.md, color: Colors.text, fontWeight: '600' },

  lessonCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  lessonInfo: { flex: 1 },
  lessonName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  lessonMeta: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  lessonRight: { alignItems: 'flex-end', gap: 4 },
  lessonPrice: { fontSize: FontSize.md, fontWeight: '800', color: Colors.primary },
  bookBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  bookBtnText: { fontSize: FontSize.xs, color: '#fff', fontWeight: '700' },

  reviewCard: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    marginTop: Spacing.sm,
  },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xs },
  reviewerName: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text },
  reviewComment: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  emptyText: { color: Colors.textSecondary, fontSize: FontSize.sm },

  messageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: Spacing.xs,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    padding: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  messageBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: '700' },
});
