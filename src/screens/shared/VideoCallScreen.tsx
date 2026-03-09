import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';

export default function VideoCallScreen({ navigation, route }: any) {
  const { room_url, other_user_name } = route.params;

  const handleEndCall = () => {
    Alert.alert(
      'End Call?',
      'Are you sure you want to end the verification call?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'End Call', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Verification Call</Text>
        <Text style={styles.headerSub}>with {other_user_name}</Text>
      </View>

      {/* Daily.co embedded call */}
      <WebView
        source={{ uri: room_url }}
        style={styles.webview}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback
        javaScriptEnabled
        domStorageEnabled
        mediaCapturePermissionGrantType="grant"
      />

      {/* End call button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.endCallBtn} onPress={handleEndCall}>
          <Text style={styles.endCallText}>End Call</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    backgroundColor: '#1A1A2E',
    padding: Spacing.md,
    alignItems: 'center',
  },
  headerTitle: { fontSize: FontSize.md, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: FontSize.sm, color: Colors.primaryLight },
  webview: { flex: 1 },
  footer: {
    backgroundColor: '#1A1A2E',
    padding: Spacing.md,
    alignItems: 'center',
  },
  endCallBtn: {
    backgroundColor: Colors.error,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  endCallText: { color: '#fff', fontWeight: '800', fontSize: FontSize.md },
});
