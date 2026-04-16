import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useClassroomDataContext } from '../../src/contexts/ClassroomDataContext';
import { getGoogleUserProfile, GoogleUserProfile } from '../../src/services/googleClassroom';
import { calculateMetrics } from '../../src/services/metricsCalculator';
import { storage, StoredBadge } from '../../src/storage';
import { styles } from '../../src/styles/profile.styles';

export default function ProfilePage() {
  const router = useRouter();
  const { accessToken, isAuthenticated, isLoadingAuth, logout } = useClassroomDataContext();

  const [profile, setProfile] = useState<GoogleUserProfile | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<StoredBadge[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [expiredCount, setExpiredCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadProfileData = async () => {
        if (!accessToken) {
          if (isMounted) {
            setIsLoading(false);
          }
          return;
        }

        setIsLoading(true);

        try {
          const [userProfile, data] = await Promise.all([
            getGoogleUserProfile(accessToken),
            storage.getData(),
          ]);

          if (!isMounted) {
            return;
          }

          setProfile(userProfile);

          const safeData = data ?? {
            tasks: [],
            peers: [],
            taskPeers: [],
            badges: [],
            userBadges: [],
          };

          const metrics = calculateMetrics(safeData);
          const userBadgeIds = new Set(safeData.userBadges.map((item) => item.badge_id));
          const matchedBadges = safeData.badges.filter((badge) => userBadgeIds.has(badge.id));

          setEarnedBadges(matchedBadges);
          setCompletedCount(metrics.totalCompletedTasks);
          setExpiredCount(safeData.tasks.filter((task) => task.status !== 'completed' && !!task.raw_date && new Date(task.raw_date) < new Date()).length);
        } catch (error) {
          console.error('Erro ao carregar perfil:', error);
          if (isMounted) {
            setProfile(null);
            setEarnedBadges([]);
            setCompletedCount(0);
            setExpiredCount(0);
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      loadProfileData();

      return () => {
        isMounted = false;
      };
    }, [accessToken])
  );

  React.useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoadingAuth, router]);

  const levelLabel = useMemo(() => {
    if (completedCount >= 10) return 'Ouro';
    if (completedCount >= 5) return 'Prata';
    if (completedCount >= 1) return 'Bronze';
    return 'Iniciante';
  }, [completedCount]);

  const levelStyles = useMemo(() => {
    if (levelLabel === 'Ouro') {
      return {
        badge: styles.levelBadgeGold,
        text: styles.levelTextGold,
      };
    }

    if (levelLabel === 'Prata') {
      return {
        badge: styles.levelBadgeSilver,
        text: styles.levelTextSilver,
      };
    }

    if (levelLabel === 'Bronze') {
      return {
        badge: styles.levelBadgeBronze,
        text: styles.levelTextBronze,
      };
    }

    return {
      badge: styles.levelBadgeStarter,
      text: styles.levelTextStarter,
    };
  }, [levelLabel]);

  if (!isAuthenticated) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4A80F0" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      <View style={styles.profileCard}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            logout();
            router.replace('/login');
          }}
        >
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>

        {profile?.picture ? (
          <Image source={{ uri: profile.picture }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarInitial}>{profile?.name?.[0] ?? 'U'}</Text>
          </View>
        )}

        <Text style={styles.nameText}>{profile?.name ?? 'Usuario'}</Text>
        <Text style={styles.emailText}>{profile?.email ?? 'Sem email'}</Text>

        <View style={[styles.levelBadge, levelStyles.badge]}>
          <Text style={[styles.levelText, levelStyles.text]}>Nivel: {levelLabel}</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#4A80F0" />
        </View>
      ) : (
        <>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.statCardCompleted]}>
              <Text style={styles.statLabel}>Tarefas Concluidas</Text>
              <Text style={styles.statValue}>{completedCount}</Text>
            </View>

            <View style={[styles.statCard, styles.statCardExpired]}>
              <Text style={styles.statLabel}>Tarefas Expiradas</Text>
              <Text style={styles.statValue}>{expiredCount}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Medalhas</Text>
          {earnedBadges.length > 0 ? (
            <View style={styles.badgesList}>
              {earnedBadges.map((badge) => (
                <View key={badge.id} style={styles.badgeItem}>
                  <Text style={styles.badgeIcon}>{badge.icon}</Text>
                  <View style={styles.badgeTextWrap}>
                    <Text style={styles.badgeName}>{badge.name}</Text>
                    <Text style={styles.badgeDescription}>{badge.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyBadges}>
              <Text style={styles.emptyBadgesTitle}>Nenhuma medalha ainda</Text>
              <Text style={styles.emptyBadgesDescription}>Conclua tarefas para desbloquear suas primeiras conquistas.</Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}
