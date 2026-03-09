import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomerStackParamList, InstructorProfile } from '../../types';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { MOCK_INSTRUCTORS, isDemoMode } from '../../lib/mockData';
import { useAuthStore } from '../../store/authStore';
import InstructorCard from '../../components/InstructorCard';

// Cebu default region
const CEBU_REGION = {
  latitude: 10.3157,
  longitude: 123.8854,
  latitudeDelta: 0.3,
  longitudeDelta: 0.3,
};

type Props = NativeStackScreenProps<CustomerStackParamList, 'CustomerTabs'>;

export default function HomeMapScreen({ navigation }: Props) {
  const mapRef = useRef<MapView>(null);
  const { profile } = useAuthStore();
  const [instructors, setInstructors] = useState<InstructorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchInstructors();
    requestLocation();
  }, []);

  const requestLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    const location = await Location.getCurrentPositionAsync({});
    mapRef.current?.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.2,
      longitudeDelta: 0.2,
    });
  };

  const fetchInstructors = async () => {
    if (isDemoMode(profile?.id)) {
      setInstructors(MOCK_INSTRUCTORS);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('instructor_profiles')
      .select('*, profile:profiles(*)')
      .eq('is_active', true)
      .order('rating_avg', { ascending: false });

    setInstructors(data?.length ? data : MOCK_INSTRUCTORS);
    setLoading(false);
  };

  const handleMarkerPress = (instructor: InstructorProfile) => {
    setSelectedId(instructor.id);
    mapRef.current?.animateToRegion({
      latitude: instructor.location_lat,
      longitude: instructor.location_lng,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={CEBU_REGION}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {instructors.map((instructor) => (
          <Marker
            key={instructor.id}
            coordinate={{
              latitude: instructor.location_lat,
              longitude: instructor.location_lng,
            }}
            onPress={() => handleMarkerPress(instructor)}
          >
            <View style={[
              styles.markerBubble,
              selectedId === instructor.id && styles.markerSelected,
            ]}>
              <Text style={styles.markerText}>
                {instructor.profile?.full_name?.split(' ')[0] ?? 'Instructor'}
              </Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Near Me button */}
      <TouchableOpacity style={styles.nearMeBtn} onPress={requestLocation}>
        <Text style={styles.nearMeText}>Near Me</Text>
      </TouchableOpacity>

      {/* Bottom list */}
      <View style={styles.bottomSheet}>
        <Text style={styles.bottomTitle}>
          {instructors.length} Instructor{instructors.length !== 1 ? 's' : ''} in Cebu
        </Text>
        {loading ? (
          <ActivityIndicator color={Colors.primary} />
        ) : (
          <FlatList
            data={instructors}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <InstructorCard
                instructor={item}
                onPress={() =>
                  (navigation as any).navigate('InstructorDetail', {
                    instructor_id: item.id,
                  })
                }
                isSelected={selectedId === item.id}
              />
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  markerBubble: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderWidth: 2,
    borderColor: '#fff',
  },
  markerSelected: {
    backgroundColor: Colors.primaryDark,
    transform: [{ scale: 1.1 }],
  },
  markerText: {
    color: '#fff',
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  nearMeBtn: {
    position: 'absolute',
    top: 60,
    right: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  nearMeText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.primary },
  bottomSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  bottomTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  listContent: { paddingHorizontal: Spacing.md, gap: Spacing.md },
});
