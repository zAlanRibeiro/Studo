import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loginScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#4A80F0',
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  loginBtn: {
    backgroundColor: '#4A80F0',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 5,
  },
  loginBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4A80F0',
    paddingTop: 60,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: 'white',
  },
  tabText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: 'white',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  taskList: {
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#4A80F0',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  materiaBadge: {
    backgroundColor: '#E1EBFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  materiaText: {
    color: '#4A80F0',
    fontSize: 11,
    fontWeight: 'bold',
  },
  deadlineText: {
    fontSize: 11,
    color: '#4A80F0',
    fontWeight: 'bold',
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  taskDesc: {
    fontSize: 13,
    color: '#777',
    lineHeight: 18,
  },
  cardSafe: {
    borderLeftColor: '#4CAF50',
  },
  badgeSafe: {
    backgroundColor: '#E8F5E9',
  },
  textSafe: {
    color: '#4CAF50',
  },
  cardWarning: {
    borderLeftColor: '#FF9800',
  },
  badgeWarning: {
    backgroundColor: '#FFF3E0',
  },
  textWarning: {
    color: '#FF9800',
  },
  cardUrgent: {
    borderLeftColor: '#FF5252',
  },
  badgeUrgent: {
    backgroundColor: '#FFEBEE',
  },
  textUrgent: {
    color: '#FF5252',
  },
  cardCompleted: {
    borderLeftColor: '#4CAF50',
    opacity: 0.8,
  },
  badgeCompleted: {
    backgroundColor: '#E8F5E9',
  },
  textCompleted: {
    color: '#4CAF50',
    textDecorationLine: 'line-through',
  },
  cardExpired: {
    borderLeftColor: '#D32F2F',
    opacity: 0.7,
  },
  badgeExpired: {
    backgroundColor: '#FFEBEE',
  },
  textExpired: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
});