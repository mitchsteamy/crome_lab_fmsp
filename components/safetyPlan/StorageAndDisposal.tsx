import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "../common/ThemedText";
import { ThemedView } from "../common/ThemedView";
import SafetyPlanSection from "./SafetyPlanSection";
import { Medication } from "../../types/Medication";

interface StorageAndDisposalProps {
  medications: Medication[];
}

export default function StorageAndDisposal({ medications }: StorageAndDisposalProps) {
  const storageContent = medications
    .filter((med) => med.storage.instructions)
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
          {med.storage.instructions}
        </ThemedText>
      </ThemedView>
    ));

  const disposalContent = medications
    .filter((med) => med.storage.disposalInstructions)
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
          {med.storage.disposalInstructions}
        </ThemedText>
      </ThemedView>
    ));

  return (
    <>
      <SafetyPlanSection
        title="Storage Instructions"
        content={
          storageContent.length > 0
            ? storageContent
            : "No storage instructions recorded."
        }
        isEmpty={storageContent.length === 0}
      />

      <SafetyPlanSection
        title="Proper Disposal"
        content={
          disposalContent.length > 0
            ? disposalContent
            : "No disposal instructions recorded."
        }
        isEmpty={disposalContent.length === 0}
      />
    </>
  );
}

const styles = StyleSheet.create({
  medicationEntry: {
    marginBottom: 16,
  },
  medicationEntryTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  medicationEntryContent: {
    fontSize: 14,
    lineHeight: 20,
  },
});