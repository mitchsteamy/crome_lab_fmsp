import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Medication } from "../types/Medication";

// Question types and interfaces
export interface QuestionStep {
  id: string;
  title: string;
  type:
    | "text"
    | "select"
    | "textarea"
    | "multiselect"
    | "date"
    | "time"
    | "time-list"
    | "number";
  question: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  validation?: (value: any) => string | null;
  helpText?: string;
  dependsOn?: string; // Optional field that depends on another answer
  showIf?: (answers: Record<string, any>) => boolean; // Conditional logic
}

export interface QuestionSection {
  id: string;
  title: string;
  description: string;
  steps: QuestionStep[];
}

// Special instruction page interface
export interface InstructionPage {
  id: "instructions";
  title: string;
  description: string;
  logoSpace: boolean; // 500x170 logo space
  instructions: string[];
}

// State interface
export interface QuestionEngineState {
  currentSectionIndex: number;
  currentStepIndex: number;
  answers: Record<string, any>;
  completed: boolean;
  isValid: boolean;
  showInstructions: boolean;
}

// Action types
type QuestionEngineAction =
  | { type: "START_QUESTIONS" } // Move from instructions to first question
  | { type: "NEXT_STEP" }
  | { type: "PREVIOUS_STEP" }
  | { type: "GO_TO_STEP"; sectionIndex: number; stepIndex: number }
  | { type: "UPDATE_ANSWER"; questionId: string; value: any }
  | { type: "COMPLETE" }
  | { type: "RESET" };

// Initial state
const initialState: QuestionEngineState = {
  currentSectionIndex: 0,
  currentStepIndex: 0,
  answers: {},
  completed: false,
  isValid: false,
  showInstructions: true,
};

// Instruction page
export const INSTRUCTION_PAGE: InstructionPage = {
  id: "instructions",
  title: "Family Medication Safety Plan",
  description: "Welcome to your personalized medication safety plan",
  logoSpace: true,
  instructions: [
    "You may need to consult your medication container, your pharmacist, or the internet to answer some of these questions. Feel free to do so if necessary.",
    "Answer each of the following questions to the best of your ability to add a medication.",
    "When you are finished, your medication will be added to your Medication Safety Plan.",
    "You can export your Medication Safety Plan for ease of use.",
  ],
};

// Basic Information section (starting with prescription type, brand name, generic name)
export const BASIC_INFO_QUESTIONS: QuestionSection = {
  id: "basic_info",
  title: "Basic Information",
  description: "Let's start with the basic details about this medication",
  steps: [
    {
      id: "prescription_type",
      title: "Prescription Type",
      type: "select",
      question: "Is this medication prescribed or over the counter?",
      required: true,
      options: ["prescription", "over-the-counter"],
      helpText:
        "This will help you determine storage and disposal requirements",
    },
    {
      id: "brand_name",
      title: "Brand Name",
      type: "text",
      question: "What is the brand name of this medication?",
      required: true,
      placeholder: "e.g., Tylenol, Advil, Lipitor",
      helpText: "This is the commercial name you see on the package",
    },
    {
      id: "generic_name",
      title: "Generic Name",
      type: "text",
      question: "What is the generic name of this medication?",
      required: false,
      placeholder: "e.g., acetaminophen, ibuprofen, atorvastatin",
      helpText: "This is the scientific/chemical name, often in smaller print",
    },
    {
      id: "reason_for_use",
      title: "Reason for Use",
      type: "textarea",
      question: "What is your reason for using this medication?",
      required: true,
      placeholder:
        "e.g., headache relief, blood pressure control, diabetes management",
      helpText: "Describe the condition or symptom being treated",
    },
  ],
};

