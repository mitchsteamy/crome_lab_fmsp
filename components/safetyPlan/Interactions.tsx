import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "../common/ThemedText";
import { ThemedView } from "../common/ThemedView";
import SafetyPlanSection from "./SafetyPlanSection";
import { Medication } from "../../types/Medication";

interface InteractionsSectionProps {
  medications: Medication[];
}

export default function InteractionsSection({
  medications,
}: InteractionsSectionProps) {
  const drugInteractionsContent = medications
    .filter((med) => med.drugInteractions)
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
          {med.drugInteractions}
        </ThemedText>
      </ThemedView>
    ));

  const foodInteractionsContent = medications
    .filter((med) => med.foodInteractions)
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
          {med.foodInteractions}
        </ThemedText>
      </ThemedView>
    ));

  return (
    <>
      <SafetyPlanSection
        title="Drug-Drug Interactions"
        content={
          drugInteractionsContent.length > 0
            ? drugInteractionsContent
            : "No drug interactions recorded."
        }
        isEmpty={drugInteractionsContent.length === 0}
      />

      <SafetyPlanSection
        title="Food-Drug Interactions"
        content={
          foodInteractionsContent.length > 0
            ? foodInteractionsContent
            : "No food interactions recorded."
        }
        isEmpty={foodInteractionsContent.length === 0}
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
