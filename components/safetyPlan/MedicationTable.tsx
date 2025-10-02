import React from "react";
import {
  StyleSheet,
  ScrollView,
  Platform,
  useWindowDimensions,
} from "react-native";
import { ThemedText } from "../common/ThemedText";
import { ThemedView } from "../common/ThemedView";
import SafetyPlanSection from "./SafetyPlanSection";
import { Medication } from "../../types/Medication";
import { FormatUtils } from "../../utils/formatUtils";
import { groupMedicationsByPatient } from "@/utils/groupByPatient";
interface MedicationTableProps {
  medications: Medication[];
}

export default function MedicationTable({ medications }: MedicationTableProps) {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  if (medications.length === 0) {
    return (
      <SafetyPlanSection
        title="Your Medicines"
        content="No medicines yet. Add your medicines to build your safety plan."
        isEmpty={true}
      />
    );
  }

  const { grouped, sortedPatients } = groupMedicationsByPatient(medications);

  const renderTableContent = () => (
    <ThemedView
      style={styles.container}
      lightColor="transparent"
      darkColor="transparent"
    >
      {sortedPatients.map((patientName, patientIndex) => (
        <ThemedView
          key={patientName}
          style={[
            styles.patientSection,
            patientIndex > 0 && styles.patientSectionSpacing,
          ]}
          lightColor="transparent"
          darkColor="transparent"
        >
          {/* Patient Name Header */}
          <ThemedView
            style={styles.patientHeader}
            lightColor="transparent"
            darkColor="transparent"
          >
            <ThemedText style={styles.patientHeaderText}>
              {patientName}
            </ThemedText>
          </ThemedView>

          {/* Medication Table for this patient */}
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
                Medicine
              </ThemedText>
              <ThemedText
                style={[styles.tableHeaderText, styles.reasonCol]}
                lightColor="#333"
                darkColor="#fff"
              >
                Why You Take It
              </ThemedText>
              <ThemedText
                style={[styles.tableHeaderText, styles.dosageCol]}
                lightColor="#333"
                darkColor="#fff"
              >
                How Much & How to Take
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
            {grouped[patientName].map((med: Medication, index: number) => (
              <ThemedView
                key={med.id}
                style={[
                  styles.tableRow,
                  index % 2 === 0 && styles.tableRowEven,
                  index === grouped[patientName].length - 1 &&
                    styles.tableRowLast,
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
                    {med.dosageStrength ? ` (${med.dosageStrength})` : ""}
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
                      {med.prescriptionType === "prescription"
                        ? "Prescription"
                        : "Over-the-Counter"}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>
      ))}
    </ThemedView>
  );

  const tableContent =
    Platform.OS === "web" && !isSmallScreen ? (
      renderTableContent()
    ) : (
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {renderTableContent()}
      </ScrollView>
    );

  return <SafetyPlanSection title="Your Medicines" content={tableContent} />;
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  patientSection: {},
  patientSectionSpacing: {
    marginTop: 24,
  },
  patientHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderColor: "#f78b33",
  },
  patientHeaderText: {
    color: "#f78b33",
    fontSize: 16,
    fontWeight: "600",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  medicationTable: {
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    ...(Platform.OS !== "web" && { minWidth: 700 }),
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
  tableRowEven: {},
  tableRowLast: {
    borderBottomWidth: 0,
  },
  medicationCol: {
    ...(Platform.OS === "web" ? { flex: 3 } : { width: 200 }),
    paddingRight: 12,
  },
  reasonCol: {
    ...(Platform.OS === "web" ? { flex: 2 } : { width: 160 }),
    paddingRight: 12,
  },
  dosageCol: {
    ...(Platform.OS === "web" ? { flex: 2 } : { width: 180 }),
    paddingRight: 12,
  },
  typeCol: {
    ...(Platform.OS === "web" ? { flex: 1 } : { width: 140 }),
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
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
});
