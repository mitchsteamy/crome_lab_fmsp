import React from "react";
import { 
  StyleSheet, 
  SafeAreaView, 
  Platform, 
  Alert, 
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
        alert("Medication added successfully!");
      } else {
        Alert.alert("Success", "Medication added successfully!");
      }

      router.back();
    } catch (error) {
      console.error("Error saving medication:", error);

      if (Platform.OS === "web") {
        alert("Failed to save medication. Please try again.");
      } else {
        Alert.alert("Error", "Failed to save medication. Please try again.");
      }
    }
  };

  return (
    <ThemedView
      style={styles.container}
      lightColor="#f5f5f5"
      darkColor="#1f1f1f"
    >
      <SafeAreaView style={styles.safeArea}>
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
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    marginTop: Platform.OS === "web" ? 0 : 48,
  },
  keyboardAvoidingContainer: {
    flex: 1,
    paddingBottom: Platform.OS === "android" ? 48 : 0,
  },
  content: {
    flex: 1,
  },
});