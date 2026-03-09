import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { getMockConversations, isDemoMode } from '../../lib/mockData';

export default function MessagesListScreen({ navigation }: any) {
  const { profile } = useAuthStore();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchConversations();
    }, [])
  );

  const fetchConversations = async () => {
    if (!profile) return;

    if (isDemoMode(profile.id)) {
      setConversations(getMockConversations(profile.id));
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('messages')
      .select('*, sender:profiles!sender_id(*), receiver:profiles!receiver_id(*)')
      .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
      .order('created_at', { ascending: false });

    const seen = new Set<string>();
    const convos: any[] = [];
    (data || []).forEach((msg: any) => {
      const otherId = msg.sender_id === profile.id ? msg.receiver_id : msg.sender_id;
      const otherUser = msg.sender_id === profile.id ? msg.receiver : msg.sender;
      if (!seen.has(otherId)) {
        seen.add(otherId);
        convos.push({ other_user: otherUser, last_message: msg, unread: 0 });
      }
    });

    setConversations(convos);
    setLoading(false);
  };

  const initials = (name: string) =>
    name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() ?? '?';

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffH = (now.getTime() - d.getTime()) / 3600000;
    if (diffH < 1) return `${Math.floor(diffH * 60)}m ago`;
    if (diffH < 24) return `${Math.floor(diffH)}h ago`;
    return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
  };

  return (
    <View style={styles.container}>
      {/* Hero header */}
      <View style={styles.hero}>
        <SafeAreaView edges={['top']}>
          <View style={styles.heroContent}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroTitle}>Messages</Text>
              <Text style={styles.heroSub}>
                {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
              </Text>
            </View>
            <View style={styles.heroIconWrap}>
              <Ionicons name="chatbubbles" size={26} color={Colors.accent} />
            </View>
          </View>
        </SafeAreaView>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.other_user?.id ?? Math.random().toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="chatbubble-outline" size={40} color={Colors.primary} />
              </View>
              <Text style={styles.emptyText}>No conversations yet</Text>
              <Text style={styles.emptySubText}>
                Messages from instructors and students will appear here.
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const isUnread = item.unread > 0;
            return (
              <TouchableOpacity
                style={styles.convoRow}
                onPress={() =>
                  navigation.navigate('Chat', {
                    other_user_id: item.other_user?.id,
                    other_user_name: item.other_user?.full_name ?? 'User',
                  })
                }
                activeOpacity={0.85}
              >
                <View style={[styles.avatar, isUnread && styles.avatarUnread]}>
                  <Text style={styles.avatarText}>
                    {initials(item.other_user?.full_name ?? '?')}
                  </Text>
                </View>
                <View style={styles.convoInfo}>
                  <View style={styles.convoTopRow}>
                    <Text style={[styles.convoName, isUnread && styles.convoNameUnread]}>
                      {item.other_user?.full_name ?? 'User'}
                    </Text>
                    <Text style={styles.convoTime}>
                      {formatTime(item.last_message.created_at)}
                    </Text>
                  </View>
                  <View style={styles.convoBottomRow}>
                    <Text
                      style={[styles.convoLast, isUnread && styles.convoLastUnread]}
                      numberOfLines={1}
                    >
                      {item.last_message.sender_id === profile?.id ? 'You: ' : ''}
                      {item.last_message.content}
                    </Text>
                    {isUnread && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadCount}>{item.unread}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  hero: {
    backgroundColor: Colors.primaryDeep,
    paddingBottom: Spacing.lg,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  heroLeft: {},
  heroTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: '#FFFFFF' },
  heroSub: { fontSize: FontSize.xs, color: Colors.accentLight, marginTop: 3 },
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

  list: { paddingVertical: Spacing.xs },

  convoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarUnread: {
    backgroundColor: Colors.primaryDeep,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: FontSize.md },
  convoInfo: { flex: 1, minWidth: 0 },
  convoTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  convoName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  convoNameUnread: { fontWeight: '800', color: Colors.primaryDeep },
  convoTime: { fontSize: FontSize.xs, color: Colors.textMuted },
  convoBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  convoLast: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  convoLastUnread: { color: Colors.text, fontWeight: '600' },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadCount: { color: '#fff', fontSize: 11, fontWeight: '800' },

  emptyState: { alignItems: 'center', paddingTop: Spacing.xxl, gap: Spacing.sm },
  emptyIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  emptyText: { color: Colors.text, fontSize: FontSize.lg, fontWeight: '700' },
  emptySubText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
    lineHeight: 20,
  },
});
