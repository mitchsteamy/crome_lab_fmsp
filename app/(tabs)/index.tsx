import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { ThemedText } from "../../components/common/ThemedText";
import { ThemedView } from "../../components/common/ThemedView";
import AddMedicationButton from "../../components/index/AddMedicationButton";
import MedicationCard from "../../components/index/MedicationCard";
import MedicationsHeader from "../../components/index/MedicationsHeader";
import MissionStatement from "../../components/index/MissionStatement";
import { StorageService } from "../../services/StorageService";
import { Medication } from "../../types/Medication";
import { groupMedicationsByPatient } from "../../utils/groupByPatient";

export default function MedicationsIndex() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load medications when component mounts
  useEffect(() => {
    loadMedications();
  }, []);

  // Reload medications when screen comes into focus (after adding/editing)
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
      console.error("Error loading medications:", error);
      if (Platform.OS === "web") {
        alert("Failed to load medications");
      } else {
        Alert.alert("Error", "Failed to load medications");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedication = () => {
    router.push("/medication/add");
  };

  const handleEditMedication = (medicationId: string) => {
    router.push(`/medication/${medicationId}`);
  };

  const handleDeleteMedication = async (medicationId: string) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Are you sure you want to delete this medication? This action cannot be undone."
      );
      if (confirmed) {
        try {
          await StorageService.deleteMedication(medicationId);
          setMedications((prev) =>
            prev.filter((med) => med.id !== medicationId)
          );
        } catch (error) {
          alert("Failed to delete medication");
        }
      }
    } else {
      Alert.alert(
        "Delete Medication",
        "Are you sure you want to delete this medication? This action cannot be undone.",
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
                Alert.alert("Error", "Failed to delete medication");
              }
            },
          },
        ]
      );
    }
  };

  const renderEmptyState = () => (
    <ThemedView style={styles.emptyState}>
      <ThemedText type="subtitle" style={styles.emptyTitle}>
        No Medications Yet
      </ThemedText>
      <ThemedText
        type="default"
        lightColor="#666"
        darkColor="#ccc"
        style={styles.emptySubtitle}
      >
        Tap the + button below to add your first medication
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
                style={styles.patientHeader}
                lightColor="transparent"
                darkColor="transparent"
              >
                <ThemedText
                  type="subtitle"
                  style={styles.patientHeaderText}
                  lightColor="#f78b33"
                  darkColor="#f78b33"
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
        </ScrollView>

        <ThemedView
          style={styles.fabContainer}
          darkColor="transparent"
          lightColor="transparent"
        >
          <AddMedicationButton onPress={handleAddMedication} />
        </ThemedView>
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

        {medications.length === 0 ? renderEmptyState() : renderGroupedMedications()}
      </ThemedView>
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
    paddingBottom: 100, // Space for FAB
  },
  patientGroup: {
    marginBottom: 24,
  },
  patientHeader: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#f78b33",
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
  fabContainer: {
    position: "absolute",
    bottom: 90,
    right: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});