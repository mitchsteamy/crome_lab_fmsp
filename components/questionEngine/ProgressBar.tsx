import React from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "../common/ThemedView";

interface ProgressBarProps {
  progress: {
    current: number;
    total: number;
    percentage: number;
  };
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <ThemedView
      style={styles.progressContainer}
      lightColor="#fff"
      darkColor="#2a2a2a"
    >
      <ThemedView
        style={styles.progressBar}
        lightColor="#e0e0e0"
        darkColor="#404040"
      >
        <ThemedView
          style={[
            styles.progressFill,
            { width: `${progress.percentage}%` },
          ]}
          lightColor="#f78b33"
          darkColor="#f78b33"
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
}); 