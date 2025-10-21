import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "../common/ThemedText";
import { ThemedView } from "../common/ThemedView";
import { Medication } from "../../types/Medication";
import { MedicationImportExport } from "../../services/MedicationImportExport";

interface ExportMedicationsButtonProps {
  medications: Medication[];
}

export default function ExportMedicationsButton({
  medications,
}: ExportMedicationsButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (medications.length === 0) {
      if (Platform.OS === "web") {
        alert("No medicines to export");
      } else {
        Alert.alert("No Medicines", "Add some medicines before exporting");
      }
      return;
    }

    try {
      setIsExporting(true);
      await MedicationImportExport.exportMedications(medications);

      if (Platform.OS === "web") {
        alert("Medicines exported successfully!");
      } else {
        Alert.alert("Success", "Medicines exported successfully!");
      }
    } catch (error) {
      console.error("Export error:", error);
      if (Platform.OS === "web") {
        alert("Failed to export medicines");
      } else {
        Alert.alert("Error", "Failed to export medicines");
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ThemedView
      style={styles.container}
      lightColor="transparent"
      darkColor="transparent"
    >
      <TouchableOpacity
        style={styles.button}
        onPress={handleExport}
        disabled={isExporting}
        activeOpacity={0.7}
      >
        {isExporting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <ThemedText
              style={styles.buttonText}
              lightColor="#f78b33"
              darkColor="#f78b33"
            >
              Export medicines
            </ThemedText>
          </>
        )}
      </TouchableOpacity>

      {medications.length > 0 && (
        <ThemedView
          style={styles.info}
          lightColor="transparent"
          darkColor="transparent"
        >
          <ThemedText
            style={styles.infoText}
            lightColor="#666"
            darkColor="#999"
          >
            Export will include {medications.length} medicine{medications.length !== 1 ? "s" : ""} that can be added other devices
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 12,
  },
  button: {
    borderWidth: 1.5,
    borderColor: "#f78b33",
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f78b33",
  },
  info: {
    marginTop: 8,
    alignItems: "center",
  },
  infoText: {
    fontSize: 11,
    textAlign: "center",
  },
});
