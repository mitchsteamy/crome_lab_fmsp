import { ThemedText } from "@/components/common/ThemedText";
import { ThemedView } from "@/components/common/ThemedView";
import React from "react";
import { StyleSheet } from "react-native";

interface DetailRow {
  label: string;
  value: string | undefined;
  important?: boolean;
}

interface MedicationInfoSectionProps {
  title: string;
  details: DetailRow[];
}

export default function MedicationInfoSection({
  title,
  details,
}: MedicationInfoSectionProps) {
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

  // Filter out rows with no value
  const visibleDetails = details.filter((detail) => detail.value);
  if (visibleDetails.length === 0) return null;

  return (
    <ThemedView style={styles.section} lightColor="#fff" darkColor="#2a2a2a">
      <ThemedText
        type="subtitle"
        style={styles.sectionTitle}
        lightColor="#333"
        darkColor="#fff"
      >
        {title}
      </ThemedText>
      <ThemedView
        style={styles.sectionContent}
        lightColor="transparent"
        darkColor="transparent"
      >
        {details.map((detail) =>
          renderDetailRow(detail.label, detail.value, detail.important)
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