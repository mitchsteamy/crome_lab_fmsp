import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions
} from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

interface ConfirmDeleteModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteModal({
  visible,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}: ConfirmDeleteModalProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <ThemedView style={styles.overlay} lightColor="rgba(0, 0, 0, 0.5)" darkColor="rgba(0, 0, 0, 0.7)">
        <ThemedView style={styles.modal} lightColor="#fff" darkColor="#2a2a2a">
          <ThemedView style={styles.header} lightColor="transparent" darkColor="transparent">
            <ThemedText 
              style={styles.title}
              lightColor="#333"
              darkColor="#fff"
            >
              {title}
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.content} lightColor="transparent" darkColor="transparent">
            <ThemedText 
              style={styles.message}
              lightColor="#666"
              darkColor="#ccc"
            >
              {message}
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.actions} lightColor="transparent" darkColor="transparent">
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <ThemedText 
                style={styles.cancelButtonText}
                lightColor="#666"
                darkColor="#ccc"
              >
                {cancelText}
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.confirmButtonText}>{confirmText}</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    borderRadius: 12,
    width: Math.min(width - 40, 400),
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  confirmButton: {
    backgroundColor: '#f78b33',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});