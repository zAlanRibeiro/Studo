import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Necessário para o navegador fechar o pop-up
WebBrowser.maybeCompleteAuthSession();

export default function IndexScreen() {
  const [accessToken, setAccessToken] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Descobre automaticamente a URL do seu localhost
  const redirectUri = AuthSession.makeRedirectUri();
  
  // Configuração para rodar no seu computador
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '990267192314-h2lhq3dp81s1lh8prju7i7tg8n74knfv.apps.googleusercontent.com',
    redirectUri: redirectUri,
    extraParams: {
      prompt: 'select_account',
    },
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
    } else if (response?.type === 'error') {
      console.error("Erro no login:", response.error);
    }
  }, [response, redirectUri]);

  // Busca dados das turmas e atividades
  const fetchClassroomData = async (token) => {
    setLoading(true);
    try {
      const coursesResponse = await fetch('https://classroom.googleapis.com/v1/courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const coursesData = await coursesResponse.json();

      if (coursesData.courses) {
        let allTasks = [];
        for (const course of coursesData.courses) {
          const workResponse = await fetch(`https://classroom.googleapis.com/v1/courses/${course.id}/courseWork`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const workData = await workResponse.json();
          
          if (workData.courseWork) {
            const formattedTasks = workData.courseWork.map(work => ({
              id: work.id,
              title: work.title,
              materia: course.name,
              description: work.description || 'Sem descrição.',
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

  return (
    <View style={styles.container}>
      {!accessToken ? (
        <View style={styles.loginScreen}>
          <Text style={styles.logo}>Studo</Text>
          <Text style={styles.subtitle}>Sua vida acadêmica organizada</Text>
          <TouchableOpacity 
            style={styles.loginBtn} 
            onPress={() => promptAsync()}
            disabled={!request}
          >
            <Text style={styles.loginBtnText}>Conectar Google Classroom</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Atividades Pendentes</Text>
          </View>
          
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#4A80F0" />
              <Text style={{marginTop: 10}}>Sincronizando com Classroom...</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.taskList}>
              {tasks.length > 0 ? tasks.map(item => (
                <View key={item.id} style={styles.card}>
                  <View style={styles.materiaBadge}>
                    <Text style={styles.materiaText}>{item.materia}</Text>
                  </View>
                  <Text style={styles.taskTitle}>{item.title}</Text>
                  <Text style={styles.taskDesc} numberOfLines={3}>{item.description}</Text>
                </View>
              )) : (
                <Text style={styles.emptyText}>Nenhuma atividade encontrada.</Text>
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
  loginBtn: { backgroundColor: '#4A80F0', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, elevation: 5, marginBottom: 15 },
  loginBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  header: { backgroundColor: '#4A80F0', paddingTop: 60, paddingBottom: 20, alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  taskList: { padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 15, padding: 15, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: '#4A80F0', elevation: 2 },
  materiaBadge: { backgroundColor: '#E1EBFF', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, marginBottom: 8 },
  materiaText: { color: '#4A80F0', fontSize: 11, fontWeight: 'bold' },
  taskTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  taskDesc: { fontSize: 13, color: '#777', lineHeight: 18 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' }
});