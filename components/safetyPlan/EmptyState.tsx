import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../common/ThemedText";
import { ThemedView } from "../common/ThemedView";

interface EmptyStateProps {
  onAddMedication?: () => void;
}

export default function EmptyState({ onAddMedication }: EmptyStateProps) {
  return (
    <ThemedView
      style={styles.emptyState}
      lightColor="transparent"
      darkColor="transparent"
    >
      <ThemedText
        type="title"
        style={styles.emptyTitle}
        lightColor="#333"
        darkColor="#fff"
      >
        No Medications Yet
      </ThemedText>
      <ThemedText
        style={styles.emptySubtitle}
        lightColor="#666"
        darkColor="#999"
      >
        Add medications to your list to generate a comprehensive Family
        Medication Safety Plan.
      </ThemedText>
      {onAddMedication && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={onAddMedication}
        >
          <ThemedText style={styles.addButtonText}>
            Add Your First Medication
          </ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  addButton: {
    backgroundColor: "#f78b33",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});