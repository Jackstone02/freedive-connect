import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomerStackParamList, InstructorProfile, SkillLevel, LessonFormat } from '../../types';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { MOCK_INSTRUCTORS, MOCK_LESSON_TYPES, isDemoMode } from '../../lib/mockData';
import { useAuthStore } from '../../store/authStore';
import InstructorCard from '../../components/InstructorCard';

type Props = NativeStackScreenProps<CustomerStackParamList, 'CustomerTabs'>;

const SKILL_LEVELS: SkillLevel[] = ['beginner', 'intermediate', 'advanced'];
const FORMATS: LessonFormat[] = ['private', 'group', 'pool', 'open_water'];

export default function SearchScreen({ navigation }: Props) {
  const { profile } = useAuthStore();
  const [query, setQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<LessonFormat | null>(null);
  const [instructors, setInstructors] = useState<InstructorProfile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    search();
  }, [query, selectedLevel, selectedFormat]);

  const search = async () => {
    setLoading(true);

    if (isDemoMode(profile?.id)) {
      let results = MOCK_INSTRUCTORS.map((inst) => ({
        ...inst,
        lesson_types: MOCK_LESSON_TYPES[inst.id] ?? [],
      }));
      if (query) {
        results = results.filter((i) =>
          (i.profile as any)?.full_name?.toLowerCase().includes(query.toLowerCase())
        );
      }
      if (selectedLevel) {
        results = results.filter((i) =>
          (i as any).lesson_types?.some((lt: any) => lt.skill_level === selectedLevel)
        );
      }
      if (selectedFormat) {
        results = results.filter((i) =>
          (i as any).lesson_types?.some((lt: any) => lt.lesson_format === selectedFormat)
        );
      }
      setInstructors(results);
      setLoading(false);
      return;
    }

    let q = supabase
      .from('instructor_profiles')
      .select('*, profile:profiles(*), lesson_types(*)')
      .eq('is_active', true);

    if (query) {
      q = q.ilike('profiles.full_name', `%${query}%`);
    }

    const { data } = await q.order('rating_avg', { ascending: false });
    setInstructors(data?.length ? data : MOCK_INSTRUCTORS);
    setLoading(false);
  };

  const toggleLevel = (level: SkillLevel) => setSelectedLevel(selectedLevel === level ? null : level);
  const toggleFormat = (format: LessonFormat) => setSelectedFormat(selectedFormat === format ? null : format);

  return (
    <View style={styles.container}>
      {/* Hero header */}
      <View style={styles.hero}>
        <SafeAreaView edges={['top']}>
          <View style={styles.heroContent}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroTitle}>Find Instructors</Text>
              <View style={styles.heroLocationRow}>
                <Ionicons name="location-outline" size={13} color={Colors.accentLight} />
                <Text style={styles.heroSub}> Cebu, Philippines</Text>
              </View>
            </View>
            <View style={styles.heroIconWrap}>
              <Ionicons name="search" size={26} color={Colors.accent} />
            </View>
          </View>
        </SafeAreaView>

        {/* Search bar floating at bottom of hero */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name..."
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterSection}>
        <View style={styles.filterLabelRow}>
          <View style={styles.filterLabelBar} />
          <Text style={styles.filterLabel}>Skill Level</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {SKILL_LEVELS.map((level) => (
            <TouchableOpacity
              key={level}
              style={[styles.chip, selectedLevel === level && styles.chipActive]}
              onPress={() => toggleLevel(level)}
            >
              <Text style={[styles.chipText, selectedLevel === level && styles.chipTextActive]}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.filterLabelRow, { marginTop: Spacing.sm }]}>
          <View style={styles.filterLabelBar} />
          <Text style={styles.filterLabel}>Lesson Type</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {FORMATS.map((format) => (
            <TouchableOpacity
              key={format}
              style={[styles.chip, selectedFormat === format && styles.chipActive]}
              onPress={() => toggleFormat(format)}
            >
              <Text style={[styles.chipText, selectedFormat === format && styles.chipTextActive]}>
                {format.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Result count */}
      {!loading && (
        <View style={styles.resultRow}>
          <View style={styles.resultBadge}>
            <Text style={styles.resultCount}>
              {instructors.length} instructor{instructors.length !== 1 ? 's' : ''} found
            </Text>
          </View>
        </View>
      )}

      {/* Results */}
      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
      ) : (
        <FlatList
          data={instructors}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="search-outline" size={48} color={Colors.primary} />
              </View>
              <Text style={styles.emptyText}>No instructors found</Text>
              <Text style={styles.emptySubText}>Try adjusting your filters or search term.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <InstructorCard
              instructor={item}
              onPress={() =>
                (navigation as any).navigate('InstructorDetail', { instructor_id: item.id })
              }
              horizontal={false}
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
    paddingBottom: Spacing.xl + 8,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  heroLeft: {},
  heroTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: '#FFFFFF' },
  heroLocationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  heroSub: { fontSize: FontSize.xs, color: Colors.accentLight },
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

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    position: 'absolute',
    bottom: -22,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  searchIcon: { marginRight: Spacing.sm },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    paddingVertical: 13,
    color: Colors.text,
  },
  clearBtn: { padding: Spacing.xs },

  filterSection: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl + 8,
    paddingBottom: Spacing.xs,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs },
  filterLabelBar: {
    width: 3,
    height: 13,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginRight: Spacing.xs,
  },
  filterLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipRow: { marginBottom: Spacing.xs },
  chip: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
    backgroundColor: Colors.surface,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: FontSize.xs, color: Colors.text, fontWeight: '600' },
  chipTextActive: { color: '#fff' },

  resultRow: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  resultBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary + '15',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  resultCount: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '700' },

  list: { padding: Spacing.md, gap: Spacing.sm },
  emptyState: { alignItems: 'center', paddingTop: Spacing.xxl, gap: Spacing.sm },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  emptyText: { color: Colors.text, fontSize: FontSize.lg, fontWeight: '700' },
  emptySubText: { color: Colors.textSecondary, fontSize: FontSize.sm, textAlign: 'center' },
});
