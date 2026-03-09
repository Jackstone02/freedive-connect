import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const DEMO_CUSTOMER = {
  id: 'demo-customer',
  full_name: 'Demo Customer',
  avatar_url: null,
  phone: '+63 900 000 0000',
  role: 'customer' as const,
  emergency_contact_name: 'Demo Contact',
  emergency_contact_phone: '+63 900 000 0001',
  created_at: new Date().toISOString(),
};

const DEMO_INSTRUCTOR = {
  id: 'demo-instructor',
  full_name: 'Demo Instructor',
  avatar_url: null,
  phone: '+63 900 000 0002',
  role: 'instructor' as const,
  emergency_contact_name: null,
  emergency_contact_phone: null,
  created_at: new Date().toISOString(),
};

const DEMO_INSTRUCTOR_PROFILE = {
  id: 'demo-instructor-profile',
  user_id: 'demo-instructor',
  bio: 'Demo freediving instructor based in Mactan, Cebu.',
  experience_years: 5,
  languages: ['Filipino', 'English'],
  location_lat: 10.2874,
  location_lng: 124.0174,
  location_name: 'Mactan, Cebu',
  payment_info: 'GCash: 0917 000 0000',
  is_verified: true,
  is_active: true,
  rating_avg: 4.8,
  rating_count: 12,
};

export default function WelcomeScreen({ navigation }: Props) {
  const { setProfile, setInstructorProfile } = useAuthStore();

  const loginAsCustomer = () => {
    setProfile(DEMO_CUSTOMER);
    navigation.replace('CustomerTabs');
  };

  const loginAsInstructor = () => {
    setProfile(DEMO_INSTRUCTOR);
    setInstructorProfile(DEMO_INSTRUCTOR_PROFILE);
    navigation.replace('InstructorTabs');
  };

  return (
    <View style={styles.container}>
      {/* Hero section — deep ocean */}
      <SafeAreaView style={styles.hero}>
        {/* Decorative ring */}
        <View style={styles.heroRing} />

        <View style={styles.heroContent}>
          <View style={styles.logoBadge}>
            <Ionicons name="water" size={28} color={Colors.accent} />
          </View>
          <Text style={styles.heroTitle}>FreeDive{'\n'}Connect</Text>
          <Text style={styles.heroTagline}>FIND YOUR DEPTH</Text>
        </View>
      </SafeAreaView>

      {/* Bottom sheet */}
      <View style={styles.sheet}>
        <Text style={styles.sheetHeading}>Get started</Text>
        <Text style={styles.sheetSub}>Choose how you want to use the app</Text>

        {/* Customer card */}
        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => navigation.navigate('SignUp', { role: 'customer' })}
          activeOpacity={0.85}
        >
          <View style={[styles.roleIconWrap, { backgroundColor: Colors.primary + '15' }]}>
            <Ionicons name="search" size={24} color={Colors.primary} />
          </View>
          <View style={styles.roleText}>
            <Text style={styles.roleTitle}>Student / Customer</Text>
            <Text style={styles.roleDesc}>Find and book freediving instructors near you</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
        </TouchableOpacity>

        {/* Instructor card */}
        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => navigation.navigate('SignUp', { role: 'instructor' })}
          activeOpacity={0.85}
        >
          <View style={[styles.roleIconWrap, { backgroundColor: Colors.accent + '20' }]}>
            <Ionicons name="school" size={24} color={Colors.accent} />
          </View>
          <View style={styles.roleText}>
            <Text style={styles.roleTitle}>Freediving Instructor</Text>
            <Text style={styles.roleDesc}>Offer classes and connect with students in Cebu</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signInLink}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={styles.signInText}>
            Already have an account?{' '}
            <Text style={styles.signInBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>

        {/* Demo section */}
        <View style={styles.demoSection}>
          <View style={styles.demoDivider}>
            <View style={styles.demoDividerLine} />
            <Text style={styles.demoLabel}>Demo Mode</Text>
            <View style={styles.demoDividerLine} />
          </View>
          <View style={styles.demoRow}>
            <TouchableOpacity style={styles.demoBtn} onPress={loginAsCustomer}>
              <Ionicons name="person-outline" size={14} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.demoBtnText}>Customer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.demoBtn, styles.demoBtnInstructor]} onPress={loginAsInstructor}>
              <Ionicons name="school-outline" size={14} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.demoBtnText}>Instructor</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDeep,
  },
  // Hero
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroRing: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 1,
    borderColor: '#FFFFFF30',
  },
  heroContent: {
    alignItems: 'center',
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#FFFFFF40',
  },
  heroTitle: {
    fontSize: FontSize.xxxl,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 42,
    letterSpacing: 1,
  },
  heroTagline: {
    fontSize: 11,
    color: Colors.accent,
    letterSpacing: 4,
    marginTop: 12,
    fontWeight: '600',
  },

  // Bottom sheet
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  sheetHeading: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  sheetSub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },

  // Role cards
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: Spacing.md,
  },
  roleIconWrap: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleText: {
    flex: 1,
  },
  roleTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  roleDesc: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },

  // Sign in link
  signInLink: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  signInText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  signInBold: {
    color: Colors.primary,
    fontWeight: '700',
  },

  // Demo
  demoSection: {
    marginTop: Spacing.xs,
  },
  demoDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  demoDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  demoLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  demoRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  demoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
  },
  demoBtnInstructor: {
    backgroundColor: Colors.primaryDark,
  },
  demoBtnText: {
    color: '#fff',
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
});
