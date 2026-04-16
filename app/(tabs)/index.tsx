import { useClassroomData } from '@/src/hooks/useClassroomData';
import React, { useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../src/styles/home.styles';

export default function App() {
  const {
    isAuthenticated,
    promptAsync,
    isLoadingAuth,
    tasks,
    isLoading,
    isRefreshing,
    refresh
  } = useClassroomData();

  const [activeTab, setActiveTab] = useState<'todo' | 'done'>('todo');

  const displayedTasks = tasks.filter(task =>
    activeTab === 'todo'
      ? (!task.isCompleted && !task.isExpired)
      : (task.isCompleted || task.isExpired)
  );

  const getCardStyle = (item: typeof tasks[number]) => {
    if (item.isCompleted) return styles.cardCompleted;
    if (item.isExpired) return styles.cardExpired;
    if (item.urgency === 'red') return styles.cardUrgent;
    if (item.urgency === 'yellow') return styles.cardWarning;
    if (item.urgency === 'green') return styles.cardSafe;
    return null;
  };

  const getBadgeStyle = (item: typeof tasks[number]) => {
    if (item.isCompleted) return styles.badgeCompleted;
    if (item.isExpired) return styles.badgeExpired;
    if (item.urgency === 'red') return styles.badgeUrgent;
    if (item.urgency === 'yellow') return styles.badgeWarning;
    if (item.urgency === 'green') return styles.badgeSafe;
    return null;
  };

  const getTextStyle = (item: typeof tasks[number]) => {
    if (item.isCompleted) return styles.textCompleted;
    if (item.isExpired) return styles.textExpired;
    if (item.urgency === 'red') return styles.textUrgent;
    if (item.urgency === 'yellow') return styles.textWarning;
    if (item.urgency === 'green') return styles.textSafe;
    return null;
  };

  return (
    <View style={styles.container}>
      {!isAuthenticated ? (
        <View style={styles.loginScreen}>
          <Text style={styles.logo}>Studo</Text>
          <Text style={styles.subtitle}>Sua vida acadêmica organizada</Text>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => promptAsync()}
            disabled={isLoadingAuth}
          >
            <Text style={styles.loginBtnText}>
              Conectar Google Classroom
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Minhas Atividades</Text>

            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'todo' && styles.activeTab]}
                onPress={() => setActiveTab('todo')}
              >
                <Text style={[styles.tabText, activeTab === 'todo' && styles.activeTabText]}>
                  A Fazer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, activeTab === 'done' && styles.activeTab]}
                onPress={() => setActiveTab('done')}
              >
                <Text style={[styles.tabText, activeTab === 'done' && styles.activeTabText]}>
                  Histórico
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {isLoading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#4A80F0" />
              <Text style={styles.loadingText}>Sincronizando...</Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.taskList}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={refresh}
                  colors={["#4A80F0"]}
                  tintColor={"#4A80F0"}
                />
              }
            >
              {displayedTasks.length > 0 ? (
                displayedTasks.map(item => (
                  <View key={item.id} style={[styles.card, getCardStyle(item)]}>
                    <View style={styles.cardHeader}>
                      <View style={[styles.materiaBadge, getBadgeStyle(item)]}>
                        <Text style={[styles.materiaText, getTextStyle(item)]}>
                          {item.materia}
                        </Text>
                      </View>

                      <Text style={[styles.deadlineText, getTextStyle(item)]}>
                        {item.isCompleted
                          ? 'Concluído'
                          : (item.isVeryOld
                            ? 'Antiga (Expirada)'
                            : (item.isExpired
                              ? 'Prazo Expirado'
                              : `Prazo: ${item.deadlineLabel || 'Sem prazo'}`))}
                      </Text>
                    </View>

                    <Text style={[styles.taskTitle, getTextStyle(item)]}>
                      {item.title}
                    </Text>

                    <Text style={styles.taskDesc} numberOfLines={2}>
                      {item.description}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyEmoji}>
                    {activeTab === 'done' ? '📂' : '🎉'}
                  </Text>
                  <Text style={styles.emptyText}>Nada por aqui!</Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}
