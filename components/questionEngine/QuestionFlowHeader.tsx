import React from "react";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../common/ThemedText";
import { ThemedView } from "../common/ThemedView";

interface QuestionFlowHeaderProps {
  onCancel: () => void;
  progress: {
    current: number;
    total: number;
    percentage: number;
  };
  showProgress: boolean;
}

export default function QuestionFlowHeader({ 
  onCancel, 
  progress, 
  showProgress 
}: QuestionFlowHeaderProps) {
  return (
    <ThemedView style={styles.header} lightColor="#fff" darkColor="#2a2a2a">
      <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
        <ThemedText style={styles.cancelText}>Cancel</ThemedText>
      </TouchableOpacity>

      <ThemedView
        style={styles.headerCenter}
        lightColor="transparent"
        darkColor="transparent"
      >
        <ThemedText
          style={styles.headerTitle}
          lightColor="#333"
          darkColor="#fff"
        >
          Medication Safety Plan
        </ThemedText>
        {showProgress && (
          <ThemedText
            style={styles.progressText}
            lightColor="#666"
            darkColor="#999"
          >
            {progress.current} of {progress.total}
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView
        style={styles.headerSpacer}
        lightColor="transparent"
        darkColor="transparent"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingTop: Platform.OS === "ios" ? 60 : 16,
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    minWidth: 60,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerSpacer: {
    minWidth: 60,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  progressText: {
    fontSize: 14,
    marginTop: 2,
  },
  cancelText: {
    color: "#f78b33",
    fontSize: 16,
  },
}); 