// Dosage & Administration section
export const DOSAGE_ADMIN_QUESTIONS: QuestionSection = {
  id: "dosage_admin",
  title: "Dosage & Administration",
  description: "How do you take this medication?",
  steps: [
    {
      id: "dosage_unit",
      title: "Dosage Unit",
      type: "select",
      question: "What unit is your dosage measured in?",
      required: true,
      options: [
        "tablet",
        "capsule",
        "teaspoon",
        "tablespoon",
        "mL",
        "drops",
        "puff",
        "patch",
        "injection",
        "other",
      ],
      helpText: "Select the unit that matches your medication",
    },
    {
      id: "dosage_amount",
      title: "Dosage Amount",
      type: "text",
      question: "How much do you take each time?",
      required: true,
      placeholder: "e.g., 1, 2, 1/2, 5",
      helpText: "Enter the amount as written on your medication",
    },
    {
      id: "administration_method",
      title: "Administration Method",
      type: "select",
      question: "How is this medication administered?",
      required: true,
      options: [
        "by mouth",
        "under tongue",
        "between cheek and gums",
        "inhaled into lungs",
        "rubbed on skin",
        "injection",
        "eye",
        "ear",
        "nasal",
        "vaginal",
        "rectal",
        "other",
      ],
      helpText: "Select how you take or apply this medication",
    },
    {
      id: "food_requirement",
      title: "Food Requirements",
      type: "select",
      question: "Should this medication be taken with food?",
      required: true,
      options: [
        "before food",
        "with food",
        "after food",
        "no food requirement",
      ],
      helpText: "Check your medication label or ask your pharmacist if unsure",
    },
  ],
};

// Schedule section
export const SCHEDULE_QUESTIONS: QuestionSection = {
  id: "schedule",
  title: "Medication Schedule",
  description: "When and how often do you take this medication?",
  steps: [
    {
      id: "schedule_frequency",
      title: "Frequency",
      type: "select",
      question: "How often do you take this medication?",
      required: true,
      options: [
        "daily",
        "every-other-day",
        "specific-days",
        "every-x-days",
        "every-x-weeks",
        "every-x-months",
        "as-needed",
      ],
      helpText: "Select the frequency that matches your prescription",
    },
    {
      id: "interval_days",
      title: "Days Interval",
      type: "number",
      question: "How many days between doses?",
      required: true,
      placeholder: "Enter number of days",
      helpText: "Enter the number of days between each dose",
      showIf: (answers) => answers.schedule_frequency === "every-x-days",
    },
    {
      id: "interval_weeks",
      title: "Weeks Interval",
      type: "number",
      question: "How many weeks between doses?",
      required: true,
      placeholder: "Enter number of weeks",
      helpText: "Enter the number of weeks between each dose",
      showIf: (answers) => answers.schedule_frequency === "every-x-weeks",
    },
    {
      id: "interval_months",
      title: "Months Interval",
      type: "number",
      question: "How many months between doses?",
      required: true,
      placeholder: "Enter number of months",
      helpText: "Enter the number of months between each dose",
      showIf: (answers) => answers.schedule_frequency === "every-x-months",
    },
    {
      id: "daily_frequency",
      title: "Daily Frequency",
      type: "select",
      question: "How many times a day do you take this medication?",
      required: true,
      options: [
        "once",
        "twice",
        "three-times",
        "four-times",
        "more-than-four",
        "every-x-hours",
      ],
      helpText: "This helps set up your daily schedule",
      showIf: (answers) => answers.schedule_frequency === "daily",
    },
    {
      id: "interval_hours",
      title: "Hours Interval",
      type: "number",
      question: "How many hours between doses?",
      required: true,
      placeholder: "Enter number of hours",
      helpText: "Enter the number of hours between each dose",
      showIf: (answers) => answers.daily_frequency === "every-x-hours",
    },
    {
      id: "specific_days",
      title: "Specific Days",
      type: "multiselect",
      question: "On what days do you take this medication?",
      required: true,
      options: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      helpText: "Check all days that apply",
      showIf: (answers) => answers.schedule_frequency === "specific-days",
    },
    {
      id: "first_dose_time",
      title: "First Dose Time",
      type: "time",
      question: "What time do you take your first dose?",
      required: true,
      helpText: "Select the time for your first daily dose",
      showIf: (answers) =>
        ["daily", "every-other-day", "specific-days"].includes(
          answers.schedule_frequency
        ) && answers.daily_frequency !== "as-needed",
    },
    {
      id: "dose_times",
      title: "Medication Times",
      type: "time-list",
      question: "Review and adjust your daily medication times:",
      required: false,
      helpText:
        "Tap any time to change it. These are calculated based on your first dose time and frequency.",
      showIf: (answers) =>
        ["daily", "every-other-day", "specific-days"].includes(
          answers.schedule_frequency
        ) &&
        answers.daily_frequency &&
        answers.daily_frequency !== "as-needed" &&
        answers.daily_frequency !== "once" &&
        answers.first_dose_time,
    },
    {
      id: "start_date",
      title: "Start Date",
      type: "date",
      question: "When did/will you start taking this medication?",
      required: true,
      helpText: "Enter the date you started or will start this medication",
    },
    {
      id: "end_date",
      title: "End Date",
      type: "date",
      question: "When will you stop taking this medication?",
      required: false,
      helpText: "Leave blank if ongoing or unknown",
    },
  ],
};

