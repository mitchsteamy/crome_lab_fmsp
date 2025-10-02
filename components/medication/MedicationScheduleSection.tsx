import { ThemedText } from "@/components/common/ThemedText";
import { ThemedView } from "@/components/common/ThemedView";
import { Medication } from "@/types/Medication";
import { FormatUtils } from "@/utils/formatUtils";
import React from "react";
import { StyleSheet } from "react-native";

interface MedicationScheduleSectionProps {
  medication: Medication;
}

export default function MedicationScheduleSection({
  medication,
}: MedicationScheduleSectionProps) {
  if (!medication?.schedule) return null;

  const renderDetailRow = (
    label: string,
    value: string | undefined,
    important: boolean = false
  ) => {
    if (!value) return null;

    return (
      <ThemedView
        key={label}
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

  return (
    <ThemedView style={styles.section} lightColor="#fff" darkColor="#2a2a2a">
      <ThemedText
        type="subtitle"
        style={styles.sectionTitle}
        lightColor="#333"
        darkColor="#fff"
      >
        When You Take It
      </ThemedText>
      <ThemedView
        style={styles.sectionContent}
        lightColor="transparent"
        darkColor="transparent"
      >
        {renderDetailRow(
          "How often",
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
          "When needed",
          medication.schedule.isAsNeeded ? "Yes" : "No"
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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
});