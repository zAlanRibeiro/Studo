import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useClassroomDataContext } from '../../src/contexts/ClassroomDataContext';
import { getGoogleUserProfile, GoogleUserProfile } from '../../src/services/googleClassroom';
import { styles } from '../../src/styles/tasks.styles';

export default function TasksPage() {
  const router = useRouter();
  const {
    isAuthenticated,
    isLoadingAuth,
    accessToken,
    tasks,
    isLoading,
    isRefreshing,
    refresh,
  } = useClassroomDataContext();

  const [profile, setProfile] = useState<GoogleUserProfile | null>(null);

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoadingAuth, router]);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!accessToken) {
        if (isMounted) setProfile(null);
        return;
      }

      try {
        const user = await getGoogleUserProfile(accessToken);
        if (isMounted) {
          setProfile(user);
        }
      } catch (error) {
        console.error('Erro ao carregar perfil na tela de tarefas:', error);
        if (isMounted) {
          setProfile(null);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  const [activeTab, setActiveTab] = useState<'todo' | 'done'>('todo');
  const [dateFilter, setDateFilter] = useState<'all' | 'week' | 'nextWeek'>('all');

  const now = new Date();
  const completedCount = tasks.filter((task) => task.isCompleted).length;
  const totalTasksCount = tasks.length;
  const completionPercent = totalTasksCount > 0 ? Math.round((completedCount / totalTasksCount) * 100) : 0;
  const todayLabel = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long' }).format(now);

  const displayedTasks = tasks
    .filter((task) => (activeTab === 'todo' ? !task.isCompleted && !task.isExpired : task.isCompleted || task.isExpired))
    .filter((task) => {
      if (dateFilter === 'all') return true;
      if (!task.rawDate) return false;

      const diffInDays = (task.rawDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      if (dateFilter === 'week') return diffInDays >= 0 && diffInDays <= 7;
      return diffInDays > 7 && diffInDays <= 14;
    });

  const getCardAccentStyle = (item: (typeof tasks)[number]) => {
    if (item.isCompleted) return styles.accentCompleted;
    if (item.isExpired) return styles.accentExpired;
    if (item.urgency === 'red') return styles.accentUrgent;
    if (item.urgency === 'yellow') return styles.accentWarning;
    if (item.urgency === 'green') return styles.accentSafe;
    return styles.accentDefault;
  };

  const isTomorrow = (targetDate: Date) => {
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);

    return target.getTime() === tomorrow.getTime();
  };

  const getDeadlineLabel = (item: (typeof tasks)[number]) => {
    if (item.isCompleted) return 'Concluida';
    if (item.isVeryOld) return 'Antiga (Expirada)';
    if (item.isExpired) return 'Prazo expirado';
    if (item.rawDate && isTomorrow(item.rawDate)) return 'Amanhã';
    return item.deadlineLabel || 'Sem prazo';
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4A80F0" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refresh}
          colors={['#4A80F0']}
          tintColor={'#4A80F0'}
        />
      }
    >
      <Text style={styles.dateLabel}>{todayLabel}</Text>

      <View style={styles.progressCard}>
        {profile?.picture ? (
          <Image source={{ uri: profile.picture }} style={styles.profileAvatar} />
        ) : (
          <View style={[styles.profileAvatar, styles.profileAvatarFallback]}>
            <Text style={styles.profileAvatarInitial}>{profile?.name?.[0] ?? 'U'}</Text>
          </View>
        )}

        <View style={styles.progressInfoWrap}>
          <Text style={styles.progressTitle}>Progresso semanal</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${completionPercent}%` }]} />
          </View>
          <Text style={styles.progressMeta}>
            {completionPercent}% concluídas ({completedCount} concluídas / {totalTasksCount} total)
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Tarefas</Text>

      <View style={styles.statusTabsWrap}>
        <TouchableOpacity
          style={[styles.statusTab, activeTab === 'todo' && styles.statusTabActive]}
          onPress={() => setActiveTab('todo')}
        >
          <Text style={[styles.statusTabText, activeTab === 'todo' && styles.statusTabTextActive]}>A fazer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statusTab, activeTab === 'done' && styles.statusTabActive]}
          onPress={() => setActiveTab('done')}
        >
          <Text style={[styles.statusTabText, activeTab === 'done' && styles.statusTabTextActive]}>Concluidas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickFilterRow}>
        <TouchableOpacity
          style={[styles.quickFilterChip, dateFilter === 'all' && styles.quickFilterChipActive]}
          onPress={() => setDateFilter('all')}
        >
          <Text style={[styles.quickFilterText, dateFilter === 'all' && styles.quickFilterTextActive]}>Todas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickFilterChip, dateFilter === 'week' && styles.quickFilterChipActive]}
          onPress={() => setDateFilter('week')}
        >
          <Text style={[styles.quickFilterText, dateFilter === 'week' && styles.quickFilterTextActive]}>Essa semana</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickFilterChip, dateFilter === 'nextWeek' && styles.quickFilterChipActive]}
          onPress={() => setDateFilter('nextWeek')}
        >
          <Text style={[styles.quickFilterText, dateFilter === 'nextWeek' && styles.quickFilterTextActive]}>Proxima semana</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4A80F0" />
          <Text style={styles.loadingText}>Sincronizando...</Text>
        </View>
      ) : displayedTasks.length > 0 ? (
        <View style={styles.tasksListWrap}>
          {displayedTasks.map((item) => (
            <View key={item.id} style={styles.taskCard}>
              <View style={[styles.taskCardAccent, getCardAccentStyle(item)]}>
                <Text style={styles.taskCardAccentTitle}>{item.title}</Text>
              </View>

              <View style={styles.taskCardBody}>
                <Text style={styles.taskDescription} numberOfLines={2} ellipsizeMode="tail">
                  {item.description}
                </Text>

                <View style={styles.taskMetaRow}>
                  <Text style={styles.taskMetaText}>Prazo: {getDeadlineLabel(item)}</Text>
                  <Text style={styles.taskMetaText}>Materia: {item.materia}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>{activeTab === 'done' ? '📂' : '🎉'}</Text>
          <Text style={styles.emptyText}>Nada por aqui!</Text>
        </View>
      )}
    </ScrollView>
  );
}
