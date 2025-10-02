import { ThemedText } from "@/components/common/ThemedText";
import { ThemedView } from "@/components/common/ThemedView";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";

interface MedicationActionButtonsProps {
  onDelete: () => void;
  onEdit?: () => void;
}

export default function MedicationActionButtons({
  onDelete,
  onEdit,
}: MedicationActionButtonsProps) {
  return (
    <ThemedView
      style={styles.actionButtons}
      lightColor="#fff"
      darkColor="#1f1f1f"
    >
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <ThemedText type="defaultSemiBold" style={styles.deleteButtonText}>
          Delete Medicine
        </ThemedText>
      </TouchableOpacity>

      {onEdit && (
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <ThemedText type="defaultSemiBold" style={styles.editButtonText}>
            Edit Medicine
          </ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: Platform.OS === "web" ? 0 : 36,
  },
  editButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#f78b33",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  editButtonText: {
    fontWeight: "600",
    color: "#f78b33",
  },
  deleteButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D54C4C",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#D54C4C",
    fontWeight: "600",
  },
});