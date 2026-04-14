import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('todo');

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '990267192314-h2lhq3dp81s1lh8prju7i7tg8n74knfv.apps.googleusercontent.com',
    androidClientId: '990267192314-jgnd7f59garagsl8asvuoikgbknjcqrp.apps.googleusercontent.com',
    extraParams: { prompt: 'select_account' },
    scopes: [
      'https://www.googleapis.com/auth/classroom.courses.readonly',
      'https://www.googleapis.com/auth/classroom.coursework.me.readonly'
    ],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      setAccessToken(authentication.accessToken);
      fetchClassroomData(authentication.accessToken, false);
    }
  }, [response]);

  const formatDeadline = (dueDate, dueTime) => {
    if (!dueDate) return null;
    const day = String(dueDate.day).padStart(2, '0');
    const month = String(dueDate.month).padStart(2, '0');
    const hours = dueTime?.hours ? String(dueTime.hours).padStart(2, '0') : '23';
    const minutes = dueTime?.minutes ? String(dueTime.minutes).padStart(2, '0') : '59';
    return `${day}/${month} às ${hours}:${minutes}`;
  };

  const fetchClassroomData = async (token, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      // 👇 A MÁGICA ACONTECE AQUI: Adicionamos ?courseStates=ACTIVE na URL 👇
      const coursesResponse = await fetch('https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const coursesData = await coursesResponse.json();

      if (coursesData.courses) {
        let allTasks = [];
        const now = new Date();
        const ONE_YEAR_IN_MS = 365 * 24 * 60 * 60 * 1000;

        for (const course of coursesData.courses) {
          const workResponse = await fetch(`https://classroom.googleapis.com/v1/courses/${course.id}/courseWork`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const workData = await workResponse.json();
          
          const subsResponse = await fetch(`https://classroom.googleapis.com/v1/courses/${course.id}/courseWork/-/studentSubmissions?userId=me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const subsData = await subsResponse.json();
          
          const submissionsMap = {};
          if (subsData.studentSubmissions) {
            subsData.studentSubmissions.forEach(sub => {
              submissionsMap[sub.courseWorkId] = (sub.state === 'TURNED_IN' || sub.state === 'RETURNED');
            });
          }

          if (workData.courseWork) {
            const formattedTasks = workData.courseWork.map(work => {
              const isCompleted = submissionsMap[work.id] || false;
              
              const hasDeadline = !!work.dueDate;
              const expirationDate = hasDeadline 
                ? new Date(work.dueDate.year, work.dueDate.month - 1, work.dueDate.day, work.dueTime?.hours || 23, work.dueTime?.minutes || 59)
                : new Date(9999, 11, 31);
              const isExpiredByDeadline = hasDeadline && expirationDate < now;

              const creationDate = new Date(work.creationTime);
              const isExpiredByAge = (now - creationDate) > ONE_YEAR_IN_MS;

              const isExpired = !isCompleted && (isExpiredByDeadline || isExpiredByAge);

              let urgency = 'none'; 
              if (hasDeadline && !isCompleted && !isExpired) {
                const msPerDay = 1000 * 60 * 60 * 24;
                const daysRemaining = (expirationDate - now) / msPerDay;

                if (daysRemaining <= 7) {
                  urgency = 'red'; 
                } else if (daysRemaining < 14) {
                  urgency = 'yellow'; 
                } else {
                  urgency = 'green'; 
                }
              }

              return {
                id: work.id,
                title: work.title,
                materia: course.name,
                description: work.description || 'Sem descrição.',
                isCompleted: isCompleted,
                isExpired: isExpired,
                isVeryOld: isExpiredByAge && !isExpiredByDeadline,
                urgency: urgency,
                rawDate: expirationDate,
                deadlineLabel: formatDeadline(work.dueDate, work.dueTime)
              };
            });
            allTasks = [...allTasks, ...formattedTasks];
          }
        }
        allTasks.sort((a, b) => a.rawDate - b.rawDate);
        setTasks(allTasks);
      }
    } catch (error) {
      console.error("Erro Classroom:", error);
    } finally {
      setLoading(false);
      setRefreshing(false); 
    }
  };

  const onRefresh = useCallback(() => {
    if (accessToken) {
      fetchClassroomData(accessToken, true); 
    }
  }, [accessToken]);

  const displayedTasks = tasks.filter(task => 
    activeTab === 'todo' ? (!task.isCompleted && !task.isExpired) : (task.isCompleted || task.isExpired)
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
      {!accessToken ? (
        <View style={styles.loginScreen}>
          <Text style={styles.logo}>Studo</Text>
          <Text style={styles.subtitle}>Sua vida acadêmica organizada</Text>
          <TouchableOpacity style={styles.loginBtn} onPress={() => promptAsync()} disabled={!request}>
            <Text style={styles.loginBtnText}>Conectar Google Classroom</Text>
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
                <Text style={[styles.tabText, activeTab === 'todo' && styles.activeTabText]}>A Fazer</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'done' && styles.activeTab]} 
                onPress={() => setActiveTab('done')}
              >
                <Text style={[styles.tabText, activeTab === 'done' && styles.activeTabText]}>Histórico</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#4A80F0" />
              <Text style={{marginTop: 10}}>Sincronizando...</Text>
            </View>
          ) : (
            <ScrollView 
              contentContainerStyle={styles.taskList}
              refreshControl={
                <RefreshControl 
                  refreshing={refreshing} 
                  onRefresh={onRefresh} 
                  colors={["#4A80F0"]} 
                  tintColor={"#4A80F0"} 
                />
              }
            >
              {displayedTasks.length > 0 ? displayedTasks.map(item => (
                <View key={item.id} style={[styles.card, getCardStyle(item)]}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.materiaBadge, getBadgeStyle(item)]}>
                      <Text style={[styles.materiaText, getTextStyle(item)]}>{item.materia}</Text>
                    </View>
                    
                    <Text style={[styles.deadlineText, getTextStyle(item)]}>
                      {item.isCompleted 
                        ? 'Concluído' 
                        : (item.isVeryOld ? 'Antiga (Expirada)' : (item.isExpired ? 'Prazo Expirado' : `Prazo: ${item.deadlineLabel || 'Sem prazo'}`))}
                    </Text>
                  </View>
                  <Text style={[styles.taskTitle, getTextStyle(item)]}>{item.title}</Text>
                  <Text style={styles.taskDesc} numberOfLines={2}>{item.description}</Text>
                </View>
              )) : (
                 <View style={styles.emptyContainer}>
                  <Text style={styles.emptyEmoji}>{activeTab === 'done' ? '📂' : '🎉'}</Text>
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