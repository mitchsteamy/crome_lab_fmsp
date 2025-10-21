import React from "react";
import { StyleSheet, Platform, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRouter } from "expo-router";
import { ThemedView } from "../common/ThemedView";
import QuestionFlowHeader from "./QuestionFlowHeader";
import ProgressBar from "./ProgressBar";
import InstructionPage from "./InstructionPage";
import QuestionPage from "./QuestionPage";
import QuestionFlowNavigation from "./QuestionFlowNavigation";
import { useQuestionEngine } from "../../contexts/QuestionEngineContext";
import { StorageService } from "../../services/StorageService";
import { Medication } from "../../types/Medication";

export default function QuestionFlow() {
  const { state, dispatch, getProgress, canProceed, buildMedication } =
    useQuestionEngine();

  const router = useRouter();
  const progress = getProgress();

  const handleNext = () => {
    if (state.completed) {
      handleComplete();
    } else {
      dispatch({ type: "NEXT_STEP" });
    }
  };

  const handlePrevious = () => {
    dispatch({ type: "PREVIOUS_STEP" });
  };

  const handleCancel = () => {
    if (Platform.OS === "web") {
      router.push("/");
    } else {
      router.back();
    }
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    dispatch({ type: "UPDATE_ANSWER", questionId, value });
  };

  const handleComplete = async () => {
    try {
      const partialMedication = buildMedication();
      const medication: Medication = {
        id: `med_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...partialMedication,
      } as Medication;

      await StorageService.storeMedication(medication);

      if (Platform.OS === "web") {
        alert("Medicine added successfully!");
      } else {
        Alert.alert("Success", "Medicine added successfully!");
      }

      router.back();
    } catch (error) {
      console.error("Error saving medicine:", error);

      if (Platform.OS === "web") {
        alert("Failed to save medicine. Please try again.");
      } else {
        Alert.alert("Error", "Failed to save medicine. Please try again.");
      }
    }
  };

  return (
    <ThemedView
      style={styles.container}
      lightColor="#f5f5f5"
      darkColor="#1f1f1f"
    >
      <ThemedView style={styles.safeArea} lightColor="transparent" darkColor="transparent">
        <QuestionFlowHeader
          onCancel={handleCancel}
          progress={progress}
          showProgress={!state.showInstructions}
        />

        {!state.showInstructions && <ProgressBar progress={progress} />}

        <KeyboardAwareScrollView
          style={styles.keyboardAvoidingContainer}
          contentContainerStyle={{ flex: 1 }}
          enableOnAndroid={true}
          extraScrollHeight={20}
        >
          <ThemedView
            style={styles.content}
            lightColor="transparent"
            darkColor="transparent"
          >
            {state.showInstructions ? (
              <InstructionPage />
            ) : (
              <QuestionPage
                answers={state.answers}
                onAnswerChange={handleAnswerChange}
              />
            )}
          </ThemedView>

          <QuestionFlowNavigation
            onNext={handleNext}
            onPrevious={handlePrevious}
            canProceed={canProceed()}
            isCompleted={state.completed}
            showInstructions={state.showInstructions}
            progress={progress}
          />
        </KeyboardAwareScrollView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
    maxWidth: Platform.OS === "web" ? 470 : "100%",
    marginTop: Platform.OS === "android" ? 48 : 0,
  },
  keyboardAvoidingContainer: {
    flex: 1,
    marginBottom: Platform.OS === "android" ? 48 : 0,
  },
  content: {
    flex: 1,
  },
});
