export type AdministrationMethod =
  | "by mouth"
  | "under tongue"
  | "between cheek and gums"
  | "inhaled into lungs"
  | "rubbed on skin"
  | "injection"
  | "eye"
  | "ear"
  | "nasal"
  | "vaginal"
  | "rectal"
  | "other";

export type PrescriptionType = "prescription" | "over-the-counter";

// FIXED: Updated to match question flow exactly
export type FoodRequirement = "with food" | "before food" | "after food" | "no food requirement"; 

// FIXED: Changed "daily" to "every day" and added "as-needed"
export type ScheduleFrequency =
  | "every day"
  | "every-other-day"
  | "specific-days"
  | "every-x-days"
  | "every-x-weeks"
  | "every-x-months"
  | "as-needed";

// FIXED: Removed "as-needed" since it's in ScheduleFrequency
export type DailyFrequency =
  | "once"
  | "twice"
  | "three-times"
  | "four-times"
  | "more-than-four"
  | "every-x-hours";

export interface DoseTime {
  hour: number;
  minute: number;
  label?: string; // e.g., "Morning", "Evening"
}

export interface MedicationSchedule {
  frequency: ScheduleFrequency;
  dailyFrequency?: DailyFrequency;
  doseTimes: DoseTime[];
  daysOfWeek?: string[]; // e.g., ["Sunday", "Monday"]
  intervalDays?: number; // for every-x-days
  intervalWeeks?: number; // for every-x-weeks
  intervalMonths?: number; // for every-x-months
  intervalHours?: number; // for every-x-hours
  maxDailyDoses?: number; // for as-needed
  minIntervalHours?: number; // minimum time between as-needed doses
  isAsNeeded: boolean;
}

// NEW: Contact information for medication questions
export interface MedicationContact {
  name: string;
  phone: string;
  role: string; // e.g., "Pharmacist", "Primary Care Doctor", "Specialist"
}

// NEW: Storage information
export interface StorageInfo {
  instructions: string; // How to store (temperature, light, etc.)
  location: string; // Where you plan to store it
  expirationDate?: Date;
  disposalInstructions: string; // How to properly dispose
}

// NEW: Communication and safety
export interface SafetyCommunication {
  questionsAboutMedication: string; // User's questions about the medication
  primaryContact: MedicationContact; // Who to contact for questions
  secondaryContact?: MedicationContact; // Optional secondary contact
  overdoseInstructions: string; // What to do in case of overdose
  schoolPlan: string; // Plan for medication use in school
  additionalConcerns: string; // Other medication related concerns
}

export interface Medication {
  id: string;

  // Basic Information
  patientName: string;
  brandName: string;
  genericName: string;
  reasonForUse: string;
  prescriptionType: PrescriptionType;

  // Dosage and Administration
  dosageAmount: string;
  dosageUnit: string;
  dosageStrength: string; // NEW FIELD for dosage strength (e.g., "500mg")
  administrationMethod: AdministrationMethod;

  // Schedule - Enhanced to match PDF grid
  schedule: MedicationSchedule;
  startDate: Date;
  endDate?: Date;

  // Food and Timing
  foodRequirement: FoodRequirement;

  // Safety Information - Enhanced to match PDF
  benefits: string; // Key benefits of this medication
  sideEffects: string; // Potential side effects
  drugInteractions: string; // Drug-drug interactions
  foodInteractions: string; // Food-drug interactions

  // Storage and Disposal - Enhanced structure
  storage: StorageInfo;

  // Communication and Safety - NEW section
  communication: SafetyCommunication;

  // Metadata
  isActive: boolean;
  isExpired: boolean;
  createdAt: Date;
  updatedAt: Date;
}