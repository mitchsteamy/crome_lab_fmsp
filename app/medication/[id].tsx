import { ThemedText } from "@/components/common/ThemedText";
import { ThemedView } from "@/components/common/ThemedView";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
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
    // For now, show that editing will be available later
    if (Platform.OS === "web") {
      alert(
        "Edit functionality will be available in the next update when we add editing to the question engine."
      );
    } else {
      Alert.alert(
        "Edit Medication",
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

  const getStatusColor = () => {
    if (!medication) return "#999";
    if (!medication.isActive) return "#999";
    if (medication.isExpired) return "#D54C4C";
    if (
      medication?.storage?.expirationDate &&
      DateUtils.isExpiringSoon(medication.storage.expirationDate)
    ) {
      return "#ff9900";
    }
    return "#4CAF50";
  };

  const getStatusText = () => {
    if (!medication) return "Unknown";
    if (!medication.isActive) return "Inactive";
    if (medication.isExpired) return "Expired";
    if (
      medication?.storage?.expirationDate &&
      DateUtils.isExpiringSoon(medication.storage.expirationDate)
    ) {
      return "Expiring Soon";
    }
    return "Active";
  };

  const renderDetailRow = (
    label: string,
    value: string | undefined,
    important: boolean = false
  ) => {
    if (!value) return null;

    return (
      <ThemedView
        style={styles.detailRow}
        lightColor="transparent"
        darkColor="transparent"
      >
        <ThemedText
          type="defaultSemiBold"
          lightColor="#666"
          darkColor="#ccc"
          style={styles.detailLabel}
        >
          {label}:
        </ThemedText>
        <ThemedText
          type="default"
          style={[styles.detailValue, important && styles.importantValue]}
          lightColor="#333"
          darkColor="#e0e0e0"
        >
          {value}
        </ThemedText>
      </ThemedView>
    );
  };

  const renderScheduleDetails = () => {
    if (!medication?.schedule) return null;

    return (
      <ThemedView style={styles.section} lightColor="#fff" darkColor="#2a2a2a">
        <ThemedText
          type="subtitle"
          style={styles.sectionTitle}
          lightColor="#333"
          darkColor="#fff"
        >
          Schedule
        </ThemedText>
        <ThemedView
          style={styles.sectionContent}
          lightColor="transparent"
          darkColor="transparent"
        >
          {renderDetailRow(
            "Frequency",
            FormatUtils.formatScheduleFrequency(medication.schedule.frequency)
          )}
          {medication.schedule.doseTimes &&
            medication.schedule.doseTimes.length > 0 &&
            renderDetailRow(
              "Times",
              FormatUtils.formatDoseTimes(medication.schedule.doseTimes)
            )}
          {medication.schedule.daysOfWeek &&
            renderDetailRow(
              "Days",
              FormatUtils.formatDaysOfWeek(medication.schedule.daysOfWeek)
            )}
          {renderDetailRow(
            "As needed",
            medication.schedule.isAsNeeded ? "Yes" : "No"
          )}
        </ThemedView>
      </ThemedView>
    );
  };

  if (loading) {
    return (
      <ThemedView
        style={styles.container}
        lightColor="#f5f5f5"
        darkColor="#1f1f1f"
      >
        <SafeAreaView style={styles.safeArea}>
          <ThemedView
            style={styles.header}
            lightColor="#fff"
            darkColor="#1f1f1f"
          >
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <ThemedText type="link">← Back</ThemedText>
            </TouchableOpacity>
            <ThemedText type="subtitle">Loading...</ThemedText>
            <ThemedView
              style={styles.headerSpacer}
              lightColor="transparent"
              darkColor="transparent"
            />
          </ThemedView>
          <ThemedView
            style={styles.loadingContainer}
            lightColor="transparent"
            darkColor="transparent"
          >
            <ThemedText type="default" lightColor="#666" darkColor="#999">
              Loading medication details...
            </ThemedText>
          </ThemedView>
        </SafeAreaView>
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
        <SafeAreaView style={styles.safeArea}>
          <ThemedView
            style={styles.header}
            lightColor="#fff"
            darkColor="#1f1f1f"
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ThemedText type="link">← Back</ThemedText>
            </TouchableOpacity>
            <ThemedText type="subtitle">Not Found</ThemedText>
            <ThemedView
              style={styles.headerSpacer}
              lightColor="transparent"
              darkColor="transparent"
            />
          </ThemedView>
          <ThemedView
            style={styles.errorContainer}
            lightColor="transparent"
            darkColor="transparent"
          >
            <ThemedText type="default" style={styles.errorText}>
              Medication not found
            </ThemedText>
          </ThemedView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={styles.container}
      lightColor="#f5f5f5"
      darkColor="#1f1f1f"
    >
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.header} lightColor="#fff" darkColor="#1f1f1f">
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ThemedText type="link">← Back</ThemedText>
          </TouchableOpacity>
          <ThemedText type="subtitle" numberOfLines={1}>
            {medication.brandName}
          </ThemedText>
          <ThemedView
            style={styles.headerSpacer}
            lightColor="transparent"
            darkColor="transparent"
          />
        </ThemedView>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Status Banner */}
          <ThemedView
            style={[styles.statusBanner, { borderColor: getStatusColor() }]}
          >
            <ThemedText
              type="defaultSemiBold"
              style={[styles.statusText, { color: getStatusColor() }]}
            >
              {getStatusText()}
            </ThemedText>
          </ThemedView>

          {/* Basic Information */}
          <ThemedView
            style={styles.section}
            lightColor="#fff"
            darkColor="#2a2a2a"
          >
            <ThemedText
              type="subtitle"
              style={styles.sectionTitle}
              lightColor="#333"
              darkColor="#fff"
            >
              Basic Information
            </ThemedText>
            <ThemedView
              style={styles.sectionContent}
              lightColor="transparent"
              darkColor="transparent"
            >
              {renderDetailRow("Brand Name", medication.brandName, true)}
              {renderDetailRow("Generic Name", medication.genericName)}
              {renderDetailRow("Reason for Use", medication.reasonForUse, true)}
              {renderDetailRow(
                "Type",
                FormatUtils.formatPrescriptionType(medication.prescriptionType)
              )}
            </ThemedView>
          </ThemedView>

          {/* Dosage & Administration */}
          <ThemedView
            style={styles.section}
            lightColor="#fff"
            darkColor="#2a2a2a"
          >
            <ThemedText
              type="subtitle"
              style={styles.sectionTitle}
              lightColor="#333"
              darkColor="#fff"
            >
              Dosage & Administration
            </ThemedText>
            <ThemedView
              style={styles.sectionContent}
              lightColor="transparent"
              darkColor="transparent"
            >
              {renderDetailRow(
                "Dosage",
                FormatUtils.formatDosage(
                  medication.dosageAmount,
                  medication.dosageUnit
                ),
                true
              )}
              {renderDetailRow(
                "Administration",
                FormatUtils.formatAdministrationMethod(
                  medication.administrationMethod
                )
              )}
              {renderDetailRow(
                "Food Requirements",
                FormatUtils.formatFoodRequirement(medication.foodRequirement)
              )}
            </ThemedView>
          </ThemedView>

          {/* Schedule */}
          {renderScheduleDetails()}

          {/* Duration */}
          <ThemedView
            style={styles.section}
            lightColor="#fff"
            darkColor="#2a2a2a"
          >
            <ThemedText
              type="subtitle"
              style={styles.sectionTitle}
              lightColor="#333"
              darkColor="#fff"
            >
              Duration
            </ThemedText>
            <ThemedView
              style={styles.sectionContent}
              lightColor="transparent"
              darkColor="transparent"
            >
              {renderDetailRow(
                "Start Date",
                DateUtils.formatDate(medication.startDate, "long")
              )}
              {renderDetailRow(
                "End Date",
                medication.endDate
                  ? DateUtils.formatDate(medication.endDate, "long")
                  : "Ongoing"
              )}
              {renderDetailRow(
                "Expiration Date",
                medication?.storage?.expirationDate
                  ? DateUtils.formatDate(
                      medication.storage.expirationDate,
                      "long"
                    )
                  : "Not specified"
              )}
            </ThemedView>
          </ThemedView>

          {/* Safety Information - Only show if there's content */}
          {(medication.benefits ||
            medication.sideEffects ||
            medication.drugInteractions ||
            medication.foodInteractions) && (
            <ThemedView
              style={styles.section}
              lightColor="#fff"
              darkColor="#2a2a2a"
            >
              <ThemedText
                type="subtitle"
                style={styles.sectionTitle}
                lightColor="#333"
                darkColor="#fff"
              >
                Safety Information
              </ThemedText>
              <ThemedView
                style={styles.sectionContent}
                lightColor="transparent"
                darkColor="transparent"
              >
                {renderDetailRow("Benefits", medication.benefits)}
                {renderDetailRow("Side Effects", medication.sideEffects)}
                {renderDetailRow(
                  "Drug Interactions",
                  medication.drugInteractions
                )}
                {renderDetailRow(
                  "Food Interactions",
                  medication.foodInteractions
                )}
              </ThemedView>
            </ThemedView>
          )}

          {/* Storage & Disposal - Only show if there's content */}
          {(medication?.storage?.expirationDate ||
            medication?.storage?.disposalInstructions) && (
            <ThemedView
              style={styles.section}
              lightColor="#fff"
              darkColor="#2a2a2a"
            >
              <ThemedText
                type="subtitle"
                style={styles.sectionTitle}
                lightColor="#333"
                darkColor="#fff"
              >
                Storage & Disposal
              </ThemedText>
              <ThemedView
                style={styles.sectionContent}
                lightColor="transparent"
                darkColor="transparent"
              >
                {renderDetailRow(
                  "Storage Instructions",
                  medication.storage.instructions
                )}
                {renderDetailRow(
                  "Disposal Method",
                  medication.storage.disposalInstructions
                )}
              </ThemedView>
            </ThemedView>
          )}

          {/* Metadata */}
          <ThemedView
            style={styles.section}
            lightColor="#fff"
            darkColor="#2a2a2a"
          >
            <ThemedText
              type="subtitle"
              style={styles.sectionTitle}
              lightColor="#333"
              darkColor="#fff"
            >
              Record Information
            </ThemedText>
            <ThemedView
              style={styles.sectionContent}
              lightColor="transparent"
              darkColor="transparent"
            >
              {renderDetailRow(
                "Added",
                DateUtils.formatDate(medication.createdAt, "datetime")
              )}
              {renderDetailRow(
                "Last Updated",
                DateUtils.formatDate(medication.updatedAt, "datetime")
              )}
            </ThemedView>
          </ThemedView>

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
        <ThemedView
          style={styles.actionButtons}
          lightColor="#fff"
          darkColor="#1f1f1f"
        >
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <ThemedText type="defaultSemiBold" style={styles.deleteButtonText}>
              Delete Medication
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <ThemedText type="defaultSemiBold" style={styles.editButtonText}>
              Edit Medication
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Delete Confirmation Modals */}
        <ConfirmDeleteModal
          visible={showDeleteModal}
          title="Delete Medication"
          message={`Are you sure you want to delete "${medication?.brandName}"?\n\nThis will permanently remove this medication from your safety plan and cannot be undone.`}
          onConfirm={handleFirstConfirm}
          onCancel={handleCancel}
        />

        <ConfirmDeleteModal
          visible={showSecondConfirm}
          title="Confirm Deletion"
          message={`This will permanently delete "${medication?.brandName}" from your medication list.`}
          confirmText="Yes, Delete"
          onConfirm={handleSecondConfirm}
          onCancel={handleCancel}
        />
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
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    minWidth: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginTop: Platform.OS === "web" ? 0 : 48,
  },

  headerSpacer: {
    minWidth: 0,
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
  statusBanner: {
    marginTop: 8,
    paddingVertical: 2,
    marginHorizontal: 20,
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  statusText: {},
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    padding: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  sectionContent: {
    padding: 16,
    paddingTop: 8,
  },
  detailRow: {
    marginBottom: 12,
  },
  detailLabel: {
    marginBottom: 4,
  },
  detailValue: {
    lineHeight: 22,
  },
  importantValue: {
    fontWeight: "600",
    color: "#f78b33",
  },
  bottomSpacer: {
    height: 20,
  },
  actionButtons: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: Platform.OS === "web" ? 0 : 36,
  },
  editButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#f78b33",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  editButtonText: {
    fontWeight: "600",
    color: "#f78b33",
  },
  deleteButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D54C4C",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#D54C4C",
    fontWeight: "600",
  },
});
