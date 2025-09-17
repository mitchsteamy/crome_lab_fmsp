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
  // Group medications by their primary contact
  const contactGroups = medications.reduce((groups, med) => {
    const contact = med.communication?.primaryContact;
    if (contact?.name?.trim() || contact?.phone?.trim()) {
      const key = `${contact.name?.trim() || 'Unknown'}-${contact.phone?.trim() || 'No phone'}`;
      if (!groups[key]) {
        groups[key] = {
          contact: contact,
          medications: []
        };
      }
      groups[key].medications.push(med);
    }
    return groups;
  }, {} as Record<string, { contact: any, medications: Medication[] }>);

  // Get medications with questions/concerns
  const medicationsWithQuestions = medications.filter(med => 
    med.communication?.questionsAboutMedication?.trim()
  );

  const communicationContent = (
    <ThemedView
      style={styles.communicationSection}
      lightColor="transparent"
      darkColor="transparent"
    >
      {/* Emergency Contacts */}
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
        </ThemedView>
      </ThemedView>

      {/* Healthcare Provider Contacts */}
      {Object.keys(contactGroups).length > 0 && (
        <ThemedView
          style={styles.healthcareContacts}
          lightColor="transparent"
          darkColor="transparent"
        >
          <ThemedText
            style={styles.contactTitle}
            lightColor="#333"
            darkColor="#fff"
          >
            Healthcare Provider Contacts
          </ThemedText>
          {Object.values(contactGroups).map((group, index) => (
            <ThemedView
              key={index}
              style={styles.providerGroup}
              lightColor="transparent"
              darkColor="transparent"
            >
              <ThemedView
                style={styles.providerHeader}
                lightColor="transparent"
                darkColor="transparent"
              >
                <ThemedText
                  style={styles.providerName}
                  lightColor="#333"
                  darkColor="#fff"
                >
                  {group.contact.name || 'Healthcare Provider'}
                </ThemedText>
                {group.contact.phone && (
                  <ThemedText style={styles.providerPhone}>
                    {group.contact.phone}
                  </ThemedText>
                )}
              </ThemedView>
              <ThemedView
                style={styles.medicationList}
                lightColor="transparent"
                darkColor="transparent"
              >
                <ThemedText
                  style={styles.medicationListLabel}
                  lightColor="#666"
                  darkColor="#ccc"
                >
                  Medications:
                </ThemedText>
                <ThemedText
                  style={styles.medicationListText}
                  lightColor="#333"
                  darkColor="#e0e0e0"
                >
                  {group.medications.map(med => med.brandName).join(', ')}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>
      )}

      {/* Questions and Concerns */}
      {medicationsWithQuestions.length > 0 && (
        <ThemedView
          style={styles.questionsSection}
          lightColor="transparent"
          darkColor="transparent"
        >
          <ThemedText
            style={styles.contactTitle}
            lightColor="#333"
            darkColor="#fff"
          >
            Questions & Concerns
          </ThemedText>
          {medicationsWithQuestions.map((med) => (
            <ThemedView
              key={med.id}
              style={styles.questionEntry}
              lightColor="transparent"
              darkColor="transparent"
            >
              <ThemedText
                style={styles.questionMedication}
                lightColor="#333"
                darkColor="#fff"
              >
                {med.brandName}:
              </ThemedText>
              <ThemedText
                style={styles.questionContent}
                lightColor="#666"
                darkColor="#ccc"
              >
                {med.communication.questionsAboutMedication}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      )}

      {/* School Plans */}
      {medications.filter((med) => med.communication?.schoolPlan?.trim()).length > 0 && (
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
            .filter((med) => med.communication?.schoolPlan?.trim())
            .map((med) => (
              <ThemedView
                key={med.id}
                style={styles.schoolEntry}
                lightColor="transparent"
                darkColor="transparent"
              >
                <ThemedText
                  style={styles.schoolMedication}
                  lightColor="#333"
                  darkColor="#fff"
                >
                  {med.brandName}:
                </ThemedText>
                <ThemedText
                  style={styles.schoolContent}
                  lightColor="#666"
                  darkColor="#ccc"
                >
                  {med.communication.schoolPlan}
                </ThemedText>
              </ThemedView>
            ))}
        </ThemedView>
      )}

      {/* General Instructions */}
      <ThemedView
        style={styles.generalInstructions}
        lightColor="transparent"
        darkColor="transparent"
      >
        <ThemedText
          style={styles.instructionsTitle}
          lightColor="#333"
          darkColor="#fff"
        >
          Important Reminders
        </ThemedText>
        <ThemedText
          style={styles.instructionsText}
          lightColor="#666"
          darkColor="#ccc"
        >
          • Keep this safety plan accessible and share copies with family members
        </ThemedText>
        <ThemedText
          style={styles.instructionsText}
          lightColor="#666"
          darkColor="#ccc"
        >
          • Update contact information when healthcare providers change
        </ThemedText>
        <ThemedText
          style={styles.instructionsText}
          lightColor="#666"
          darkColor="#ccc"
        >
          • Review and update this plan regularly with your healthcare team
        </ThemedText>
      </ThemedView>
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
  healthcareContacts: {},
  providerGroup: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  providerHeader: {
    marginBottom: 8,
  },
  providerName: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
    color: "#f78b33",
  },
  providerPhone: {
    fontSize: 14,
    color: "#f78b33",
    fontWeight: "500",
  },
  medicationList: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  medicationListLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 2,
  },
  medicationListText: {
    fontSize: 13,
  },
  questionsSection: {},
  questionEntry: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderLeftWidth: 3,
    borderLeftColor: "#f78b33",
  },
  questionMedication: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#f78b33",
  },
  questionContent: {
    fontSize: 13,
    lineHeight: 18,
  },
  schoolPlans: {},
  schoolEntry: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  schoolMedication: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#f78b33",
  },
  schoolContent: {
    fontSize: 13,
    lineHeight: 18,
  },
  generalInstructions: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#f78b33",
  },
  instructionsText: {
    fontSize: 12,
    marginBottom: 4,
  },
});