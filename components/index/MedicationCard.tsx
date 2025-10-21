import React from "react";
import { StyleSheet, TouchableOpacity, Alert, Platform } from "react-native";
import { ThemedText } from "@/components/common/ThemedText";
import { ThemedView } from "@/components/common/ThemedView";
import { Medication } from "../../types/Medication";
import { FormatUtils } from "../../utils/formatUtils";
import { DateUtils } from "../../utils/dateUtils";

interface MedicationCardProps {
  medication: Medication;
  onPress: () => void;
  onDelete: () => void;
}

export default function MedicationCard({
  medication,
  onPress,
  onDelete,
}: MedicationCardProps) {
  const handleLongPress = () => {
    if (Platform.OS === "web") {
      const action = window.confirm(
        `${medication.brandName}\n\nChoose an action:\n- Click OK to view details\n- Click Cancel for more options`
      );
      if (action) {
        onPress();
      }
    } else {
      Alert.alert(medication.brandName, "What would you like to do?", [
        { text: "Cancel", style: "cancel" },
        { text: "View Details", onPress },
        { text: "Delete", style: "destructive", onPress: onDelete },
      ]);
    }
  };

  const getStatusColor = () => {
    if (!medication.isActive) return "#999";
    if (medication.isExpired) return "#ff4444";
    if (
      medication.storage?.expirationDate &&
      DateUtils.isExpiringSoon(medication.storage.expirationDate)
    ) {
      return "#ff9900";
    }
    return "#4CAF50";
  };

  const getStatusText = () => {
    if (!medication.isActive) return "Past";
    if (medication.isExpired) return "Expired";
    if (
      medication.storage?.expirationDate &&
      DateUtils.isExpiringSoon(medication.storage.expirationDate)
    ) {
      return "Expires Soon";
    }
    return "Current";
  };

  const formatSchedulePreview = () => {
    if (medication.schedule?.isAsNeeded) {
      return "When needed";
    }

    if (
      medication.schedule?.frequency === "every day" &&
      medication.schedule?.doseTimes
    ) {
      const timesCount = medication.schedule.doseTimes.length;
      return `${timesCount} time${timesCount !== 1 ? "s" : ""} a day`;
    }

    return FormatUtils.formatScheduleFrequency(
      medication.schedule?.frequency || "every day"
    );
  };

  const getPrescriptionTypeColor = () => {
    return medication.prescriptionType === "prescription"
      ? "#f78b33"
      : "#061336";
  };

  const getPrescriptionTypeText = () => {
    return medication.prescriptionType === "prescription"
      ? "Prescription"
      : "Over-the-Counter";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
    >
      <ThemedView style={styles.card} lightColor="#fff" darkColor="#2a2a2a">
        <ThemedView style={styles.header} lightColor="#fff" darkColor="#2a2a2a">
          <ThemedView
            style={styles.medicationInfo}
            lightColor="#fff"
            darkColor="#2a2a2a"
          >
            <ThemedView
              style={styles.titleRow}
              lightColor="#fff"
              darkColor="#2a2a2a"
            >
              <ThemedText
                type="subtitle"
                numberOfLines={1}
                style={styles.brandName}
              >
                {medication.brandName}
              </ThemedText>
              <ThemedView
                style={[
                  styles.prescriptionBadge,
                  { backgroundColor: getPrescriptionTypeColor() },
                ]}
              >
                <ThemedText style={styles.prescriptionText}>
                  {getPrescriptionTypeText()}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            {medication.genericName &&
              medication.genericName !== medication.brandName && (
                <ThemedText
                  type="default"
                  lightColor="#666"
                  darkColor="#ccc"
                  style={styles.genericName}
                  numberOfLines={1}
                >
                  {medication.genericName}
                </ThemedText>
              )}
          </ThemedView>

          <ThemedView
            style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
          >
            <ThemedText style={styles.statusText}>{getStatusText()}</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView
          style={styles.dosageRow}
          lightColor="#fff"
          darkColor="#2a2a2a"
        >
          <ThemedText
            type="defaultSemiBold"
            style={[styles.dosage, { color: "#f78b33" }]}
          >
            {FormatUtils.formatDosage(
              medication.dosageAmount,
              medication.dosageUnit
            )}
            {medication.dosageStrength ? ` (${medication.dosageStrength})` : ""}
          </ThemedText>
          <ThemedText type="default" style={styles.separator}>
            •
          </ThemedText>
          <ThemedText type="default" lightColor="#666" darkColor="#ccc">
            {FormatUtils.formatAdministrationMethod(
              medication.administrationMethod
            )}
          </ThemedText>
        </ThemedView>

        <ThemedView
          style={styles.scheduleRow}
          lightColor="#fff"
          darkColor="#2a2a2a"
        >
          <ThemedText type="defaultSemiBold">
            {formatSchedulePreview()}
          </ThemedText>
          {medication.patientName && (
            <>
              <ThemedText type="default" style={styles.separator}>
                •
              </ThemedText>
              <ThemedText type="default" lightColor="#666" darkColor="#ccc">
                {medication.patientName}
              </ThemedText>
            </>
          )}
        </ThemedView>

        {medication.reasonForUse && (
          <ThemedText
            type="default"
            lightColor="#666"
            darkColor="#ccc"
            style={styles.reason}
            numberOfLines={2}
          >
            Why: {medication.reasonForUse}
          </ThemedText>
        )}

        {medication.benefits && (
          <ThemedView
            style={styles.benefitsContainer}
            lightColor="#fff"
            darkColor="#2a2a2a"
          >
            <ThemedText type="default" style={styles.benefitsLabel}>
              What it does:
            </ThemedText>
            <ThemedText
              type="default"
              lightColor="#666"
              darkColor="#ccc"
              style={styles.benefits}
              numberOfLines={2}
            >
              {medication.benefits}
            </ThemedText>
          </ThemedView>
        )}

        <ThemedView style={styles.footer} lightColor="#fff" darkColor="#2a2a2a">
          <ThemedText
            type="default"
            lightColor="#999"
            darkColor="#888"
            style={styles.footerText}
          >
            Last updated {DateUtils.getRelativeTime(medication.updatedAt)}
          </ThemedText>

          {medication.schedule?.doseTimes &&
            medication.schedule.doseTimes.length > 0 && (
              <ThemedText
                type="default"
                style={[styles.nextDose, { color: "#f78b33" }]}
              >
                Next dose:{" "}
                {FormatUtils.formatTime(
                  medication.schedule.doseTimes[0].hour,
                  medication.schedule.doseTimes[0].minute
                )}
              </ThemedText>
            )}
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#f78b33",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  medicationInfo: {
    flex: 1,
    marginRight: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  brandName: {
    flex: 1,
    marginRight: 8,
  },
  prescriptionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 8,
  },
  prescriptionText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  genericName: {
    fontStyle: "italic",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  dosageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  dosage: {
    fontWeight: "700",
  },
  separator: {
    marginHorizontal: 8,
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  reason: {
    lineHeight: 20,
    marginBottom: 8,
  },
  benefitsContainer: {
    marginBottom: 8,
  },
  benefitsLabel: {
    fontWeight: "600",
    marginBottom: 2,
  },
  benefits: {
    lineHeight: 18,
    fontSize: 13,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  footerText: {
    fontSize: 12,
  },
  nextDose: {
    fontSize: 12,
    fontWeight: "500",
  },
});
