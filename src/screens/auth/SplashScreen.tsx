import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Colors, FontSize } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  const { setSession, setProfile, setLoading } = useAuthStore();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setProfile(profile);
          navigation.replace(profile.role === 'instructor' ? 'InstructorTabs' : 'CustomerTabs');
        } else {
          navigation.replace('Welcome');
        }
      } else {
        navigation.replace('Welcome');
      }

      setLoading(false);
    };

    const timeout = setTimeout(checkSession, 1800);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      {/* Decorative rings */}
      <View style={styles.ringOuter} />
      <View style={styles.ringMid} />
      <View style={styles.ringInner} />

      {/* Logo */}
      <View style={styles.logoWrap}>
        <Text style={styles.logoMain}>FreeDive</Text>
        <View style={styles.logoDivider} />
        <Text style={styles.logoSub}>CONNECT</Text>
      </View>

      <Text style={styles.tagline}>Find Your Depth</Text>

      {/* Bottom wave shape */}
      <View style={styles.wave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDeep,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  // Decorative concentric rings — white-based so they read on any hero bg color
  ringOuter: {
    position: 'absolute',
    width: 440,
    height: 440,
    borderRadius: 220,
    borderWidth: 1,
    borderColor: '#FFFFFF20',
  },
  ringMid: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 1,
    borderColor: '#FFFFFF35',
  },
  ringInner: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#FFFFFF55',
  },
  logoWrap: {
    alignItems: 'center',
  },
  logoMain: {
    fontSize: FontSize.xxxl + 6,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  logoDivider: {
    width: 40,
    height: 2,
    backgroundColor: Colors.accent,
    marginVertical: 8,
    borderRadius: 1,
  },
  logoSub: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 8,
  },
  tagline: {
    fontSize: FontSize.sm,
    color: '#FFFFFFBB',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 28,
  },
  wave: {
    position: 'absolute',
    bottom: -80,
    width: 600,
    height: 200,
    borderRadius: 300,
    backgroundColor: Colors.primaryDark + '60',
  },
});
