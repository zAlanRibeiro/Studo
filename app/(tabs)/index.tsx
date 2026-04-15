import { useClassroomData } from '@/scripts/hooks/useClassroomData';
import React, { useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

  const getCardStyle = (item) => {
    if (item.isCompleted) return styles.cardCompleted;
    if (item.isExpired) return styles.cardExpired;
    if (item.urgency === 'red') return styles.cardUrgent;
    if (item.urgency === 'yellow') return styles.cardWarning;
    if (item.urgency === 'green') return styles.cardSafe;
    return null;
  };

  const getBadgeStyle = (item) => {
    if (item.isCompleted) return styles.badgeCompleted;
    if (item.isExpired) return styles.badgeExpired;
    if (item.urgency === 'red') return styles.badgeUrgent;
    if (item.urgency === 'yellow') return styles.badgeWarning;
    if (item.urgency === 'green') return styles.badgeSafe;
    return null;
  };

  const getTextStyle = (item) => {
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
        <View style={{ flex: 1 }}>
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
              <Text style={{ marginTop: 10 }}>Sincronizando...</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  loginScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  logo: { fontSize: 50, fontWeight: 'bold', color: '#4A80F0', fontStyle: 'italic' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 40 },
  loginBtn: { backgroundColor: '#4A80F0', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, elevation: 5 },
  loginBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  header: { backgroundColor: '#4A80F0', paddingTop: 60, alignItems: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  tabContainer: { flexDirection: 'row', width: '100%', paddingHorizontal: 20 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: 'white' },
  tabText: { color: 'rgba(255,255,255,0.6)', fontSize: 16, fontWeight: 'bold' },
  activeTabText: { color: 'white' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  taskList: { padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 15, padding: 15, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: '#4A80F0', elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  materiaBadge: { backgroundColor: '#E1EBFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5 },
  materiaText: { color: '#4A80F0', fontSize: 11, fontWeight: 'bold' },
  deadlineText: { fontSize: 11, color: '#4A80F0', fontWeight: 'bold' },
  taskTitle: { fontSize: 17, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  taskDesc: { fontSize: 13, color: '#777', lineHeight: 18 },
  cardSafe: { borderLeftColor: '#4CAF50' },
  badgeSafe: { backgroundColor: '#E8F5E9' },
  textSafe: { color: '#4CAF50' },
  cardWarning: { borderLeftColor: '#FF9800' },
  badgeWarning: { backgroundColor: '#FFF3E0' },
  textWarning: { color: '#FF9800' },
  cardUrgent: { borderLeftColor: '#FF5252' },
  badgeUrgent: { backgroundColor: '#FFEBEE' },
  textUrgent: { color: '#FF5252' },
  cardCompleted: { borderLeftColor: '#4CAF50', opacity: 0.8 },
  badgeCompleted: { backgroundColor: '#E8F5E9' },
  textCompleted: { color: '#4CAF50', textDecorationLine: 'line-through' },
  cardExpired: { borderLeftColor: '#D32F2F', opacity: 0.7 },
  badgeExpired: { backgroundColor: '#FFEBEE' },
  textExpired: { color: '#D32F2F', fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyEmoji: { fontSize: 40, marginBottom: 10 },
  emptyText: { color: '#999', fontSize: 16 }
});