// Safety Information section
export const SAFETY_INFO_QUESTIONS: QuestionSection = {
  id: "safety_info",
  title: "Safety Information",
  description: "Important safety information about this medication",
  steps: [
    {
      id: "benefits",
      title: "Benefits",
      type: "textarea",
      question: "What are the benefits of this medication?",
      required: false,
      placeholder:
        "e.g., reduces pain, controls blood pressure, improves sleep",
      helpText: "Describe what this medication does for you",
    },
    {
      id: "side_effects",
      title: "Side Effects",
      type: "textarea",
      question: "What are the potential side effects of this medication?",
      required: false,
      placeholder: "e.g., drowsiness, upset stomach, dizziness",
      helpText: "List any side effects you've experienced or been warned about",
    },
    {
      id: "drug_interactions",
      title: "Drug Interactions",
      type: "textarea",
      question: "Does this medication have any drug-drug interactions?",
      required: false,
      placeholder:
        "e.g., do not take with blood thinners, avoid with other pain medications",
      helpText: "List medications that should not be taken with this one",
    },
    {
      id: "food_interactions",
      title: "Food Interactions",
      type: "textarea",
      question: "Does this medication have any food-drug interactions?",
      required: false,
      placeholder: "e.g., avoid alcohol, do not take with dairy products",
      helpText: "List foods or drinks to avoid while taking this medication",
    },
  ],
};

// Storage & Disposal section
export const STORAGE_DISPOSAL_QUESTIONS: QuestionSection = {
  id: "storage_disposal",
  title: "Storage & Disposal",
  description: "How to properly store and dispose of this medication",
  steps: [
    {
      id: "storage_instructions",
      title: "Storage Instructions",
      type: "textarea",
      question:
        "What are the instructions for properly storing this medication?",
      required: false,
      placeholder:
        "e.g., store in cool, dry place; keep refrigerated; protect from light",
      helpText: "Check your medication label for storage requirements",
    },
    {
      id: "storage_location",
      title: "Storage Location",
      type: "textarea",
      question: "What is your plan for properly storing this medication?",
      required: false,
      placeholder:
        "e.g., medicine cabinet in bathroom, kitchen counter, refrigerator",
      helpText: "Where do you plan to keep this medication safe?",
    },
    {
      id: "expiration_date",
      title: "Expiration Date",
      type: "date",
      question: "When does this medication expire?",
      required: false,
      helpText: "Check the expiration date on your medication package",
    },
    {
      id: "disposal_instructions",
      title: "Disposal Instructions",
      type: "textarea",
      question: "What is the proper disposal technique for this medication?",
      required: false,
      placeholder:
        "e.g., return to pharmacy, use drug take-back program, flush down toilet",
      helpText: "How should you safely dispose of unused medication?",
    },
  ],
};

