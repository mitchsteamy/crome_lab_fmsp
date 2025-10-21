import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, useColorScheme } from "react-native";
import { ThemedText } from "../../components/common/ThemedText";
import { ThemedView } from "../../components/common/ThemedView";
import AddMedicationButton from "../../components/index/AddMedicationButton";
import ExportMedicationsButton from "../../components/index/ExportMedicationsButtons";
import MedicationCard from "../../components/index/MedicationCard";
import MedicationsHeader from "../../components/index/MedicationsHeader";
import MissionStatement from "../../components/index/MissionStatement";
import AddMethodSelector from "../../components/index/AddMedicationSelector";
import { StorageService } from "../../services/StorageService";
import { MedicationImportExport } from "../../services/MedicationImportExport";
import { Medication } from "../../types/Medication";
import { groupMedicationsByPatient } from "../../utils/groupByPatient";

export default function MedicationsIndex() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMethodSelector, setShowAddMethodSelector] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    loadMedications();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMedications();
    }, [])
  );

  const loadMedications = async () => {
    try {
      setLoading(true);
      const loadedMedications = await StorageService.retrieveMedications();
      setMedications(loadedMedications);
    } catch (error) {
      console.error("Error loading medicines:", error);
      if (Platform.OS === "web") {
        alert("Failed to load medicines");
      } else {
        Alert.alert("Error", "Failed to load medicines");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedication = () => {
    setShowAddMethodSelector(true);
  };

  const handleManualAdd = () => {
    setShowAddMethodSelector(false);
    router.push("/medication/add");
  };

  const handleImport = async () => {
    setShowAddMethodSelector(false);

    try {
      const result = await MedicationImportExport.importMedications();

      if (result.success && result.medications) {
        const { added, skipped } =
          await MedicationImportExport.mergeImportedMedications(
            result.medications
          );

        const message = `Successfully imported ${added} medicine${
          added !== 1 ? "s" : ""
        }${
          skipped > 0
            ? `. ${skipped} medicine${skipped !== 1 ? "s" : ""} skipped.`
            : "."
        }`;

        if (Platform.OS === "web") {
          alert(message);
        } else {
          Alert.alert("Import Successful", message);
        }

        // Reload medications after import
        await loadMedications();
      } else if (result.error && result.error !== "Import cancelled") {
        if (Platform.OS === "web") {
          alert(result.error);
        } else {
          Alert.alert("Import Failed", result.error);
        }
      }
    } catch (error) {
      console.error("Import error:", error);
      if (Platform.OS === "web") {
        alert("Failed to import medicines");
      } else {
        Alert.alert("Error", "Failed to import medicines");
      }
    }
  };

  const handleEditMedication = (medicationId: string) => {
    router.push(`/medication/${medicationId}`);
  };

  const handleDeleteMedication = async (medicationId: string) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Are you sure you want to delete this medicine? This action cannot be undone."
      );
      if (confirmed) {
        try {
          await StorageService.deleteMedication(medicationId);
          setMedications((prev) =>
            prev.filter((med) => med.id !== medicationId)
          );
        } catch (error) {
          alert("Failed to delete medicine");
        }
      }
    } else {
      Alert.alert(
        "Delete Medicine",
        "Are you sure you want to delete this medicine? This action cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await StorageService.deleteMedication(medicationId);
                setMedications((prev) =>
                  prev.filter((med) => med.id !== medicationId)
                );
              } catch (error) {
                Alert.alert("Error", "Failed to delete medicine");
              }
            },
          },
        ]
      );
    }
  };

  const renderEmptyState = () => (
    <ThemedView
      style={styles.emptyState}
      lightColor="transparent"
      darkColor="transparent"
    >
      <ThemedText type="subtitle" style={styles.emptyTitle}>
        No Medicines Yet
      </ThemedText>
      <ThemedText
        type="default"
        lightColor="#666"
        darkColor="#ccc"
        style={styles.emptySubtitle}
      >
        Tap the + button below to add your first medicine
      </ThemedText>
      <AddMedicationButton onPress={handleAddMedication} />
    </ThemedView>
  );

  const renderGroupedMedications = () => {
    const { grouped, sortedPatients } = groupMedicationsByPatient(medications);

    return (
      <>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {sortedPatients.map((patientName) => (
            <ThemedView
              key={patientName}
              style={styles.patientGroup}
              lightColor="transparent"
              darkColor="transparent"
            >
              <ThemedView
                style={[
                  styles.patientHeader,
                  {
                    borderBottomColor:
                      colorScheme === "dark" ? "#fff" : "#000", // Both orange for now
                  },
                ]}
                lightColor="transparent"
                darkColor="transparent"
              >
                <ThemedText
                  type="subtitle"
                  style={styles.patientHeaderText}
                >
                  {patientName}
                </ThemedText>
              </ThemedView>

              <ThemedView
                style={styles.medicationsContainer}
                lightColor="transparent"
                darkColor="transparent"
              >
                {grouped[patientName].map((medication: Medication) => (
                  <MedicationCard
                    key={medication.id}
                    medication={medication}
                    onPress={() => handleEditMedication(medication.id)}
                    onDelete={() => handleDeleteMedication(medication.id)}
                  />
                ))}
              </ThemedView>
            </ThemedView>
          ))}
          <ExportMedicationsButton medications={medications} />
        </ScrollView>
      </>
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.loadingContainer}>
          <ThemedText type="default">Loading medications...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={styles.container}
      darkColor="#1f1f1f"
      lightColor="#f5f5f5"
    >
      <ThemedView
        style={styles.safeArea}
        darkColor="#1f1f1f"
        lightColor="#f5f5f5"
      >
        <MedicationsHeader medicationCount={medications.length} />
        <MissionStatement />

        {medications.length === 0
          ? renderEmptyState()
          : renderGroupedMedications()}
      </ThemedView>

      <AddMethodSelector
        visible={showAddMethodSelector}
        onClose={() => setShowAddMethodSelector(false)}
        onManual={handleManualAdd}
        onImport={handleImport}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  patientGroup: {
    marginBottom: 24,
  },
  patientHeader: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
  },
  patientHeaderText: {
    fontSize: 18,
    fontWeight: "600",
  },
  medicationsContainer: {
    gap: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    textAlign: "center",
    marginBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
