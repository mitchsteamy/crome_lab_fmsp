import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { ThemedText } from "../common/ThemedText";
import { ThemedView } from "../common/ThemedView";
import QuestionInput from "./QuestionInput";
import { useQuestionEngine } from "../../contexts/QuestionEngineContext";

interface QuestionPageProps {
  answers: Record<string, any>;
  onAnswerChange: (questionId: string, value: any) => void;
}

export default function QuestionPage({
  answers,
  onAnswerChange,
}: QuestionPageProps) {
  const { getCurrentStep, getCurrentSection } = useQuestionEngine();

  const currentStep = getCurrentStep();
  const currentSection = getCurrentSection();

  if (!currentStep || !currentSection) {
    return (
      <ThemedView
        style={styles.errorContainer}
        lightColor="transparent"
        darkColor="transparent"
      >
        <ThemedText>Error: Unable to load question</ThemedText>
      </ThemedView>
    );
  }

  const validationError = currentStep.validation
    ? currentStep.validation(answers[currentStep.id], answers)
    : null;

  if (!currentStep || !currentSection) {
    return (
      <ThemedView
        style={styles.errorContainer}
        lightColor="transparent"
        darkColor="transparent"
      >
        <ThemedText>Error: Unable to load question</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <ThemedView
        style={styles.questionContainer}
        lightColor="#fff"
        darkColor="#2a2a2a"
      >
        {/* Section Title */}
        <ThemedText
          style={styles.sectionTitle}
          lightColor="#f78b33"
          darkColor="#f78b33"
        >
          {currentSection.title}
        </ThemedText>

        {/* Question */}
        <ThemedText
          style={styles.questionTitle}
          lightColor="#333"
          darkColor="#fff"
        >
          {currentStep.question}
          {currentStep.required && (
            <ThemedText style={styles.required}> *</ThemedText>
          )}
        </ThemedText>

        {/* Input */}
        <QuestionInput
          questionId={currentStep.id}
          type={currentStep.type}
          question={currentStep.question}
          options={currentStep.options}
          placeholder={currentStep.placeholder}
          helpText={currentStep.helpText}
          required={currentStep.required}
          value={answers[currentStep.id]}
          onValueChange={(value) => onAnswerChange(currentStep.id, value)}
          answers={answers}
        />

        {/* Validation Error */}
        {validationError && (
          <ThemedText
            style={styles.errorText}
            lightColor="#d32f2f"
            darkColor="#f44336"
          >
            {validationError}
          </ThemedText>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  questionContainer: {
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
    marginBottom: 24,
  },
  required: {
    color: "#ff4444",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 14,
  },
});
