import React from "react";
import { StyleSheet, ScrollView, Platform } from "react-native";
import { ThemedText } from "../common/ThemedText";
import { ThemedView } from "../common/ThemedView";
import SafetyPlanSection from "./SafetyPlanSection";
import { Medication } from "../../types/Medication";
import { FormatUtils } from "../../utils/formatUtils";

interface MedicationTableProps {
  medications: Medication[];
}

export default function MedicationTable({ medications }: MedicationTableProps) {
  if (medications.length === 0) {
    return (
      <SafetyPlanSection
        title="Medication Information"
        content="No active medications found. Add medications to build your safety plan."
        isEmpty={true}
      />
    );
  }

  const renderTableContent = () => (
    <ThemedView
      style={styles.medicationTable}
      lightColor="transparent"
      darkColor="transparent"
    >
      {/* Table Header */}
      <ThemedView
        style={styles.tableHeader}
        lightColor="#f8f9fa"
        darkColor="#404040"
      >
        <ThemedText
          style={[styles.tableHeaderText, styles.medicationCol]}
          lightColor="#333"
          darkColor="#fff"
        >
          Medication
        </ThemedText>
        <ThemedText
          style={[styles.tableHeaderText, styles.reasonCol]}
          lightColor="#333"
          darkColor="#fff"
        >
          Reason for Use
        </ThemedText>
        <ThemedText
          style={[styles.tableHeaderText, styles.dosageCol]}
          lightColor="#333"
          darkColor="#fff"
        >
          Dosage & How to Take
        </ThemedText>
        <ThemedText
          style={[styles.tableHeaderText, styles.typeCol]}
          lightColor="#333"
          darkColor="#fff"
        >
          Type
        </ThemedText>
      </ThemedView>

      {/* Table Rows */}
      {medications.map((med, index) => (
        <ThemedView
          key={med.id}
          style={[
            styles.tableRow,
            index % 2 === 0 && styles.tableRowEven,
            index === medications.length - 1 && styles.tableRowLast,
          ]}
          lightColor={index % 2 === 0 ? "#fafafa" : "#fff"}
          darkColor={index % 2 === 0 ? "#333" : "#2a2a2a"}
        >
          <ThemedView
            style={styles.medicationCol}
            lightColor="transparent"
            darkColor="transparent"
          >
            <ThemedText
              style={styles.medicationName}
              lightColor="#333"
              darkColor="#fff"
            >
              {med.brandName}
            </ThemedText>
            {med.genericName && med.genericName !== med.brandName && (
              <ThemedText
                style={styles.genericName}
                lightColor="#666"
                darkColor="#ccc"
              >
                ({med.genericName})
              </ThemedText>
            )}
            <ThemedText style={styles.patientName}>
              For: {med.patientName}
            </ThemedText>
          </ThemedView>

          <ThemedView
            style={styles.reasonCol}
            lightColor="transparent"
            darkColor="transparent"
          >
            <ThemedText
              style={styles.cellText}
              lightColor="#333"
              darkColor="#e0e0e0"
            >
              {med.reasonForUse}
            </ThemedText>
          </ThemedView>

          <ThemedView
            style={styles.dosageCol}
            lightColor="transparent"
            darkColor="transparent"
          >
            <ThemedText
              style={styles.dosageText}
              lightColor="#333"
              darkColor="#fff"
            >
              {FormatUtils.formatDosage(med.dosageAmount, med.dosageUnit)}
            </ThemedText>
            <ThemedText
              style={styles.methodText}
              lightColor="#666"
              darkColor="#ccc"
            >
              {FormatUtils.formatAdministrationMethod(
                med.administrationMethod
              )}
            </ThemedText>
            <ThemedText
              style={styles.foodText}
              lightColor="#999"
              darkColor="#888"
            >
              {FormatUtils.formatFoodRequirement(med.foodRequirement)}
            </ThemedText>
          </ThemedView>

          <ThemedView
            style={styles.typeCol}
            lightColor="transparent"
            darkColor="transparent"
          >
            <ThemedView
              style={styles.typeBadge}
              lightColor="#f0f0f0"
              darkColor="#555"
            >
              <ThemedText
                style={styles.typeText}
                lightColor="#666"
                darkColor="#ccc"
              >
                {med.prescriptionType === "prescription" ? "Rx" : "OTC"}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      ))}
    </ThemedView>
  );

  const tableContent = Platform.OS === 'web' ? (
    // Web: Direct rendering, no scroll
    renderTableContent()
  ) : (
    // Mobile: Wrapped in horizontal scroll
    <ScrollView 
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
    >
      {renderTableContent()}
    </ScrollView>
  );

  return (
    <SafetyPlanSection
      title="Medication Information"
      content={tableContent}
    />
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  medicationTable: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    ...(Platform.OS !== 'web' && { minWidth: 600 }),
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: "600",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tableRowEven: {
    // Background color handled by ThemedView
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  medicationCol: {
    ...(Platform.OS === 'web' ? { flex: 3 } : { width: 180 }),
    paddingRight: 12,
  },
  reasonCol: {
    ...(Platform.OS === 'web' ? { flex: 2 } : { width: 160 }),
    paddingRight: 12,
  },
  dosageCol: {
    ...(Platform.OS === 'web' ? { flex: 2 } : { width: 180 }),
    paddingRight: 12,
  },
  typeCol: {
    ...(Platform.OS === 'web' ? { flex: 1 } : { width: 80 }),
    alignItems: "center",
    justifyContent: "center",
  },
  medicationName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  genericName: {
    fontSize: 13,
    fontStyle: "italic",
    marginBottom: 4,
  },
  patientName: {
    fontSize: 12,
    color: "#f78b33",
    fontWeight: "500",
  },
  cellText: {
    fontSize: 14,
    lineHeight: 20,
  },
  dosageText: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  methodText: {
    fontSize: 13,
    marginBottom: 2,
  },
  foodText: {
    fontSize: 12,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
  },
});