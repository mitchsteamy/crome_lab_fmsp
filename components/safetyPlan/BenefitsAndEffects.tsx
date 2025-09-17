import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "../common/ThemedText";
import { ThemedView } from "../common/ThemedView";
import SafetyPlanSection from "./SafetyPlanSection";
import { Medication } from "../../types/Medication";

interface BenefitsAndEffectsProps {
  medications: Medication[];
}

export default function BenefitsAndEffects({
  medications,
}: BenefitsAndEffectsProps) {
  const benefitsContent = medications
    .filter((med) => med.benefits)
    .map((med) => (
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
    ));

  const sideEffectsContent = medications
    .filter((med) => med.sideEffects)
    .map((med) => (
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
    ));

  return (
    <>
      <SafetyPlanSection
        title="Benefits"
        content={
          benefitsContent.length > 0
            ? benefitsContent
            : "No benefits information recorded."
        }
        isEmpty={benefitsContent.length === 0}
      />

      <SafetyPlanSection
        title="Potential Side Effects"
        content={
          sideEffectsContent.length > 0
            ? sideEffectsContent
            : "No side effects information recorded."
        }
        isEmpty={sideEffectsContent.length === 0}
      />
    </>
  );
}

const styles = StyleSheet.create({
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
