import { ThemedText } from "@/components/common/ThemedText";
import { ThemedView } from "@/components/common/ThemedView";
import { Medication } from "@/types/Medication";
import React from "react";
import { StyleSheet } from "react-native";

interface MedicationCommunicationSectionProps {
  medication: Medication;
}

export default function MedicationCommunicationSection({
  medication,
}: MedicationCommunicationSectionProps) {
  if (!medication?.communication) return null;

  const hasCommunicationData =
    medication.communication.primaryContact?.name?.trim() ||
    medication.communication.primaryContact?.phone?.trim() ||
    medication.communication.questionsAboutMedication?.trim() ||
    medication.communication.schoolPlan?.trim() ||
    medication.communication.additionalConcerns?.trim();

  if (!hasCommunicationData) return null;

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

  return (
    <ThemedView style={styles.section} lightColor="#fff" darkColor="#2a2a2a">
      <ThemedText
        type="subtitle"
        style={styles.sectionTitle}
        lightColor="#333"
        darkColor="#fff"
      >
        Questions & Contact Info
      </ThemedText>
      <ThemedView
        style={styles.sectionContent}
        lightColor="transparent"
        darkColor="transparent"
      >
        {/* Primary Contact */}
        {(medication.communication.primaryContact?.name?.trim() ||
          medication.communication.primaryContact?.phone?.trim()) && (
          <ThemedView
            style={styles.contactSection}
            lightColor="transparent"
            darkColor="transparent"
          >
            <ThemedText
              type="defaultSemiBold"
              style={styles.contactTitle}
              lightColor="#333"
              darkColor="#fff"
            >
              Who to Contact
            </ThemedText>
            {renderDetailRow(
              "Name",
              medication.communication.primaryContact?.name,
              true
            )}
            {renderDetailRow(
              "Phone",
              medication.communication.primaryContact?.phone,
              true
            )}
            {renderDetailRow(
              "Role",
              medication.communication.primaryContact?.role ||
                "Healthcare Provider"
            )}
          </ThemedView>
        )}

        {/* Questions About Medication */}
        {medication.communication.questionsAboutMedication?.trim() && (
          <ThemedView
            style={styles.questionSection}
            lightColor="transparent"
            darkColor="transparent"
          >
            <ThemedText
              type="defaultSemiBold"
              style={styles.questionTitle}
              lightColor="#333"
              darkColor="#fff"
            >
              Your Questions
            </ThemedText>
            <ThemedText
              style={styles.questionText}
              lightColor="#666"
              darkColor="#ccc"
            >
              {medication.communication.questionsAboutMedication}
            </ThemedText>
          </ThemedView>
        )}

        {/* School Plan */}
        {medication.communication.schoolPlan?.trim() && (
          <ThemedView
            style={styles.schoolSection}
            lightColor="transparent"
            darkColor="transparent"
          >
            <ThemedText
              type="defaultSemiBold"
              style={styles.schoolTitle}
              lightColor="#333"
              darkColor="#fff"
            >
              School Plan
            </ThemedText>
            <ThemedText
              style={styles.schoolText}
              lightColor="#666"
              darkColor="#ccc"
            >
              {medication.communication.schoolPlan}
            </ThemedText>
          </ThemedView>
        )}

        {/* Additional Concerns */}
        {medication.communication.additionalConcerns?.trim() && (
          <ThemedView
            style={styles.additionalSection}
            lightColor="transparent"
            darkColor="transparent"
          >
            <ThemedText
              type="defaultSemiBold"
              style={styles.additionalTitle}
              lightColor="#333"
              darkColor="#fff"
            >
              Other Instructions
            </ThemedText>
            <ThemedText
              style={styles.additionalText}
              lightColor="#666"
              darkColor="#ccc"
            >
              {medication.communication.additionalConcerns}
            </ThemedText>
          </ThemedView>
        )}

        {/* Emergency Instructions */}
        <ThemedView
          style={styles.emergencySection}
          lightColor="transparent"
          darkColor="transparent"
        >
          <ThemedText
            type="defaultSemiBold"
            style={styles.emergencyTitle}
            lightColor="#333"
            darkColor="#fff"
          >
            Emergency Info
          </ThemedText>
          <ThemedText
            style={styles.emergencyText}
            lightColor="#666"
            darkColor="#ccc"
          >
            {medication.communication.overdoseInstructions ||
              "In case of overdose: Call 911 or Poison Control at 1-800-222-1222"}
          </ThemedText>
        </ThemedView>
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
  contactSection: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  contactTitle: {
    marginBottom: 8,
    fontSize: 16,
    color: "#f78b33",
  },
  questionSection: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderLeftWidth: 3,
    borderLeftColor: "#f78b33",
  },
  questionTitle: {
    marginBottom: 6,
    fontSize: 14,
    color: "#f78b33",
  },
  questionText: {
    fontSize: 13,
    lineHeight: 18,
  },
  schoolSection: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  schoolTitle: {
    marginBottom: 6,
    fontSize: 14,
    color: "#f78b33",
  },
  schoolText: {
    fontSize: 13,
    lineHeight: 18,
  },
  additionalSection: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  additionalTitle: {
    marginBottom: 6,
    fontSize: 14,
    color: "#f78b33",
  },
  additionalText: {
    fontSize: 13,
    lineHeight: 18,
  },
  emergencySection: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderLeftWidth: 3,
    borderLeftColor: "#D54C4C",
  },
  emergencyTitle: {
    marginBottom: 6,
    fontSize: 14,
    color: "#D54C4C",
  },
  emergencyText: {
    fontSize: 13,
    lineHeight: 18,
  },
});