import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "../common/ThemedText";
import { ThemedView } from "../common/ThemedView";
import SafetyPlanSection from "./SafetyPlanSection";
import { Medication } from "../../types/Medication";

interface CommunicationSectionProps {
  medications: Medication[];
}

export default function CommunicationSection({ medications }: CommunicationSectionProps) {
  const communicationContent = (
    <ThemedView
      style={styles.communicationSection}
      lightColor="transparent"
      darkColor="transparent"
    >
      <ThemedView
        style={styles.contactInfo}
        lightColor="transparent"
        darkColor="transparent"
      >
        <ThemedText
          style={styles.contactTitle}
          lightColor="#333"
          darkColor="#fff"
        >
          Emergency Contacts
        </ThemedText>
        <ThemedView
          style={styles.contactGrid}
          lightColor="transparent"
          darkColor="transparent"
        >
          <ThemedView
            style={styles.contactItem}
            lightColor="transparent"
            darkColor="transparent"
          >
            <ThemedText
              style={styles.contactLabel}
              lightColor="#333"
              darkColor="#e0e0e0"
            >
              Poison Control
            </ThemedText>
            <ThemedText style={styles.contactValue}>
              1-800-222-1222
            </ThemedText>
          </ThemedView>
          <ThemedView
            style={styles.contactItem}
            lightColor="transparent"
            darkColor="transparent"
          >
            <ThemedText
              style={styles.contactLabel}
              lightColor="#333"
              darkColor="#e0e0e0"
            >
              Emergency Services
            </ThemedText>
            <ThemedText style={styles.contactValue}>911</ThemedText>
          </ThemedView>
          <ThemedView
            style={styles.contactItem}
            lightColor="transparent"
            darkColor="transparent"
          >
            <ThemedText
              style={styles.contactLabel}
              lightColor="#333"
              darkColor="#e0e0e0"
            >
              Point of Contact
            </ThemedText>
            <ThemedText
              style={styles.contactPlaceholder}
              lightColor="#ccc"
              darkColor="#666"
            >
              _______________
            </ThemedText>
          </ThemedView>
          <ThemedView
            style={styles.contactItem}
            lightColor="transparent"
            darkColor="transparent"
          >
            <ThemedText
              style={styles.contactLabel}
              lightColor="#333"
              darkColor="#e0e0e0"
            >
              Primary Care
            </ThemedText>
            <ThemedText
              style={styles.contactPlaceholder}
              lightColor="#ccc"
              darkColor="#666"
            >
              _______________
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {medications.filter((med) => med.communication.schoolPlan).length >
        0 && (
        <ThemedView
          style={styles.schoolPlans}
          lightColor="transparent"
          darkColor="transparent"
        >
          <ThemedText
            style={styles.contactTitle}
            lightColor="#333"
            darkColor="#fff"
          >
            School Medication Plans
          </ThemedText>
          {medications
            .filter((med) => med.communication.schoolPlan)
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
                  {med.communication.schoolPlan}
                </ThemedText>
              </ThemedView>
            ))}
        </ThemedView>
      )}
    </ThemedView>
  );

  return (
    <SafetyPlanSection
      title="Communication & Safety Information"
      content={communicationContent}
    />
  );
}

const styles = StyleSheet.create({
  communicationSection: {
    gap: 24,
  },
  contactInfo: {},
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  contactGrid: {
    gap: 12,
  },
  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  contactLabel: {
    fontSize: 14,
    flex: 1,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f78b33",
  },
  contactPlaceholder: {
    fontSize: 14,
  },
  schoolPlans: {},
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