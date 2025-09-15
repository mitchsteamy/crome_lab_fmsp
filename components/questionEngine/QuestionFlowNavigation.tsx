import React from "react";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../common/ThemedText";
import { ThemedView } from "../common/ThemedView";

interface QuestionFlowNavigationProps {
  onNext: () => void;
  onPrevious: () => void;
  canProceed: boolean;
  isCompleted: boolean;
  showInstructions: boolean;
  progress: {
    current: number;
    total: number;
    percentage: number;
  };
}

export default function QuestionFlowNavigation({
  onNext,
  onPrevious,
  canProceed,
  isCompleted,
  showInstructions,
  progress,
}: QuestionFlowNavigationProps) {
  const isBackDisabled = showInstructions && progress.current === 1;

  return (
    <ThemedView style={styles.navigation} lightColor="#fff" darkColor="#2a2a2a">
      <TouchableOpacity
        style={[styles.navButton, styles.backButton]}
        onPress={onPrevious}
        disabled={isBackDisabled}
        activeOpacity={0.7}
      >
        <ThemedText
          style={[
            styles.backButtonText,
            isBackDisabled && styles.disabledButtonText,
          ]}
          lightColor="#666"
          darkColor="#999"
        >
          Back
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.navButton,
          styles.continueButton,
          !canProceed && styles.disabledButton,
        ]}
        onPress={onNext}
        disabled={!canProceed}
        activeOpacity={0.7}
      >
        <ThemedText style={styles.continueButtonText}>
          {isCompleted ? "Add Medication" : "Continue"}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  navigation: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  continueButton: {
    backgroundColor: "#f78b33",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  disabledButtonText: {
    color: "#ccc",
  },
});
