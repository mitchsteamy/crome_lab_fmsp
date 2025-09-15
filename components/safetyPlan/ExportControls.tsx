import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { ThemedView } from "../common/ThemedView";
import { ThemedText } from "../common/ThemedText";

interface ExportControlsProps {
  onExportPDF: () => void;
  onEmailShare: () => void;
}

export default function ExportControls({
  onExportPDF,
  onEmailShare,
}: ExportControlsProps) {
  return (
    <ThemedView style={styles.container} lightColor="#fff" darkColor="#1f1f1f">
      <ThemedView
        style={styles.topBorder}
        lightColor="#e0e0e0"
        darkColor="#404040"
      />
      <ThemedView
        style={styles.buttonContainer}
        lightColor="transparent"
        darkColor="transparent"
      >
        <TouchableOpacity
          style={[styles.button, styles.shareButton]}
          onPress={onEmailShare}
          activeOpacity={0.8}
        >
          <ThemedText type="defaultSemiBold" style={styles.shareButtonText}>
            Share
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.exportButton]}
          onPress={onExportPDF}
          activeOpacity={0.8}
        >
          <ThemedText
            type="defaultSemiBold"
            style={styles.exportButtonText}
            lightColor="#f78b33"
            darkColor="#f78b33"
          >
            Export
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  topBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  exportButton: {
    backgroundColor: "transparent",
    borderColor: "#f78b33",
  },
  shareButton: {
    backgroundColor: "transparent",
    borderColor: "#4CAF50",
  },
  exportButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  shareButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4CAF50",
  },
});
