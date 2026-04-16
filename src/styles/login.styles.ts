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
    minWidth: 260,
    alignItems: 'center',
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
