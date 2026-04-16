import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useClassroomDataContext } from '../../src/contexts/ClassroomDataContext';
import { styles } from '../../src/styles/calendar.styles';

// Configuração do calendário para Português
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

export default function CalendarPage() {
  const router = useRouter();
  const { isAuthenticated, isLoadingAuth, tasks } = useClassroomDataContext();
  
  // Estados para seleção de data e controle do modal de detalhes
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoadingAuth, router]);

  // Filtra as tarefas que pertencem ao dia selecionado
  const tasksForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return tasks.filter(task => {
      if (!task.rawDate) return false;
      return task.rawDate.toISOString().split('T')[0] === selectedDate;
    });
  }, [selectedDate, tasks]);

  // Gera as marcações (bolinhas e seleção) do calendário
  const markedDates = useMemo(() => {
    const marks: any = {};
    
    tasks.forEach(task => {
      if (task.rawDate) {
        const dateString = task.rawDate.toISOString().split('T')[0];
        let dotColor = '#4A80F0'; // Azul: Pendente
        if (task.isCompleted) dotColor = '#209A2F'; // Verde: Concluída
        else if (task.urgency === 'red') dotColor = '#F01414'; // Vermelho: Urgente

        marks[dateString] = { marked: true, dotColor };
      }
    });

    if (selectedDate) {
      marks[selectedDate] = {
        ...marks[selectedDate],
        selected: true,
        selectedColor: '#3B74D7',
      };
    }

    return marks;
  }, [tasks, selectedDate]);

  const handleTaskPress = (task: any) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  if (!isAuthenticated || isLoadingAuth) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4A80F0" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendário</Text>
        <Text style={styles.subtitle}>Seus compromissos e prazos</Text>
      </View>

      <View style={styles.calendarCard}>
        <Calendar
          onDayPress={day => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          theme={{
            selectedDayBackgroundColor: '#3B74D7',
            todayTextColor: '#3B74D7',
            arrowColor: '#3B74D7',
            monthTextColor: '#3B74D7',
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
          }}
        />
      </View>

      {/* Legenda de cores */}
      <View style={styles.legendContainer}>
        <Text style={styles.sectionLabel}>Status das Tarefas</Text>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#4A80F0' }]} />
            <Text style={styles.legendText}>Pendente</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#209A2F' }]} />
            <Text style={styles.legendText}>Concluída</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F01414' }]} />
            <Text style={styles.legendText}>Urgente</Text>
          </View>
        </View>
      </View>

      {/* Lista de Tarefas do dia */}
      <View style={styles.taskListContainer}>
        <Text style={styles.sectionLabel}>
          {selectedDate ? `Tarefas em ${selectedDate.split('-').reverse().join('/')}` : 'Selecione um dia'}
        </Text>
        
        {tasksForSelectedDate.length > 0 ? (
          tasksForSelectedDate.map(item => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.taskItemSmall}
              onPress={() => handleTaskPress(item)}
            >
              <View style={[styles.statusIndicator, 
                { backgroundColor: item.isCompleted ? '#209A2F' : (item.urgency === 'red' ? '#F01414' : '#4A80F0') }
              ]} />
              <View>
                <Text style={styles.taskTitleSmall}>{item.title}</Text>
                <Text style={styles.taskMateriaSmall}>{item.materia}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : selectedDate ? (
          <Text style={styles.emptyText}>Nenhuma tarefa para este dia.</Text>
        ) : null}
      </View>

      {/* Modal de Detalhes da Tarefa */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.modalHeaderAccent, 
              { backgroundColor: selectedTask?.isCompleted ? '#209A2F' : (selectedTask?.urgency === 'red' ? '#F01414' : '#4A80F0') }
            ]} />
            
            <ScrollView contentContainerStyle={{ padding: 25 }}>
              <Text style={styles.modalTitle}>{selectedTask?.title}</Text>
              <Text style={styles.modalMateria}>{selectedTask?.materia}</Text>
              
              <View style={styles.modalDivider} />
              
              <Text style={styles.modalSectionTitle}>Descrição</Text>
              <Text style={styles.modalDescription}>
                {selectedTask?.description || 'Esta tarefa não possui uma descrição detalhada.'}
              </Text>

              <Text style={styles.modalSectionTitle}>Prazo de Entrega</Text>
              <Text style={styles.modalDescription}>{selectedTask?.deadlineLabel}</Text>
            </ScrollView>

            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fechar Detalhes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}