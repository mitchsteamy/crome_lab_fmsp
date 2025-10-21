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
    "Let's add your medicine! We'll ask you some questions to build your safety plan.",
    "Answer as best you can. It's okay to check your medicine bottle, ask your pharmacist for help, or look it up.",
    "When you're done, we'll save your medicine to your plan.",
    "You can print or share your plan anytime.",
  ],
};

// Basic Information section (starting with prescription type, brand name, generic name)
export const BASIC_INFO_QUESTIONS: QuestionSection = {
  id: "basic_info",
  title: "Basic Info",
  description: "Let's start with some basics about your medicine",
  steps: [
    {
      id: "patient_relationship",
      title: "Who Is This For?",
      type: "select",
      question: "Who is this medicine for?",
      required: true,
      options: ["myself", "other"],
      helpText: "Let us know if this is for you or someone else", 
    },
    {
      id: "patient_name",
      title: "Patient Name",
      type: "text",
      question: "What's their first name or nickname?",
      required: true,
      placeholder: "Like Sam, Mom, or Buddy",
      helpText:
        "Use a first name or nickname for privacy. Don't use full names.",
      showIf: (answers) => answers.patient_relationship === "other",
    },
    {
      id: "prescription_type",
      title: "Prescription Type",
      type: "select",
      question: "Is this medicine a prescription or over-the-counter?",
      required: true,
      options: ["prescription", "over-the-counter"],
      helpText: "This helps us know how to store and dispose of it safely",
    },
    {
      id: "brand_name",
      title: "Brand Name",
      type: "text",
      question: "What's the brand name?",
      required: false,
      placeholder: "Like Tylenol, Advil, or Lipitor",
      helpText:
        "The name you see on the front of the package. You need either a brand name or generic name.",
    },
    {
      id: "generic_name",
      title: "Generic Name",
      type: "text",
      question: "What's the generic name?",
      required: false,
      placeholder: "Like acetaminophen, ibuprofen, or atorvastatin",
      helpText:
        "Usually in smaller print. You need either a brand name or generic name.",
    },
    {
      id: "reason_for_use",
      title: "Reason for Use",
      type: "textarea",
      question: "Why do you take this medicine?",
      required: true,
      placeholder: "Like for headaches, blood pressure, or diabetes",
      helpText: "Tell us what it helps with",
    },
  ],
};

// Dosage & Administration section
export const DOSAGE_ADMIN_QUESTIONS: QuestionSection = {
  id: "dosage_admin",
  title: "How You Take It",
  description: "Tell us how you take this medicine",
  steps: [
    {
      id: "dosage_unit",
      title: "Dosage Unit",
      type: "select",
      question: "How is it measured?",
      required: true,
      options: [
        "tablet",
        "capsule",
        "teaspoon",
        "tablespoon",
        "drops",
        "puff",
        "patch",
        "injection",
      ],
      helpText: "Pick what matches your medicine",
    },
    {
      id: "dosage_amount",
      title: "How Much",
      type: "text",
      question: "How much do you take each time?",
      required: true,
      placeholder: "Like 1, 2, 1/2, or 5",
      helpText: "Use the amount on your medicine bottle",
    },
    {
      id: "dosage_strength",
      title: "Strength",
      type: "text",
      question: "What's the strength of each dose?",
      required: false,
      placeholder: "Like 5mg, 250mg, 10mg/mL, or 500mg",
      helpText:
        "This is usually on your bottle. Like '5mg per tablet' or '250mg per teaspoon.' Leave blank if you're not sure.",
    },
    {
      id: "administration_method",
      title: "How You Take It",
      type: "select",
      question: "How do you take it?",
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
      ],
      helpText: "Pick how you use this medicine",
    },
    {
      id: "food_requirement",
      title: "Food Requirements",
      type: "select",
      question: "Do you take it with food?",
      required: true,
      options: [
        "before food",
        "with food",
        "after food",
        "no food requirement",
      ],
      helpText: "Check your bottle or ask your pharmacist if you're not sure",
    },
  ],
};

