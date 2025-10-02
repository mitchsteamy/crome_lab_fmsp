import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "../common/ThemedText";
import { ThemedView } from "../common/ThemedView";
import SafetyPlanSection from "./SafetyPlanSection";
import { Medication } from "../../types/Medication";
import { groupMedicationsByPatient } from "../../utils/groupByPatient";

interface BenefitsAndEffectsProps {
  medications: Medication[];
}

export default function BenefitsAndEffects({
  medications,
}: BenefitsAndEffectsProps) {
  const { grouped, sortedPatients } = groupMedicationsByPatient(medications);

  const renderBenefitsContent = () => {
    const hasBenefits = medications.some(med => med.benefits);
    if (!hasBenefits) return "No information yet.";

    return (
      <ThemedView style={styles.container} lightColor="transparent" darkColor="transparent">
        {sortedPatients.map((patientName, patientIndex) => {
            const patientMeds: Medication[] = grouped[patientName].filter((med: Medication) => med.benefits);
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
                    {med.benefits}
                  </ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          );
        })}
      </ThemedView>
    );
  };

  const renderSideEffectsContent = () => {
    const hasSideEffects = medications.some(med => med.sideEffects);
    if (!hasSideEffects) return "No information yet.";

    return (
      <ThemedView style={styles.container} lightColor="transparent" darkColor="transparent">
        {sortedPatients.map((patientName, patientIndex) => {
            const patientMeds: Medication[] = grouped[patientName].filter((med: Medication) => med.sideEffects);
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
                    {med.sideEffects}
                  </ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          );
        })}
      </ThemedView>
    );
  };

  const benefitsContent = renderBenefitsContent();
  const sideEffectsContent = renderSideEffectsContent();

  return (
    <>
      <SafetyPlanSection
        title="What Your Medicines Do"
        content={benefitsContent}
        isEmpty={typeof benefitsContent === 'string'}
      />

      <SafetyPlanSection
        title="Side Effects"
        content={sideEffectsContent}
        isEmpty={typeof sideEffectsContent === 'string'}
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