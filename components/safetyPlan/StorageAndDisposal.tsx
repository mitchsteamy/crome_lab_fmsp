import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "../common/ThemedText";
import { ThemedView } from "../common/ThemedView";
import SafetyPlanSection from "./SafetyPlanSection";
import { Medication } from "../../types/Medication";

interface StorageAndDisposalProps {
  medications: Medication[];
}

const groupMedicationsByPatient = (medications: Medication[]) => {
  const grouped = medications.reduce((acc, med) => {
    const patientName = med.patientName || "Unknown";
    if (!acc[patientName]) {
      acc[patientName] = [];
    }
    acc[patientName].push(med);
    return acc;
  }, {} as Record<string, Medication[]>);

  const sortedPatients = Object.keys(grouped).sort((a, b) => {
    if (a === "Myself") return -1;
    if (b === "Myself") return 1;
    return a.localeCompare(b);
  });

  return { grouped, sortedPatients };
};

export default function StorageAndDisposal({
  medications,
}: StorageAndDisposalProps) {
  const { grouped, sortedPatients } = groupMedicationsByPatient(medications);

  const renderStorageContent = () => {
    const hasStorage = medications.some(med => med.storage?.instructions);
    if (!hasStorage) return "No information yet.";

    return (
      <ThemedView style={styles.container} lightColor="transparent" darkColor="transparent">
        {sortedPatients.map((patientName, patientIndex) => {
          const patientMeds = grouped[patientName].filter(med => med.storage?.instructions);
          if (patientMeds.length === 0) return null;

          return (
            <ThemedView
              key={patientName}
              style={patientIndex > 0 ? styles.patientSpacing : undefined}
              lightColor="transparent"
              darkColor="transparent"
            >
              <ThemedText style={styles.patientName} lightColor="#f78b33" darkColor="#f78b33">
                {patientName}
              </ThemedText>
              {patientMeds.map((med) => (
                <ThemedView
                  key={med.id}
                  style={styles.medicationEntry}
                  lightColor="transparent"
                  darkColor="transparent"
                >
                  <ThemedText
                    style={styles.medicationEntryTitle}
                    lightColor="#333"
                    darkColor="#fff"
                  >
                    {med.brandName}:
                  </ThemedText>
                  <ThemedText
                    style={styles.medicationEntryContent}
                    lightColor="#666"
                    darkColor="#ccc"
                  >
                    {med.storage.instructions}
                  </ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          );
        })}
      </ThemedView>
    );
  };

  const renderDisposalContent = () => {
    const hasDisposal = medications.some(med => med.storage?.disposalInstructions);
    if (!hasDisposal) return "No information yet.";

    return (
      <ThemedView style={styles.container} lightColor="transparent" darkColor="transparent">
        {sortedPatients.map((patientName, patientIndex) => {
          const patientMeds = grouped[patientName].filter(med => med.storage?.disposalInstructions);
          if (patientMeds.length === 0) return null;

          return (
            <ThemedView
              key={patientName}
              style={patientIndex > 0 ? styles.patientSpacing : undefined}
              lightColor="transparent"
              darkColor="transparent"
            >
              <ThemedText style={styles.patientName} lightColor="#f78b33" darkColor="#f78b33">
                {patientName}
              </ThemedText>
              {patientMeds.map((med) => (
                <ThemedView
                  key={med.id}
                  style={styles.medicationEntry}
                  lightColor="transparent"
                  darkColor="transparent"
                >
                  <ThemedText
                    style={styles.medicationEntryTitle}
                    lightColor="#333"
                    darkColor="#fff"
                  >
                    {med.brandName}:
                  </ThemedText>
                  <ThemedText
                    style={styles.medicationEntryContent}
                    lightColor="#666"
                    darkColor="#ccc"
                  >
                    {med.storage.disposalInstructions}
                  </ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          );
        })}
      </ThemedView>
    );
  };

  const storageContent = renderStorageContent();
  const disposalContent = renderDisposalContent();

  return (
    <>
      <SafetyPlanSection
        title="How to Store"
        content={storageContent}
        isEmpty={typeof storageContent === 'string'}
      />

      <SafetyPlanSection
        title="How to Dispose"
        content={disposalContent}
        isEmpty={typeof disposalContent === 'string'}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  patientSpacing: {
    marginTop: 20,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  medicationEntry: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderLeftWidth: 3,
    borderLeftColor: "#f78b33",
  },
  medicationEntryTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
    color: "#f78b33",
  },
  medicationEntryContent: {
    fontSize: 14,
    lineHeight: 20,
  },
});