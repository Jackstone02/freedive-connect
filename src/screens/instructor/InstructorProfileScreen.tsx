import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

export default function InstructorProfileScreen({ navigation }: any) {
  const { profile, instructorProfile, setInstructorProfile, clearAuth } = useAuthStore();
  const [bio, setBio] = useState(instructorProfile?.bio ?? '');
  const [locationName, setLocationName] = useState(instructorProfile?.location_name ?? '');
  const [paymentInfo, setPaymentInfo] = useState(instructorProfile?.payment_info ?? '');
  const [isActive, setIsActive] = useState(instructorProfile?.is_active ?? false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!instructorProfile) return;
    setSaving(true);

    const { data, error } = await supabase
      .from('instructor_profiles')
      .update({ bio, location_name: locationName, payment_info: paymentInfo, is_active: isActive })
      .eq('id', instructorProfile.id)
      .select()
      .single();

    if (error) {
      Alert.alert('Error', 'Failed to save profile.');
    } else {
      setInstructorProfile(data);
      Alert.alert('Saved!', 'Your profile has been updated.');
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    clearAuth();
    navigation.replace('Welcome');
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')
    : 'FI';

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarInitial}>{initials}</Text>
          </View>
          <Text style={styles.profileName}>{profile?.full_name ?? 'Instructor'}</Text>

          {/* Role badge */}
          <View style={styles.roleBadge}>
            <Ionicons name="shield-checkmark-outline" size={12} color={Colors.accent} />
            <Text style={styles.roleBadgeText}> Instructor · Verified</Text>
          </View>

          {/* Wave bottom decoration */}
          <View style={styles.headerWave} />
        </View>

        {/* Active toggle */}
        <View style={[styles.toggleCard, isActive ? styles.toggleCardActive : styles.toggleCardInactive]}>
          <View style={styles.toggleInfo}>
            <Ionicons name="radio-button-on-outline" size={18} color={isActive ? Colors.success : Colors.textMuted} />
            <View style={styles.toggleText}>
              <Text style={styles.toggleLabel}>Open for Bookings</Text>
              <Text style={styles.toggleNote}>
                Toggle off to temporarily stop receiving new bookings
              </Text>
            </View>
          </View>
          <Switch
            value={isActive}
            onValueChange={setIsActive}
            trackColor={{ true: Colors.success, false: Colors.border }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell students about yourself, your experience and teaching style..."
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Teaching Location</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="location-outline" size={16} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.inputWithIcon}
              value={locationName}
              onChangeText={setLocationName}
              placeholder="e.g. Mactan, Cebu"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <Text style={styles.label}>Payment Info</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="wallet-outline" size={16} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.inputWithIcon}
              value={paymentInfo}
              onChangeText={setPaymentInfo}
              placeholder="e.g. GCash: 09xxxxxxxxx"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => navigation.navigate('ManageLessonTypes')}
          >
            <View style={styles.linkLeft}>
              <Ionicons name="list-outline" size={18} color={Colors.primary} />
              <Text style={styles.linkText}> Manage Lesson Types</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving} activeOpacity={0.85}>
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-outline" size={18} color="#fff" />
                <Text style={styles.saveBtnText}> Save Changes</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={18} color={Colors.error} />
            <Text style={styles.signOutText}> Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: { paddingBottom: Spacing.xxl },

  profileHeader: {
    backgroundColor: Colors.primaryDeep,
    alignItems: 'center',
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl + 10,
    position: 'relative',
    overflow: 'hidden',
  },
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.accent,
    marginBottom: Spacing.md,
  },
  avatarInitial: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.accent },
  profileName: { fontSize: FontSize.xl, fontWeight: '800', color: '#fff' },

  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent + '30',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    marginTop: Spacing.sm,
  },
  roleBadgeText: { fontSize: FontSize.xs, color: Colors.accent, fontWeight: '700' },

  headerWave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  toggleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    margin: Spacing.lg,
    marginBottom: Spacing.xs,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
  },
  toggleCardActive: {
    borderLeftColor: Colors.success,
  },
  toggleCardInactive: {
    borderLeftColor: Colors.textMuted,
  },
  toggleInfo: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, flex: 1 },
  toggleText: { flex: 1 },
  toggleLabel: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  toggleNote: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2, lineHeight: 16 },

  form: { paddingHorizontal: Spacing.lg, gap: Spacing.xs },
  label: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textSecondary, marginTop: Spacing.md, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  multiline: { minHeight: 120 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
  },
  inputIcon: { marginRight: Spacing.sm },
  inputWithIcon: { flex: 1, paddingVertical: 14, fontSize: FontSize.md, color: Colors.text },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginTop: Spacing.md,
  },
  linkLeft: { flexDirection: 'row', alignItems: 'center' },
  linkText: { fontSize: FontSize.md, color: Colors.primary, fontWeight: '600' },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: '700' },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.error,
    marginTop: Spacing.sm,
  },
  signOutText: { color: Colors.error, fontSize: FontSize.md, fontWeight: '600' },
});
