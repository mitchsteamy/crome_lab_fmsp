import React from "react";
import { StyleSheet, ScrollView, Image, Platform } from "react-native";
import { ThemedText } from "../common/ThemedText";
import { ThemedView } from "../common/ThemedView";
import { useQuestionEngine } from "../../contexts/QuestionEngineContext";

export default function InstructionPage() {
  const { getInstructionPage } = useQuestionEngine();
  const instructionPage = getInstructionPage();

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <ThemedView
        style={styles.instructionContainer}
        lightColor="#fff"
        darkColor="#2a2a2a"
      >
        {/* Logo */}
        <ThemedView
          style={styles.logoContainer}
          lightColor="transparent"
          darkColor="transparent"
        >
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </ThemedView>

        {/* Title */}
        <ThemedText
          style={styles.instructionTitle}
          lightColor="#333"
          darkColor="#fff"
        >
          {instructionPage.title}
        </ThemedText>

        {/* Instructions */}
        <ThemedView
          style={styles.instructionsContent}
          lightColor="transparent"
          darkColor="transparent"
        >
          {instructionPage.instructions.map((instruction, index) => (
            <ThemedView
              key={index}
              style={styles.instructionItem}
              lightColor="transparent"
              darkColor="transparent"
            >
              <ThemedText
                style={styles.instructionText}
                lightColor="#333"
                darkColor="#e0e0e0"
              >
                {instruction}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>

        {/* CTA */}
        <ThemedView
          style={styles.ctaContainer}
          lightColor="transparent"
          darkColor="transparent"
        >
          <ThemedText style={styles.ctaText} lightColor="#666" darkColor="#999">
            Answer each question to the best of your ability to add a medication
            to the Medication Safety Plan.
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  instructionContainer: {
    padding: 24,
    borderRadius: 12,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoContainer: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  logoImage: {
    borderRadius: 8,
    width: 250,
    height: 85,
  },
  instructionTitle: {
    fontSize: 24,
    fontWeight: "600",
    //textAlign: "center",
    marginBottom: 24,
  },
  instructionsContent: {
    marginBottom: 24,
  },
  instructionItem: {
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 16,
    lineHeight: 24,
    //textAlign: "center",
  },
  ctaContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  ctaText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
});
