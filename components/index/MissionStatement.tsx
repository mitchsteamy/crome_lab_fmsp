import React, { useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../common/ThemedText";
import { ThemedView } from "../common/ThemedView";

const BENEFITS = [
  "Understand your medicines",
  "Stay organized",
  "Use medicines safely",
  // "Communicate clearly",
  // "Make informed choices",
];

export default function MissionStatement() {
  const [purposeExpanded, setPurposeExpanded] = useState(true);

  const renderCompactBullets = () => (
    <View style={styles.bulletsContainer}>
      {BENEFITS.map((benefit, index) => (
        <View key={index} style={styles.bulletRow}>
          <ThemedText style={styles.bullet} lightColor="#f78b33" darkColor="#f78b33">
            •
          </ThemedText>
          <ThemedText style={styles.bulletText} lightColor="#666" darkColor="#ccc">
            {benefit}
          </ThemedText>
        </View>
      ))}
    </View>
  );

  return (
    <ThemedView
      style={styles.purposeContainer}
      lightColor="#f5f5f5"
      darkColor="#1f1f1f"
    >
      <ThemedView
        style={styles.purposeContent}
        lightColor="transparent"
        darkColor="transparent"
      >
        <TouchableOpacity
          style={styles.purposeHeader}
          onPress={() => setPurposeExpanded(!purposeExpanded)}
          activeOpacity={0.7}
        >
          <ThemedText
            type="defaultSemiBold"
            style={styles.purposeTitle}
            lightColor="#333"
            darkColor="#fff"
          >
            Our Mission
          </ThemedText>
          <ThemedText
            style={styles.chevron}
            lightColor="#f78b33"
            darkColor="#f78b33"
          >
            {purposeExpanded ? "▲" : "▼"}
          </ThemedText>
        </TouchableOpacity>

        {purposeExpanded && (
          <ThemedView
            style={styles.purposeExpandedContent}
            lightColor="transparent"
            darkColor="transparent"
          >
            <ThemedText
              style={styles.purposeText}
              lightColor="#666"
              darkColor="#ccc"
            >
              To help you and your family stay informed about your medicines
              and use them safely.
            </ThemedText>

            <ThemedText
              type="defaultSemiBold"
              style={styles.purposeSubtitle}
              lightColor="#333"
              darkColor="#fff"
            >
              Why We Created This Plan
            </ThemedText>
            
            <ThemedText
              style={styles.introText}
              lightColor="#666"
              darkColor="#ccc"
            >
              Your Family Medication Safety Plan helps you:
            </ThemedText>

            {renderCompactBullets()}

            <ThemedText
              style={styles.closingText}
              lightColor="#666"
              darkColor="#ccc"
            >
              This plan puts you in control of your medicine management.
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  purposeContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  purposeContent: {
    alignSelf: Platform.OS === "web" ? "flex-start" : "center",
    width: "100%",
  },
  purposeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  purposeTitle: {
    fontSize: 16,
    color: "#f78b33",
  },
  chevron: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },
  purposeExpandedContent: {
    marginTop: 12,
  },
  purposeSubtitle: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 4,
    color: "#f78b33",
  },
  purposeText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "left",
  },
  introText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 4,
    textAlign: "left",
  },
  bulletsContainer: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    flexWrap: "wrap",
    marginVertical: 4,
    gap: Platform.OS === "web" ? 0 : 2,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingRight: Platform.OS === "web" ? 12 : 0,
    marginBottom: 2,
  },
  bullet: {
    fontSize: 16,
    lineHeight: 20,
    marginRight: 8,
    width: 12,
  },
  bulletText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  closingText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    fontStyle: "italic",
    textAlign: Platform.OS === "web" ? "left" : "center",
  },
});