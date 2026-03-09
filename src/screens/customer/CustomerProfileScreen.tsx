import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

export default function CustomerProfileScreen() {
  const navigation = useNavigation<any>();
  const { profile, setProfile, clearAuth } = useAuthStore();
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [emergencyName, setEmergencyName] = useState(profile?.emergency_contact_name ?? '');
  const [emergencyPhone, setEmergencyPhone] = useState(profile?.emergency_contact_phone ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);

    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        phone,
        emergency_contact_name: emergencyName || null,
        emergency_contact_phone: emergencyPhone || null,
      })
      .eq('id', profile.id)
      .select()
      .single();

    if (error) {
      Alert.alert('Error', 'Failed to save profile.');
    } else {
      setProfile(data);
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
    : 'U';

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarInitial}>{initials}</Text>
          </View>
          <Text style={styles.profileName}>{profile?.full_name ?? 'Student'}</Text>

          {/* Role badge */}
          <View style={styles.roleBadge}>
            <Ionicons name="location-outline" size={12} color={Colors.accent} />
            <Text style={styles.roleBadgeText}> Student · Cebu</Text>
          </View>

          {/* Wave bottom decoration */}
          <View style={styles.headerWave} />
        </View>

        <View style={styles.form}>
          {/* Personal Info */}
          <Text style={styles.sectionHeader}>Personal Info</Text>

          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="person-outline" size={16} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.inputWithIcon}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Your full name"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <Text style={styles.label}>Phone</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="call-outline" size={16} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.inputWithIcon}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+63 9xx xxx xxxx"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          {/* Emergency Contact */}
          <View style={styles.sectionDivider} />
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="alert-circle-outline" size={16} color={Colors.warning} />
            <Text style={[styles.sectionHeader, { marginBottom: 0, marginLeft: 6 }]}>Emergency Contact</Text>
          </View>
          <Text style={styles.sectionNote}>
            Important for your safety during dive sessions.
          </Text>

          <Text style={styles.label}>Contact Name</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="person-outline" size={16} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.inputWithIcon}
              value={emergencyName}
              onChangeText={setEmergencyName}
              placeholder="Emergency contact name"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <Text style={styles.label}>Contact Phone</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="call-outline" size={16} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.inputWithIcon}
              value={emergencyPhone}
              onChangeText={setEmergencyPhone}
              keyboardType="phone-pad"
              placeholder="+63 9xx xxx xxxx"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.disabled]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <Text style={styles.saveBtnText}>Saving...</Text>
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

  form: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs },
  sectionHeader: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginBottom: Spacing.xs },
  sectionNote: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.sm },
  sectionDivider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.lg },

  label: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textSecondary, marginBottom: Spacing.xs, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: Spacing.sm },
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

  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.xl,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabled: { opacity: 0.6, shadowOpacity: 0 },
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