// Communication & Safety section
export const COMMUNICATION_SAFETY_QUESTIONS: QuestionSection = {
  id: "communication_safety",
  title: "Communication & Safety",
  description: "Emergency contacts and safety plans",
  steps: [
    {
      id: "school_plan",
      title: "School Plan",
      type: "textarea",
      question: "What are your plans for using this medication in school?",
      required: false,
      placeholder:
        "e.g., kept in nurse's office, self-administered, not needed at school",
      helpText: "Describe how this medication will be handled at school",
    },
    {
      id: "questions_about_medication",
      title: "Questions or Concerns",
      type: "textarea",
      question: "Do you have any questions or concerns about this medication?",
      required: false,
      placeholder:
        "e.g., worried about side effects, unsure about timing, need dosage clarification",
      helpText:
        "List any questions you want to discuss with your healthcare provider",
    },
    {
      id: "poc_name",
      title: "Point of Contact Name",
      type: "text",
      question:
        " Who is your main point of contact for questions/concerns about this medication?",
      required: true,
      placeholder: "e.g., Dr. Abraham, Dr. Strong",
      helpText:
        "The name of the healthcare provider you would contact with questions about this medication ",
    },
    {
      id: "poc_info",
      title: "Point of Contact Information",
      type: "text",
      question:
        " What is the email or phone number for your main point of contact for questions/concerns about this medication?",
      required: true,
      placeholder: "e.g., 859-867-5309, john.doe@uky.edu",
      helpText:
        "The contact info for the healthcare provider you would contact with questions about this medication ",
    },
    {
      id: "additional_instructions",
      title: "Additional Instructions",
      type: "textarea",
      question:
        "Does this medication have any additional instructions for use?",
      required: false,
      placeholder:
        "e.g., take with full glass of water, do not crush or chew, shake well before use",
      helpText: "Any other important instructions for taking this medication",
    },
  ],
};

// All sections in order
export const QUESTION_SECTIONS: QuestionSection[] = [
  BASIC_INFO_QUESTIONS,
  DOSAGE_ADMIN_QUESTIONS,
  SCHEDULE_QUESTIONS,
  SAFETY_INFO_QUESTIONS,
  STORAGE_DISPOSAL_QUESTIONS,
  COMMUNICATION_SAFETY_QUESTIONS,
];

