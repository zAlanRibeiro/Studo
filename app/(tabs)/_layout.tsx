import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs
      initialRouteName="tasks"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        sceneStyle: {
          backgroundColor: '#F2F2F2',
        },
        tabBarStyle: {
          backgroundColor: '#4A80F0',
          borderTopWidth: 0,
          height: 62,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingHorizontal: 0,
          borderRadius: 0,
        },
        tabBarItemStyle: {
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 6,
        },
        tabBarIconStyle: {
          marginBottom: 0,
          alignSelf: 'center',
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#DCE8FF',
      }}
    >
      <Tabs.Screen
        name="tasks"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="document-text-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}