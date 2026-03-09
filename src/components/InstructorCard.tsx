import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InstructorProfile } from '../types';
import { Colors, Spacing, FontSize, Radius } from '../constants/theme';
import StarRating from './StarRating';

interface Props {
  instructor: InstructorProfile;
  onPress: () => void;
  isSelected?: boolean;
  horizontal?: boolean;
}

export default function InstructorCard({
  instructor,
  onPress,
  isSelected = false,
  horizontal = true,
}: Props) {
  const profile = instructor.profile as any;
  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')
    : 'FI';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        horizontal ? styles.cardHorizontal : styles.cardFull,
        isSelected && styles.cardSelected,
      ]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      {/* Left accent bar when selected */}
      {isSelected && <View style={styles.accentBar} />}

      {/* Avatar */}
      {profile?.avatar_url ? (
        <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarInitial}>{initials}</Text>
        </View>
      )}

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {profile?.full_name}
          </Text>
          {instructor.is_verified && (
            <Ionicons name="checkmark-circle" size={14} color={Colors.success} style={{ marginLeft: 4 }} />
          )}
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={11} color={Colors.textMuted} />
          <Text style={styles.location} numberOfLines={1}>
            {instructor.location_name}
          </Text>
        </View>

        <StarRating rating={instructor.rating_avg} count={instructor.rating_count} small />
      </View>

      <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  cardHorizontal: { width: 220 },
  cardFull: { width: '100%' },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceBlue,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: Radius.lg,
    borderBottomLeftRadius: Radius.lg,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primaryDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: Colors.accent,
    fontWeight: '800',
    fontSize: FontSize.md,
    letterSpacing: 0.5,
  },
  info: { flex: 1 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.text,
    flexShrink: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 3,
  },
  location: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
});