// Reducer function
function questionEngineReducer(
  state: QuestionEngineState,
  action: QuestionEngineAction
): QuestionEngineState {
  switch (action.type) {
    case "START_QUESTIONS":
      return {
        ...state,
        showInstructions: false,
      };

    case "NEXT_STEP":
      if (state.showInstructions) {
        return { ...state, showInstructions: false };
      }

      const currentSection = QUESTION_SECTIONS[state.currentSectionIndex];
      const currentStep = currentSection?.steps[state.currentStepIndex];

      // Skip steps that shouldn't be shown based on conditional logic
      let nextStepIndex = state.currentStepIndex + 1;
      let nextSectionIndex = state.currentSectionIndex;

      // Check if we need to move to next section
      if (nextStepIndex >= currentSection.steps.length) {
        nextSectionIndex = state.currentSectionIndex + 1;
        nextStepIndex = 0;
      }

      // Check if we're at the end
      if (nextSectionIndex >= QUESTION_SECTIONS.length) {
        return { ...state, completed: true };
      }

      // Skip conditional steps
      const nextSection = QUESTION_SECTIONS[nextSectionIndex];
      const nextStep = nextSection?.steps[nextStepIndex];

      if (nextStep?.showIf && !nextStep.showIf(state.answers)) {
        // Recursively find next valid step
        return questionEngineReducer(
          {
            ...state,
            currentSectionIndex: nextSectionIndex,
            currentStepIndex: nextStepIndex,
          },
          { type: "NEXT_STEP" }
        );
      }

      return {
        ...state,
        currentSectionIndex: nextSectionIndex,
        currentStepIndex: nextStepIndex,
      };

    case "PREVIOUS_STEP":
      if (
        !state.showInstructions &&
        state.currentSectionIndex === 0 &&
        state.currentStepIndex === 0
      ) {
        return { ...state, showInstructions: true };
      }

      if (state.showInstructions) {
        return state;
      }

      let prevStepIndex = state.currentStepIndex - 1;
      let prevSectionIndex = state.currentSectionIndex;

      if (prevStepIndex < 0) {
        prevSectionIndex = state.currentSectionIndex - 1;
        if (prevSectionIndex >= 0) {
          prevStepIndex = QUESTION_SECTIONS[prevSectionIndex].steps.length - 1;
        } else {
          return { ...state, showInstructions: true };
        }
      }

      // Skip conditional steps when going backwards
      const prevSection = QUESTION_SECTIONS[prevSectionIndex];
      const prevStep = prevSection?.steps[prevStepIndex];

      if (prevStep?.showIf && !prevStep.showIf(state.answers)) {
        return questionEngineReducer(
          {
            ...state,
            currentSectionIndex: prevSectionIndex,
            currentStepIndex: prevStepIndex,
          },
          { type: "PREVIOUS_STEP" }
        );
      }

      return {
        ...state,
        currentSectionIndex: prevSectionIndex,
        currentStepIndex: prevStepIndex,
      };

    case "GO_TO_STEP":
      return {
        ...state,
        currentSectionIndex: action.sectionIndex,
        currentStepIndex: action.stepIndex,
        showInstructions: false,
      };

    case "UPDATE_ANSWER":
      const newAnswers = {
        ...state.answers,
        [action.questionId]: action.value,
      };

      // Check if current step is valid
      const currentValidationStep = state.showInstructions
        ? null
        : QUESTION_SECTIONS[state.currentSectionIndex]?.steps[
            state.currentStepIndex
          ];

      const isCurrentStepValid =
        state.showInstructions ||
        !currentValidationStep?.required ||
        (newAnswers[currentValidationStep.id] !== undefined &&
          newAnswers[currentValidationStep.id] !== "");

      return {
        ...state,
        answers: newAnswers,
        isValid: isCurrentStepValid,
      };

    case "COMPLETE":
      return {
        ...state,
        completed: true,
      };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

// Context interface
interface QuestionEngineContextType {
  state: QuestionEngineState;
  dispatch: React.Dispatch<QuestionEngineAction>;
  getCurrentStep: () => QuestionStep | null;
  getCurrentSection: () => QuestionSection | null;
  getInstructionPage: () => InstructionPage;
  getProgress: () => { current: number; total: number; percentage: number };
  canProceed: () => boolean;
  buildMedication: () => Partial<Medication>;
}

const QuestionEngineContext = createContext<QuestionEngineContextType | null>(
  null
);

// Provider component
interface QuestionEngineProviderProps {
  children: ReactNode;
}

export function QuestionEngineProvider({
  children,
}: QuestionEngineProviderProps) {
  const [state, dispatch] = useReducer(questionEngineReducer, initialState);

  const getCurrentStep = (): QuestionStep | null => {
    if (state.showInstructions) return null;
    const section = QUESTION_SECTIONS[state.currentSectionIndex];
    return section?.steps[state.currentStepIndex] || null;
  };

  const getCurrentSection = (): QuestionSection | null => {
    if (state.showInstructions) return null;
    return QUESTION_SECTIONS[state.currentSectionIndex] || null;
  };

  const getInstructionPage = (): InstructionPage => {
    return INSTRUCTION_PAGE;
  };

  const getProgress = () => {
    const totalSteps =
      QUESTION_SECTIONS.reduce(
        (total, section) => total + section.steps.length,
        0
      ) + 1; // +1 for instructions
    let currentStep = 1; // Start at 1 for instructions

    if (!state.showInstructions) {
      for (let i = 0; i < state.currentSectionIndex; i++) {
        currentStep += QUESTION_SECTIONS[i].steps.length;
      }
      currentStep += state.currentStepIndex + 1;
    }

    return {
      current: currentStep,
      total: totalSteps,
      percentage: Math.round((currentStep / totalSteps) * 100),
    };
  };

  const canProceed = (): boolean => {
    if (state.showInstructions) return true;

    const currentStep = getCurrentStep();
    if (!currentStep) return false;

    if (currentStep.required) {
      const answer = state.answers[currentStep.id];
      return answer !== undefined && answer !== "" && answer !== null;
    }

    return true;
  };

  const buildMedication = (): Partial<Medication> => {
    const answers = state.answers;

    // Helper function to get dose times - use stored times if available, otherwise compute them
    const getDoseTimes = () => {
      // If user has customized the dose times, use those
      if (
        answers.dose_times &&
        Array.isArray(answers.dose_times) &&
        answers.dose_times.length > 0
      ) {
        return answers.dose_times.map((timeEntry: any) => ({
          hour: timeEntry.hour,
          minute: timeEntry.minute,
        }));
      }

      // Otherwise compute from first dose time and frequency
      const firstDoseTime = answers.first_dose_time
        ? new Date(answers.first_dose_time)
        : null;
      const dailyFreq = answers.daily_frequency;
      const intervalHours = parseInt(answers.interval_hours) || 4;

      if (!firstDoseTime || !dailyFreq) {
        return [{ hour: 9, minute: 0 }]; // Default
      }

      const times = [];
      const firstHour = firstDoseTime.getHours();
      const firstMinute = firstDoseTime.getMinutes();

      if (dailyFreq === "every-x-hours") {
        // 24-hour schedule with specified intervals
        let currentHour = firstHour;
        let currentMinute = firstMinute;

        for (let i = 0; i < 24 / intervalHours; i++) {
          times.push({ hour: currentHour, minute: currentMinute });
          currentHour = (currentHour + intervalHours) % 24;
        }
      } else {
        // Fixed times with last dose at 11pm
        times.push({ hour: firstHour, minute: firstMinute });

        let numDoses = 1;
        if (dailyFreq === "twice") numDoses = 2;
        else if (dailyFreq === "three-times") numDoses = 3;
        else if (dailyFreq === "four-times") numDoses = 4;
        else if (dailyFreq === "more-than-four") numDoses = 5;

        if (numDoses > 1) {
          // Calculate intervals to end at 11pm (23:00)
          const endHour = 23;
          const endMinute = 0;
          const totalMinutes =
            endHour * 60 + endMinute - (firstHour * 60 + firstMinute);
          const intervalMinutes = totalMinutes / (numDoses - 1);

          for (let i = 1; i < numDoses; i++) {
            const totalMin = firstHour * 60 + firstMinute + intervalMinutes * i;
            const hour = Math.floor(totalMin / 60) % 24;
            const minute = Math.floor(totalMin % 60);
            times.push({ hour, minute });
          }
        }
      }

      return times;
    };

    return {
      // Basic Information
      patientName: "Patient", // Default since commented out
      brandName: answers.brand_name || "",
      genericName: answers.generic_name || "",
      prescriptionType: answers.prescription_type || "over-the-counter",
      reasonForUse: answers.reason_for_use || "",

      // Dosage & Administration
      dosageAmount: answers.dosage_amount || "1",
      dosageUnit: answers.dosage_unit || "tablet",
      administrationMethod: answers.administration_method || "by mouth",
      foodRequirement: answers.food_requirement || "none",

      // Schedule
      schedule: {
        frequency: answers.schedule_frequency || "daily",
        dailyFrequency: answers.daily_frequency,
        doseTimes: getDoseTimes(),
        daysOfWeek: answers.specific_days || [],
        intervalDays: parseInt(answers.interval_days) || undefined,
        intervalWeeks: parseInt(answers.interval_weeks) || undefined,
        intervalMonths: parseInt(answers.interval_months) || undefined,
        intervalHours: parseInt(answers.interval_hours) || undefined,
        isAsNeeded: answers.schedule_frequency === "as-needed",
      },
      startDate: answers.start_date ? new Date(answers.start_date) : new Date(),
      endDate: answers.end_date ? new Date(answers.end_date) : undefined,

      // Safety Information
      benefits: answers.benefits || "",
      sideEffects: answers.side_effects || "",
      drugInteractions: answers.drug_interactions || "",
      foodInteractions: answers.food_interactions || "",

      // Storage
      storage: {
        instructions: answers.storage_instructions || "",
        location: answers.storage_location || "",
        expirationDate: answers.expiration_date
          ? new Date(answers.expiration_date)
          : undefined,
        disposalInstructions: answers.disposal_instructions || "",
      },

      // Communication
      communication: {
        questionsAboutMedication: answers.questions_about_medication || "",
        primaryContact: {
          name: answers.poc_name || "",
          phone: answers.poc_info || "",
          role: "Healthcare Provider",
        },
        overdoseInstructions:
          "Contact emergency services (911) or poison control (1-800-222-1222)",
        schoolPlan: answers.school_plan || "",
        additionalConcerns: answers.additional_instructions || "",
      },

      // Metadata
      isActive: true,
      isExpired: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  };

  const value: QuestionEngineContextType = {
    state,
    dispatch,
    getCurrentStep,
    getCurrentSection,
    getInstructionPage,
    getProgress,
    canProceed,
    buildMedication,
  };

  return (
    <QuestionEngineContext.Provider value={value}>
      {children}
    </QuestionEngineContext.Provider>
  );
}

// Hook to use the context
export function useQuestionEngine() {
  const context = useContext(QuestionEngineContext);
  if (!context) {
    throw new Error(
      "useQuestionEngine must be used within a QuestionEngineProvider"
    );
  }
  return context;
}
