import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useClassroomDataContext } from '../src/contexts/ClassroomDataContext';
import { styles } from '../src/styles/login.styles';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, promptAsync, isLoadingAuth } = useClassroomDataContext();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)/tasks');
    }
  }, [isAuthenticated, router]);

  return (
    <View style={styles.container}>
      <View style={styles.loginScreen}>
        <Text style={styles.logo}>Studo</Text>
        <Text style={styles.subtitle}>Sua vida academica organizada</Text>

        <TouchableOpacity
          style={[styles.loginBtn, isLoadingAuth && styles.loginBtnDisabled]}
          onPress={() => promptAsync()}
          disabled={isLoadingAuth}
        >
          {isLoadingAuth ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.loginBtnText}>Conectar Google Classroom</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
