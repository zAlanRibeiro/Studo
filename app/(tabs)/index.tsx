import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // NOVO: Estado para controlar qual aba está ativa ('todo' = A fazer, 'done' = Concluídas)
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
      fetchClassroomData(authentication.accessToken);
    }
  }, [response]);

  const fetchClassroomData = async (token) => {
    setLoading(true);
    try {
      // 1. Pega os cursos
      const coursesResponse = await fetch('https://classroom.googleapis.com/v1/courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const coursesData = await coursesResponse.json();

      if (coursesData.courses) {
        let allTasks = [];
        for (const course of coursesData.courses) {
          
          // 2. Pega as atividades daquele curso
          const workResponse = await fetch(`https://classroom.googleapis.com/v1/courses/${course.id}/courseWork`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const workData = await workResponse.json();
          
          // 3. NOVO: Pega o status de entrega do aluno para este curso
          const subsResponse = await fetch(`https://classroom.googleapis.com/v1/courses/${course.id}/courseWork/-/studentSubmissions?userId=me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const subsData = await subsResponse.json();
          
          // Cria um "dicionário" para achar fácil se a tarefa foi entregue
          const submissionsMap = {};
          if (subsData.studentSubmissions) {
            subsData.studentSubmissions.forEach(sub => {
              // TURNED_IN = Entregue | RETURNED = Devolvida com nota
              submissionsMap[sub.courseWorkId] = (sub.state === 'TURNED_IN' || sub.state === 'RETURNED');
            });
          }

          if (workData.courseWork) {
            const formattedTasks = workData.courseWork.map(work => ({
              id: work.id,
              title: work.title,
              materia: course.name,
              description: work.description || 'Sem descrição.',
              // Marca como true se estiver no nosso dicionário de concluídas, senão false
              isCompleted: submissionsMap[work.id] || false 
            }));
            allTasks = [...allTasks, ...formattedTasks];
          }
        }
        setTasks(allTasks);
      }
    } catch (error) {
      console.error("Erro ao carregar Classroom:", error);
    } finally {
      setLoading(false);
    }
  };

  // NOVO: Filtra a lista principal dependendo da aba escolhida
  const displayedTasks = tasks.filter(task => {
    if (activeTab === 'todo') return !task.isCompleted;
    if (activeTab === 'done') return task.isCompleted;
    return true;
  });

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
            
            {/* NOVO: Menu de Abas */}
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
                <Text style={[styles.tabText, activeTab === 'done' && styles.activeTabText]}>Concluídas</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#4A80F0" />
              <Text style={{marginTop: 10}}>Sincronizando com Classroom...</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.taskList}>
              {displayedTasks.length > 0 ? displayedTasks.map(item => (
                // Se a tarefa estiver concluída, mudamos um pouquinho o estilo dela pra ficar cinza/transparente
                <View key={item.id} style={[styles.card, item.isCompleted && styles.cardCompleted]}>
                  <View style={[styles.materiaBadge, item.isCompleted && styles.badgeCompleted]}>
                    <Text style={[styles.materiaText, item.isCompleted && styles.textCompleted]}>{item.materia}</Text>
                  </View>
                  <Text style={[styles.taskTitle, item.isCompleted && styles.textCompleted]}>{item.title}</Text>
                  <Text style={styles.taskDesc} numberOfLines={3}>{item.description}</Text>
                </View>
              )) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyEmoji}>{activeTab === 'done' ? '📭' : '🎉'}</Text>
                  <Text style={styles.emptyText}>
                    {activeTab === 'todo' 
                      ? "Tudo em dia! Nenhuma atividade pendente." 
                      : "Você ainda não tem tarefas concluídas."}
                  </Text>
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
  
  // Header modificado para caber as abas
  header: { backgroundColor: '#4A80F0', paddingTop: 60, paddingBottom: 0, alignItems: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  
  // Estilos das abas
  tabContainer: { flexDirection: 'row', width: '100%', paddingHorizontal: 20 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: 'white' },
  tabText: { color: 'rgba(255,255,255,0.6)', fontSize: 16, fontWeight: 'bold' },
  activeTabText: { color: 'white' },
  
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  taskList: { padding: 20 },
  
  // Estilos dos Cards Normais
  card: { backgroundColor: 'white', borderRadius: 15, padding: 15, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: '#4A80F0', elevation: 2 },
  materiaBadge: { backgroundColor: '#E1EBFF', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, marginBottom: 8 },
  materiaText: { color: '#4A80F0', fontSize: 11, fontWeight: 'bold' },
  taskTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  taskDesc: { fontSize: 13, color: '#777', lineHeight: 18 },
  
  // Estilos dos Cards Concluídos
  cardCompleted: { borderLeftColor: '#4CAF50', opacity: 0.7 },
  badgeCompleted: { backgroundColor: '#E8F5E9' },
  textCompleted: { color: '#4CAF50', textDecorationLine: 'line-through' },
  
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyEmoji: { fontSize: 40, marginBottom: 10 },
  emptyText: { textAlign: 'center', color: '#999', fontSize: 16 }
});