import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useClassroomDataContext } from '../../src/contexts/ClassroomDataContext';
import { storage, StoredAtestado } from '../../src/storage';
import { styles } from '../../src/styles/atestados.styles';

function formatDateBR(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

interface FormState {
  titulo: string;
  medico: string;
  crm: string;
  data: string;
  descricao: string;
  imageUri: string;
}

const emptyForm = (): FormState => ({
  titulo: '',
  medico: '',
  crm: '',
  data: todayISO(),
  descricao: '',
  imageUri: '',
});

export default function AtestadosPage() {
  const router = useRouter();
  const { isAuthenticated, isLoadingAuth } = useClassroomDataContext();

  const [atestados, setAtestados] = useState<StoredAtestado[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoadingAuth, router]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      storage.getAtestados().then((data) => {
        if (active) setAtestados(data);
      });
      return () => { active = false; };
    }, [])
  );

  const openModal = () => {
    setForm(emptyForm());
    setModalVisible(true);
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para anexar imagens.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      setForm((prev) => ({ ...prev, imageUri: result.assets[0].uri }));
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para tirar fotos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      setForm((prev) => ({ ...prev, imageUri: result.assets[0].uri }));
    }
  };

  const showImageOptions = () => {
    Alert.alert('Adicionar imagem', 'Escolha uma opção', [
      { text: 'Galeria', onPress: pickImage },
      { text: 'Câmera', onPress: takePhoto },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const handleSave = async () => {
    if (!form.titulo.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o título do atestado.');
      return;
    }
    if (!form.medico.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o nome do médico.');
      return;
    }
    if (!form.data) {
      Alert.alert('Campo obrigatório', 'Informe a data do atestado.');
      return;
    }

    setSaving(true);
    try {
      const novoAtestado: StoredAtestado = {
        id: Date.now().toString(),
        titulo: form.titulo.trim(),
        medico: form.medico.trim(),
        crm: form.crm.trim() || undefined,
        data: form.data,
        descricao: form.descricao.trim() || undefined,
        imageUri: form.imageUri || undefined,
        created_at: new Date().toISOString(),
      };

      const atualizados = [novoAtestado, ...atestados];
      await storage.setAtestados(atualizados);
      setAtestados(atualizados);
      setModalVisible(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Excluir atestado', 'Tem certeza que deseja excluir este atestado?', [
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          const atualizados = atestados.filter((a) => a.id !== id);
          await storage.setAtestados(atualizados);
          setAtestados(atualizados);
        },
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Atestados Médicos</Text>

        <TouchableOpacity style={styles.addButton} onPress={openModal}>
          <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Adicionar Atestado</Text>
        </TouchableOpacity>

        {atestados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={52} color="#B0BEC5" />
            <Text style={styles.emptyTitle}>Nenhum atestado salvo</Text>
            <Text style={styles.emptyDescription}>
              Adicione seus atestados médicos para mantê-los organizados.
            </Text>
          </View>
        ) : (
          atestados.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.titulo}</Text>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash-outline" size={18} color="#E53935" />
                </TouchableOpacity>
              </View>

              <View style={styles.cardRow}>
                <Ionicons name="calendar-outline" size={14} color="#4A80F0" />
                <Text style={styles.cardLabel}>Data:</Text>
                <Text style={styles.cardValue}>{formatDateBR(item.data)}</Text>
              </View>

              <View style={styles.cardRow}>
                <Ionicons name="person-outline" size={14} color="#4A80F0" />
                <Text style={styles.cardLabel}>Médico:</Text>
                <Text style={styles.cardValue}>{item.medico}</Text>
              </View>

              {item.crm ? (
                <View style={styles.cardRow}>
                  <Ionicons name="card-outline" size={14} color="#4A80F0" />
                  <Text style={styles.cardLabel}>CRM:</Text>
                  <Text style={styles.cardValue}>{item.crm}</Text>
                </View>
              ) : null}

              {item.descricao ? (
                <Text style={styles.cardDescription}>{item.descricao}</Text>
              ) : null}

              {item.imageUri ? (
                <Image source={{ uri: item.imageUri }} style={styles.cardImage} />
              ) : null}
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView style={styles.modalContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Novo Atestado</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#555" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Título *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Atestado de consulta"
              value={form.titulo}
              onChangeText={(v) => setForm((p) => ({ ...p, titulo: v }))}
            />

            <Text style={styles.label}>Médico *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do médico"
              value={form.medico}
              onChangeText={(v) => setForm((p) => ({ ...p, medico: v }))}
            />

            <Text style={styles.label}>CRM</Text>
            <TextInput
              style={styles.input}
              placeholder="CRM do médico (opcional)"
              value={form.crm}
              onChangeText={(v) => setForm((p) => ({ ...p, crm: v }))}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Data (AAAA-MM-DD) *</Text>
            <TextInput
              style={styles.input}
              placeholder="2025-05-28"
              value={form.data}
              onChangeText={(v) => setForm((p) => ({ ...p, data: v }))}
              keyboardType="numeric"
              maxLength={10}
            />

            <Text style={styles.label}>Observação</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Informações adicionais (opcional)"
              value={form.descricao}
              onChangeText={(v) => setForm((p) => ({ ...p, descricao: v }))}
              multiline
            />

            <TouchableOpacity style={styles.imagePicker} onPress={showImageOptions}>
              <Ionicons name="image-outline" size={20} color="#4A80F0" />
              <Text style={styles.imagePickerText}>
                {form.imageUri ? 'Trocar imagem' : 'Anexar foto do atestado'}
              </Text>
            </TouchableOpacity>

            {form.imageUri ? (
              <Image source={{ uri: form.imageUri }} style={styles.previewImage} />
            ) : null}

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>{saving ? 'Salvando...' : 'Salvar Atestado'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}