// Schedule section
export const SCHEDULE_QUESTIONS: QuestionSection = {
  id: "schedule",
  title: "When You Take It",
  description: "When and how often do you take this medicine?",
  steps: [
    {
      id: "schedule_frequency",
      title: "How Often",
      type: "select",
      question: "How often do you take this medicine?",
      required: true,
      options: [
        "every day",
        "every-other-day",
        "specific-days",
        "every-x-days",
        "every-x-weeks",
        "every-x-months",
        "as-needed",
      ],
      helpText: "Pick what matches your prescription", // Simpler
    },
    {
      id: "interval_days",
      title: "Days Between Doses",
      type: "number",
      question: "How many days between doses?",
      required: true,
      placeholder: "Enter number of days",
      helpText: "Like every 3 days, every 7 days, etc.",
      showIf: (answers) => answers.schedule_frequency === "every-x-days",
    },
    {
      id: "interval_weeks",
      title: "Weeks Between Doses",
      type: "number",
      question: "How many weeks between doses?",
      required: true,
      placeholder: "Enter number of weeks",
      helpText: "Like every 2 weeks, every 4 weeks, etc.",
      showIf: (answers) => answers.schedule_frequency === "every-x-weeks",
    },
    {
      id: "interval_months",
      title: "Months Between Doses",
      type: "number",
      question: "How many months between doses?",
      required: true,
      placeholder: "Enter number of months",
      helpText: "Like every 1 month, every 3 months, etc.",
      showIf: (answers) => answers.schedule_frequency === "every-x-months",
    },
    {
      id: "daily_frequency",
      title: "Times Per Day",
      type: "select",
      question: "How many times a day do you take this medicine?",
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
      showIf: (answers) => answers.schedule_frequency === "every day",
    },
    {
      id: "interval_hours",
      title: "Hours Between",
      type: "number",
      question: "How many hours between each dose?",
      required: true,
      placeholder: "Enter number of hours",
      helpText: "Like every 4 hours, every 6 hours, etc.",
      showIf: (answers) => answers.daily_frequency === "every-x-hours",
    },
    {
      id: "specific_days",
      title: "Which Days",
      type: "multiselect",
      question: "What days do you take this medicine?",
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
      question: "What time is your first dose?",
      required: true,
      helpText: "Pick the time for your first daily dose",
      showIf: (answers) =>
        ["every day", "every-other-day", "specific-days"].includes(
          answers.schedule_frequency
        ) && answers.daily_frequency !== "as-needed",
    },
    {
      id: "dose_times",
      title: "Your Daily Times",
      type: "time-list",
      question: "Check your daily times:",
      required: false,
      helpText:
        "Tap any time to change it. We calculated these based on when you take your first dose.",
      showIf: (answers) =>
        ["every day", "every-other-day", "specific-days"].includes(
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
      question: "When did you start taking this medicine?",
      required: true,
      helpText: "Pick the date you started or will start",
    },
    {
      id: "end_date",
      title: "End Date",
      type: "date",
      question: "When will you stop taking this medicine?",
      required: false,
      helpText: "Leave blank if you're not sure or if it's ongoing",
    },
  ],
};

// Safety Information section
export const SAFETY_INFO_QUESTIONS: QuestionSection = {
  id: "safety_info",
  title: "Safety Information",
  description: "Important safety information",
  steps: [
    {
      id: "benefits",
      title: "Benefits",
      type: "textarea",
      question: "What does this medicine do for you?",
      required: false,
      placeholder:
        "Like reduces pain, helps you sleep, or controls blood pressure",
      helpText: "Tell us how it helps",
    },
    {
      id: "side_effects",
      title: "Side Effects",
      type: "textarea",
      question: "What are the side effects of this medicine?",
      required: false,
      placeholder: "Like feeling sleepy, upset stomach, or dizziness",
      helpText: "List any side effects you've had or been told about",
    },
    {
      id: "drug_interactions",
      title: "Drug Interactions",
      type: "textarea",
      question: "Does it interact with other medicines?",
      required: false,
      placeholder: "Like don't take with blood thinners or other pain medicine",
      helpText: "List medicines you shouldn't take with this one",
    },
    {
      id: "food_interactions",
      title: "Food Interactions",
      type: "textarea",
      question: "Does it interact with any foods?",
      required: false,
      placeholder: "Like avoid alcohol or don't take with milk",
      helpText: "List foods or drinks to avoid with this medicine",
    },
  ],
};

// Storage & Disposal section
export const STORAGE_DISPOSAL_QUESTIONS: QuestionSection = {
  id: "storage_disposal",
  title: "Storage & Disposal",
  description: "How do you store and dispose of this medicine safely?",
  steps: [
    {
      id: "storage_instructions",
      title: "Storage Instructions",
      type: "textarea",
      question: "How should you store this medicine?",
      required: false,
      placeholder:
        "Like keep it cool and dry, in the fridge, or away from light",
      helpText: "Check your medicine bottle for how to store it",
    },
    {
      id: "storage_location",
      title: "Where You Keep It",
      type: "textarea",
      question: "Where will you keep this medicine?",
      required: false,
      placeholder:
        "e.g., medicine cabinet in bathroom, kitchen counter, refrigerator",
      helpText: "Where do you plan to keep this medicine safe?",
    },
    {
      id: "expiration_date",
      title: "Expiration Date",
      type: "date",
      question: "When does it expire?",
      required: false,
      helpText:
        "Check the date on your package. Leave blank if you're not sure.",
    },
    {
      id: "disposal_instructions",
      title: "Disposal Instructions",
      type: "textarea",
      question: "How should you get rid of this medicine?",
      required: false,
      placeholder:
        "Like return to pharmacy, use a take-back program, or flush it",
      helpText: "How to safely get rid of unused medicine",
    },
  ],
};

// Communication & Safety section
export const COMMUNICATION_SAFETY_QUESTIONS: QuestionSection = {
  id: "communication_safety",
  title: "Communication & Safety",
  description: "Who to contact if you have questions",
  steps: [
    {
      id: "school_plan",
      title: "School Plan",
      type: "textarea",
      question: "How will you use this medicine at school?",
      required: false,
      placeholder: "Like kept in nurse's office or you'll take it yourself",
      helpText:
        "Tell us your plan for this medicine at school. Leave blank if it doesn't apply.",
    },
    {
      id: "questions_about_medication",
      title: "Your Questions",
      type: "textarea",
      question: "Do you have any questions about this medicine?",
      required: false,
      placeholder:
        "Like worried about side effects, not sure about timing, or need help with dosage",
      helpText: "Write down questions to ask your doctor or pharmacist",
    },
    {
      id: "poc_name",
      title: "Who Can You Contact",
      type: "text",
      question: "Who should you call with questions?",
      required: true,
      placeholder: "Like Dr. Smith or Dr. Jones",
      helpText: "The doctor or pharmacist you'd call about this medicine",
    },
    {
      id: "poc_info",
      title: "Contact Info",
      type: "text",
      question: "What's their phone number or email?",
      required: true,
      placeholder: "Like 859-867-5309 or john.doe@email.com",
      helpText: "How to reach them",
    },
    {
      id: "additional_instructions",
      title: "Other Instructions",
      type: "textarea",
      question: "Any other instructions for this medicine?",
      required: false,
      placeholder:
        "Like take with a full glass of water, don't crush it, or shake well first",
      helpText: "Anything else important about taking this medicine",
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

    // Special case: brand_name and generic_name - at least one is required
    if (currentStep.id === "brand_name" || currentStep.id === "generic_name") {
      const brandName = state.answers.brand_name;
      const genericName = state.answers.generic_name;
      // At least one must have a value
      return (
        (brandName && brandName.trim() !== "") ||
        (genericName && genericName.trim() !== "")
      );
    }

    // Standard validation for other required fields
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
      patientName:
        answers.patient_relationship === "myself"
          ? "Myself"
          : answers.patient_name || "Patient",
      brandName: answers.brand_name || "",
      genericName: answers.generic_name || "",
      prescriptionType: answers.prescription_type || "over-the-counter",
      reasonForUse: answers.reason_for_use || "",

      // Dosage & Administration
      dosageAmount: answers.dosage_amount || "1",
      dosageUnit: answers.dosage_unit || "tablet",
      dosageStrength: answers.dosage_strength || "",
      administrationMethod: answers.administration_method || "by mouth",
      foodRequirement: answers.food_requirement || "no food requirement",

      // Schedule
      schedule: {
        frequency: answers.schedule_frequency || "every day",
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
