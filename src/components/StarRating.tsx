import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing } from '../constants/theme';

interface Props {
  rating: number;
  count?: number;
  small?: boolean;
}

export default function StarRating({ rating, count, small = false }: Props) {
  const filled = Math.round(rating);

  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Text key={star} style={[styles.star, small && styles.starSmall, star <= filled && styles.starFilled]}>
          {star <= filled ? '★' : '☆'}
        </Text>
      ))}
      {count !== undefined && (
        <Text style={[styles.count, small && styles.countSmall]}>
          {rating > 0 ? rating.toFixed(1) : '—'} ({count})
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 1 },
  star: { fontSize: FontSize.md, color: Colors.border },
  starSmall: { fontSize: FontSize.sm },
  starFilled: { color: Colors.warning },
  count: { fontSize: FontSize.sm, color: Colors.textSecondary, marginLeft: Spacing.xs },
  countSmall: { fontSize: FontSize.xs },
});
