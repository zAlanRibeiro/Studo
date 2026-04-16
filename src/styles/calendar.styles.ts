import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#F2F2F2',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#3B74D7',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  calendarCard: {
    backgroundColor: '#FFF',
    margin: 16,
    borderRadius: 20,
    padding: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  
  // Estilos da Legenda
  legendContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 1,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#444',
    fontWeight: '600',
  },

  // Estilos da Lista de Tarefas
  taskListContainer: {
    padding: 20,
  },
  taskItemSmall: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statusIndicator: {
    width: 5,
    height: 40,
    borderRadius: 3,
    marginRight: 15,
  },
  taskTitleSmall: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  taskMateriaSmall: {
    fontSize: 13,
    color: '#3B74D7',
    fontWeight: '500',
    marginTop: 2,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },

  // Estilos do Modal de Detalhes
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '85%',
    minHeight: '40%',
  },
  modalHeaderAccent: {
    height: 8,
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
  },
  modalMateria: {
    fontSize: 18,
    color: '#3B74D7',
    fontWeight: '600',
    marginTop: 5,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 20,
  },
  modalSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  modalDescription: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 25,
  },
  closeButton: {
    backgroundColor: '#3B74D7',
    margin: 25,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});