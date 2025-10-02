import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "../common/ThemedText";
import { ThemedView } from "../common/ThemedView";
import SafetyPlanSection from "./SafetyPlanSection";
import { Medication } from "../../types/Medication";

interface InteractionsSectionProps {
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

export default function InteractionsSection({
  medications,
}: InteractionsSectionProps) {
  const { grouped, sortedPatients } = groupMedicationsByPatient(medications);

  const renderDrugInteractionsContent = () => {
    const hasDrugInteractions = medications.some(med => med.drugInteractions);
    if (!hasDrugInteractions) return "No information yet.";

    return (
      <ThemedView style={styles.container} lightColor="transparent" darkColor="transparent">
        {sortedPatients.map((patientName, patientIndex) => {
          const patientMeds = grouped[patientName].filter(med => med.drugInteractions);
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
                    {med.drugInteractions}
                  </ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          );
        })}
      </ThemedView>
    );
  };

  const renderFoodInteractionsContent = () => {
    const hasFoodInteractions = medications.some(med => med.foodInteractions);
    if (!hasFoodInteractions) return "No information yet.";

    return (
      <ThemedView style={styles.container} lightColor="transparent" darkColor="transparent">
        {sortedPatients.map((patientName, patientIndex) => {
          const patientMeds = grouped[patientName].filter(med => med.foodInteractions);
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
                    {med.foodInteractions}
                  </ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          );
        })}
      </ThemedView>
    );
  };

  const drugInteractionsContent = renderDrugInteractionsContent();
  const foodInteractionsContent = renderFoodInteractionsContent();

  return (
    <>
      <SafetyPlanSection
        title="Interactions with Other Medicines"
        content={drugInteractionsContent}
        isEmpty={typeof drugInteractionsContent === 'string'}
      />

      <SafetyPlanSection
        title="Interactions with Food"
        content={foodInteractionsContent}
        isEmpty={typeof foodInteractionsContent === 'string'}
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