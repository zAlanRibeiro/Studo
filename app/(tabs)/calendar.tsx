import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useClassroomDataContext } from '../../src/contexts/ClassroomDataContext';
import { styles } from '../../src/styles/calendar.styles';

export default function CalendarPage() {
  const router = useRouter();
  const { isAuthenticated, isLoadingAuth } = useClassroomDataContext();

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoadingAuth, router]);

  if (!isAuthenticated) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4A80F0" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendário</Text>
      <Text style={styles.subtitle}>A fazer</Text>
    </View>
  );
}
