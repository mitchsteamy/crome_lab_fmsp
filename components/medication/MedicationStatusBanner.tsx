import { ThemedText } from "@/components/common/ThemedText";
import { ThemedView } from "@/components/common/ThemedView";
import { Medication } from "@/types/Medication";
import { DateUtils } from "@/utils/dateUtils";
import React from "react";
import { StyleSheet } from "react-native";

interface MedicationStatusBannerProps {
  medication: Medication;
}

export default function MedicationStatusBanner({
  medication,
}: MedicationStatusBannerProps) {
  const getStatusColor = () => {
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
    if (!medication.isActive) return "Past";
    if (medication.isExpired) return "Expired";
    if (
      medication?.storage?.expirationDate &&
      DateUtils.isExpiringSoon(medication.storage.expirationDate)
    ) {
      return "Expires Soon";
    }
    return "Current";
  };

  return (
    <ThemedView
      style={[styles.statusBanner, { backgroundColor: getStatusColor() }]}
    >
      <ThemedText type="defaultSemiBold" style={styles.statusText}>
        {getStatusText()}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  statusBanner: {
    marginTop: 8,
    paddingVertical: 2,
    marginHorizontal: 20,
    alignItems: "center",
    borderRadius: 8,
  },
  statusText: {
    color: "#e0e0e0",
  },
});