import { ThemedText } from "@/components/common/ThemedText";
import { ThemedView } from "@/components/common/ThemedView";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
import MedicationActionButtons from "../../components/medication/MedicationActionButton";
import MedicationCommunicationSection from "../../components/medication/MedicationCommunicationSection";
import MedicationDetailHeader from "../../components/medication/MedicationDetailHeader";
import MedicationInfoSection from "../../components/medication/MedicationInfoSection";
import MedicationScheduleSection from "../../components/medication/MedicationScheduleSection";
import MedicationStatusBanner from "../../components/medication/MedicationStatusBanner";
import { StorageService } from "../../services/StorageService";
import { Medication } from "../../types/Medication";
import { DateUtils } from "../../utils/dateUtils";
import { FormatUtils } from "../../utils/formatUtils";

export default function MedicationDetailPage() {
  const [medication, setMedication] = useState<Medication | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSecondConfirm, setShowSecondConfirm] = useState(false);
  const router = useRouter();
  const { id } = useLocalSearchParams();

  console.log("Medication:", medication);

  useEffect(() => {
    loadMedication();
  }, [id]);

  const loadMedication = async () => {
    try {
      setLoading(true);
      const med = await StorageService.getMedication(id as string);
      setMedication(med);
    } catch (error) {
      console.error("Error loading medication:", error);
      if (Platform.OS === "web") {
        alert("Failed to load medication details");
      } else {
        Alert.alert("Error", "Failed to load medication details");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (Platform.OS === "web") {
      alert(
        "Edit functionality will be available in the next update when we add editing to the question engine."
      );
    } else {
      Alert.alert(
        "Edit Medicine",
        "Edit functionality will be available in the next update when we add editing to the question engine.",
        [{ text: "OK" }]
      );
    }
  };

  const handleDelete = () => {
    if (!medication) return;
    setShowDeleteModal(true);
  };

  const handleFirstConfirm = () => {
    setShowDeleteModal(false);
    setShowSecondConfirm(true);
  };

  const handleSecondConfirm = async () => {
    setShowSecondConfirm(false);
    await performDelete();
  };

  const handleCancel = () => {
    setShowDeleteModal(false);
    setShowSecondConfirm(false);
  };

  const handleBack = () => {
    if (Platform.OS === "web") {
      router.push("/");
    } else {
      router.back();
    }
  };

  const performDelete = async () => {
    if (!medication) return;

    try {
      await StorageService.deleteMedication(medication.id);
      router.back();
    } catch (error) {
      console.error("Error deleting medication:", error);
      if (Platform.OS === "web") {
        alert("Failed to delete medication");
      } else {
        Alert.alert("Error", "Failed to delete medication");
      }
    }
  };

  if (loading) {
    return (
      <ThemedView
        style={styles.container}
        lightColor="#f5f5f5"
        darkColor="#1f1f1f"
      >
        <ThemedView style={styles.safeArea}>
          <MedicationDetailHeader title="Loading..." onBack={handleBack} />
          <ThemedView
            style={styles.loadingContainer}
            lightColor="transparent"
            darkColor="transparent"
          >
            <ThemedText type="default" lightColor="#666" darkColor="#999">
              Loading medicine details...
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    );
  }

  if (!medication) {
    return (
      <ThemedView
        style={styles.container}
        lightColor="#f5f5f5"
        darkColor="#1f1f1f"
      >
        <ThemedView style={styles.safeArea}>
          <MedicationDetailHeader title="Not Found" onBack={handleBack} />
          <ThemedView
            style={styles.errorContainer}
            lightColor="transparent"
            darkColor="transparent"
          >
            <ThemedText type="default" style={styles.errorText}>
              Medicine not found
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={styles.container}
      lightColor="#f5f5f5"
      darkColor="#1f1f1f"
    >
      <ThemedView style={styles.safeArea} lightColor="#f5f5f5">
        <MedicationDetailHeader
          title={medication.brandName}
          onBack={handleBack}
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <MedicationStatusBanner medication={medication} />

          {/* Basic Information */}
          <MedicationInfoSection
            title="Basic Info"
            details={[
              {
                label: "Brand name",
                value: medication.brandName,
                important: true,
              },
              { label: "Generic name", value: medication.genericName },
              {
                label: "Why you take it",
                value: medication.reasonForUse,
                important: true,
              },
              {
                label: "Type",
                value: FormatUtils.formatPrescriptionType(
                  medication.prescriptionType
                ),
              },
            ]}
          />

          {/* Dosage & Administration */}
          <MedicationInfoSection
            title="How You Take It"
            details={[
              {
                label: "How much",
                value: `${FormatUtils.formatDosage(
                  medication.dosageAmount,
                  medication.dosageUnit
                )}${medication.dosageStrength ? ` (${medication.dosageStrength})` : ""}`,
                important: true,
              },
              {
                label: "How you take it",
                value: FormatUtils.formatAdministrationMethod(
                  medication.administrationMethod
                ),
              },
              {
                label: "With food",
                value: FormatUtils.formatFoodRequirement(
                  medication.foodRequirement
                ),
              },
            ]}
          />

          {/* Schedule */}
          <MedicationScheduleSection medication={medication} />

          {/* Duration */}
          <MedicationInfoSection
            title="How Long"
            details={[
              {
                label: "Started",
                value: DateUtils.formatDate(medication.startDate, "long"),
              },
              {
                label: "Ends",
                value: medication.endDate
                  ? DateUtils.formatDate(medication.endDate, "long")
                  : "Ongoing",
              },
              {
                label: "Expires",
                value: medication?.storage?.expirationDate
                  ? DateUtils.formatDate(
                      medication.storage.expirationDate,
                      "long"
                    )
                  : "Not sure",
              },
            ]}
          />

          {/* Safety Information */}
          <MedicationInfoSection
            title="Safety Info"
            details={[
              { label: "What it does", value: medication.benefits },
              { label: "Side effects", value: medication.sideEffects },
              {
                label: "Don't take with",
                value: medication.drugInteractions,
              },
              {
                label: "Don't eat or drink with",
                value: medication.foodInteractions,
              },
            ]}
          />

          {/* Storage & Disposal */}
          <MedicationInfoSection
            title="Storage & Disposal"
            details={[
              {
                label: "How to store it",
                value: medication.storage?.instructions,
              },
              {
                label: "Where you keep it",
                value: medication.storage?.location,
              },
              {
                label: "How to get rid of it",
                value: medication.storage?.disposalInstructions,
              },
            ]}
          />

          {/* Communication & Safety Section */}
          <MedicationCommunicationSection medication={medication} />

          {/* Metadata */}
          <MedicationInfoSection
            title="Record Info"
            details={[
              {
                label: "Added",
                value: DateUtils.formatDate(medication.createdAt, "datetime"),
              },
              {
                label: "Last updated",
                value: DateUtils.formatDate(medication.updatedAt, "datetime"),
              },
            ]}
          />

          <ThemedView
            style={styles.bottomSpacer}
            lightColor="transparent"
            darkColor="transparent"
          />

          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        </ScrollView>

        {/* Action Buttons */}
        <MedicationActionButtons onDelete={handleDelete} />

        {/* Delete Confirmation Modals */}
        <ConfirmDeleteModal
          visible={showDeleteModal}
          title="Delete Medicine"
          message={`Are you sure you want to delete "${medication?.brandName}"?\n\nThis will permanently remove this medicine from your safety plan and cannot be undone.`}
          onConfirm={handleFirstConfirm}
          onCancel={handleCancel}
        />

        <ConfirmDeleteModal
          visible={showSecondConfirm}
          title="Confirm Deletion"
          message={`This will permanently delete "${medication?.brandName}" from your medicine list.`}
          confirmText="Yes, Delete"
          onConfirm={handleSecondConfirm}
          onCancel={handleCancel}
        />
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
  headerLogo: {
    width: Platform.OS === "web" ? 250 : 200,
    height: Platform.OS === "web" ? 85 : 68,
    alignSelf: "center",
    marginBottom: 36,
    borderRadius: 8,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ff4444",
  },
  bottomSpacer: {
    height: 20,
  },
});