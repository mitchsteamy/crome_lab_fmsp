import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../common/ThemedText';
import { ThemedView } from '../common/ThemedView';
import { IconSymbol } from '../ui/IconSymbol';

interface AddMethodSelectorProps {
  visible: boolean;
  onClose: () => void;
  onManual: () => void;
  onImport: () => void;
}

export default function AddMethodSelector({
  visible,
  onClose,
  onManual,
  onImport,
}: AddMethodSelectorProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <ThemedView style={styles.modal} lightColor="#fff" darkColor="#2a2a2a">
          <ThemedText type="subtitle" style={styles.title}>
            How would you like to add medicines?
          </ThemedText>

          <TouchableOpacity
            style={styles.option}
            onPress={onManual}
            activeOpacity={0.7}
          >
            <View style={styles.optionContent}>
              <IconSymbol
                name="add.circle"
                size={32}
                color="#f78b33"
                style={styles.optionIcon}
              />
              <View style={styles.optionText}>
                <ThemedText type="defaultSemiBold" style={styles.optionTitle}>
                  Add Manually
                </ThemedText>
                <ThemedText
                  type="default"
                  lightColor="#666"
                  darkColor="#ccc"
                  style={styles.optionDescription}
                >
                  Enter medicine details step by step
                </ThemedText>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={onImport}
            activeOpacity={0.7}
          >
            <View style={styles.optionContent}>
              <IconSymbol
                name="chevron.right"
                size={32}
                color="#f78b33"
                style={styles.optionIcon}
              />
              <View style={styles.optionText}>
                <ThemedText type="defaultSemiBold" style={styles.optionTitle}>
                  Import from File
                </ThemedText>
                <ThemedText
                  type="default"
                  lightColor="#666"
                  darkColor="#ccc"
                  style={styles.optionDescription}
                >
                  Upload an FMSP JSON file
                </ThemedText>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <ThemedText
              type="default"
              lightColor="#666"
              darkColor="#ccc"
              style={styles.cancelText}
            >
              Cancel
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  option: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
  },
  cancelButton: {
    marginTop: 8,
    padding: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
  },
});