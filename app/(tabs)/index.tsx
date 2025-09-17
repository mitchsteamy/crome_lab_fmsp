import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { ThemedText } from "../../components/common/ThemedText";
import { ThemedView } from "../../components/common/ThemedView";
import AddMedicationButton from "../../components/medications/AddMedicationButton";
import MedicationCard from "../../components/medications/MedicationCard";
import { StorageService } from "../../services/StorageService";
import { Medication } from "../../types/Medication";

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

  const renderMedicationItem = ({ item }: { item: Medication }) => (
    <MedicationCard
      medication={item}
      onPress={() => handleEditMedication(item.id)}
      onDelete={() => handleDeleteMedication(item.id)}
    />
  );

  const renderEmptyState = () => (
    <ThemedView style={styles.emptyState} darkColor="#1f1f1f">
      <ThemedText type="subtitle" style={styles.emptyTitle}>
        No Medications Yet
      </ThemedText>
      <ThemedText type="default" style={styles.emptySubtitle}>
        Add your first medication to start building your Medication Safety Plan
      </ThemedText>
      <AddMedicationButton onPress={handleAddMedication} />
    </ThemedView>
  );

  const renderHeader = () => (
    <ThemedView style={styles.header} lightColor="#fff" darkColor="#2a2a2a">
      <ThemedView
        style={styles.headerContent}
        lightColor="#fff"
        darkColor="#2a2a2a"
      >
        {Platform.OS === "web" ? (
          // Web layout: Text left, Logo right
          <>
            <ThemedView
              style={styles.headerTextContainer}
              lightColor="#fff"
              darkColor="#2a2a2a"
            >
              <ThemedText type="title">My Medications</ThemedText>
              <ThemedText type="default" lightColor="#666" darkColor="#ccc">
                {medications.length} medication
                {medications.length !== 1 ? "s" : ""}
              </ThemedText>
            </ThemedView>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </>
        ) : (
          // Mobile layout: Logo above, Text below
          <>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <ThemedView
              style={styles.headerTextContainer}
              lightColor="#fff"
              darkColor="#2a2a2a"
            >
              <ThemedText type="title">My Medications</ThemedText>
              <ThemedText type="default" lightColor="#666" darkColor="#ccc">
                {medications.length} medication
                {medications.length !== 1 ? "s" : ""}
              </ThemedText>
            </ThemedView>
          </>
        )}
      </ThemedView>
    </ThemedView>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.loadingContainer}>
          <ThemedText type="default">Loading medications...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <ThemedView
      style={styles.container}
      darkColor="#1f1f1f"
      lightColor="#f5f5f5"
    >
      <SafeAreaView style={styles.safeArea}>
        {renderHeader()}

        {medications.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            <FlatList
              data={medications}
              renderItem={renderMedicationItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              style={styles.list}
            />

            <ThemedView
              style={styles.fabContainer}
              darkColor="transparent"
              lightColor="#f5f5f5"
            >
              <AddMedicationButton onPress={handleAddMedication} /> 
            </ThemedView>
          </>
        )}
      </SafeAreaView>
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
  header: {
    marginTop: Platform.OS === "android" ? 48 : 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerContent: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    alignItems: "center",
  },
  headerLogo: {
    width: Platform.OS === "web" ? 250 : 200,
    height: Platform.OS === "web" ? 85 : 68,
    marginLeft: Platform.OS === "web" ? 15 : 0, // Changed from marginRight to marginLeft for web
    marginBottom: Platform.OS === "web" ? 0 : 24, // Changed from marginTop to marginBottom for mobile
    borderRadius: 8,
  },
  headerTextContainer: {
    flex: Platform.OS === "web" ? 1 : 0,
    alignItems: Platform.OS === "web" ? "flex-start" : "center",
  },
  headerTitle: {
    textAlign: Platform.OS === "web" ? "left" : "center",
  },
  headerSubtitle: {
    textAlign: Platform.OS === "web" ? "left" : "center",
  },
  list: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100, // Space for FAB
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
    bottom: 20,
    right: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
