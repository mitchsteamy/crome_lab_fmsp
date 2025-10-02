// Add this helper function - you can put it in a utils file or at the top of SafetyPlanTab
export const groupMedicationsByPatient = (medications: Medication[]) => {
  const grouped = medications.reduce((acc, med) => {
    const patientName = med.patientName || "Unknown";
    if (!acc[patientName]) {
      acc[patientName] = [];
    }
    acc[patientName].push(med);
    return acc;
  }, {} as Record<string, Medication[]>);

  // Sort patients: "Myself" first, then alphabetically
  const sortedPatients = Object.keys(grouped).sort((a, b) => {
    if (a === "Myself") return -1;
    if (b === "Myself") return 1;
    return a.localeCompare(b);
  });

  return { grouped, sortedPatients };
};