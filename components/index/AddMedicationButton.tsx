import React from 'react';
import {
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { ThemedText } from '@/components/common/ThemedText';
import { ThemedView } from '@/components/common/ThemedView';

interface AddMedicationButtonProps {
  onPress: () => void;
  variant?: 'fab' | 'button';
  title?: string;
}

export default function AddMedicationButton({  
  onPress, 
  variant = 'fab',
  title = 'Add Medicine'
}: AddMedicationButtonProps) {
  
  if (variant === 'fab') {
    return (
      <TouchableOpacity
        style={styles.fab}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <ThemedText style={styles.fabIcon}>+</ThemedText>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <ThemedView style={styles.buttonContent}>
        <ThemedText style={styles.buttonIcon}>+</ThemedText>
        <ThemedText type="defaultSemiBold" style={styles.buttonText}>
          {title}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f78b33', // Primary brand color
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1a1a1a',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#f78b33', // Primary brand color
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#f78b33',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#061336', // Secondary brand color accent
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
  },
});