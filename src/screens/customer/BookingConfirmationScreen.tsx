import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomerStackParamList } from '../../types';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';

type Props = NativeStackScreenProps<CustomerStackParamList, 'BookingConfirmation'>;

export default function BookingConfirmationScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      {/* Decorative hero band */}
      <View style={styles.heroBand}>
        <SafeAreaView edges={['top']} />
        {/* Concentric decorative rings */}
        <View style={styles.ring1} />
        <View style={styles.ring2} />
        <View style={styles.ring3} />
      </View>

      <SafeAreaView style={styles.safeContent} edges={['bottom']}>
        <View style={styles.inner}>
          {/* Success icon with rings */}
          <View style={styles.iconWrap}>
            <View style={styles.iconRingOuter} />
            <View style={styles.iconRingInner} />
            <Ionicons name="checkmark-circle" size={80} color={Colors.success} />
          </View>

          <Text style={styles.title}>Booking Sent!</Text>
          <Text style={styles.celebration}>Your request has been sent to the instructor.</Text>
          <Text style={styles.subtitle}>
            They will confirm within 24 hours.
          </Text>

          {/* Status card */}
          <View style={styles.infoCard}>
            <View style={styles.infoCardTop}>
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={16} color={Colors.warning} />
                <Text style={styles.infoStatus}> Status: Pending</Text>
              </View>
              <View style={styles.infoCornerIcon}>
                <Ionicons name="time-outline" size={22} color={Colors.warning + '40'} />
              </View>
            </View>
            <Text style={styles.infoNote}>
              You'll receive a notification once the instructor confirms or declines your request.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => (navigation as any).navigate('MyBookings')}
            activeOpacity={0.85}
          >
            <Ionicons name="calendar-outline" size={18} color="#fff" />
            <Text style={styles.primaryBtnText}> Go to My Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => (navigation as any).navigate('CustomerTabs')}
          >
            <Text style={styles.secondaryBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  heroBand: {
    backgroundColor: Colors.primaryDeep,
    height: 140,
    overflow: 'hidden',
    position: 'relative',
  },
  ring1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#FFFFFF20',
    right: -60,
    top: -80,
  },
  ring2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: '#FFFFFF35',
    right: -20,
    top: -20,
  },
  ring3: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#FFFFFF55',
    right: 30,
    top: 30,
  },

  safeContent: { flex: 1 },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, marginTop: -40 },

  iconWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    width: 120,
    height: 120,
  },
  iconRingOuter: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.success + '15',
  },
  iconRingInner: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.success + '25',
  },

  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.text, textAlign: 'center' },
  celebration: {
    fontSize: FontSize.md,
    color: Colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },

  infoCard: {
    backgroundColor: Colors.warning + '12',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    width: '100%',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.warning + '30',
  },
  infoCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoCornerIcon: { marginTop: -4 },
  infoStatus: { fontSize: FontSize.md, fontWeight: '700', color: Colors.warning },
  infoNote: { fontSize: FontSize.sm, color: Colors.text, lineHeight: 20 },

  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    padding: Spacing.md,
    width: '100%',
    marginBottom: Spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: '700' },
  secondaryBtn: {
    borderRadius: Radius.full,
    padding: Spacing.md,
    width: '100%',
    alignItems: 'center',
  },
  secondaryBtnText: { color: Colors.primary, fontSize: FontSize.md, fontWeight: '600' },
});
