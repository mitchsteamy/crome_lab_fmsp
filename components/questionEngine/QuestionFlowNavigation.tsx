import React, { useEffect } from "react";
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

  // ✅ Add keyboard listener for Enter key
  useEffect(() => {
    if (Platform.OS !== "web") return; // Only on web

    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle Enter key
      if (event.key !== "Enter") return;

      // Get the currently focused element
      const activeElement = document.activeElement as HTMLElement;
      const tagName = activeElement?.tagName?.toLowerCase();

      // Allow Enter in textareas for new lines
      if (tagName === "textarea") {
        return; // Let textarea handle Enter normally
      }

      // For all other cases (buttons, selects, inputs, or no focus),
      // trigger Continue button if enabled
      if (canProceed) {
        event.preventDefault();
        event.stopPropagation(); // ✅ Stop event from bubbling to focused element

        // Blur the currently focused element to prevent re-triggering
        if (activeElement && typeof activeElement.blur === "function") {
          activeElement.blur();
        }

        onNext();
      }
    };

    // Use capture phase to intercept before focused element gets the event
    document.addEventListener("keydown", handleKeyPress, true); // ✅ true = capture phase

    // Cleanup on unmount
    return () => {
      document.removeEventListener("keydown", handleKeyPress, true);
    };
  }, [onNext, canProceed]);

  return (
    <ThemedView style={styles.navigation} lightColor="#fff" darkColor="#2a2a2a">
      <TouchableOpacity
        style={[styles.navButton, styles.backButton]}
        onPress={onPrevious}
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
          {isCompleted ? "Add Medicine" : "Continue"}
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
