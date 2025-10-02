import React from "react";
import {
  StyleSheet,
  ScrollView,
  Platform,
  useWindowDimensions,
} from "react-native";
import { ThemedText } from "../common/ThemedText";
import { ThemedView } from "../common/ThemedView";
import SafetyPlanSection from "./SafetyPlanSection";
import { Medication } from "../../types/Medication";
import { FormatUtils } from "../../utils/formatUtils";
import { groupMedicationsByPatient } from "../../utils/groupByPatient";

interface WeeklyScheduleProps {
  medications: Medication[];
}

export default function WeeklySchedule({ medications }: WeeklyScheduleProps) {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const fullDayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const { grouped, sortedPatients } = groupMedicationsByPatient(medications);

  const getMedicationsForDay = (
    patientMeds: Medication[],
    dayIndex: number
  ) => {
    // Get the full day name for this index
    const dayName = fullDayNames[dayIndex];

    return patientMeds
      .map((med) => {
        const schedule = med.schedule;
        let times: string[] = [];

        if (schedule?.isAsNeeded) {
          times = ["When needed"];
        } else if (
          schedule?.frequency === "specific-days" &&
          schedule?.daysOfWeek?.includes(dayName) &&
          schedule?.doseTimes
        ) {
          // Check if this specific day is in the schedule
          times = schedule.doseTimes.map((time) =>
            FormatUtils.formatTime(time.hour, time.minute)
          );
        } else if (schedule?.frequency === "every day" && schedule?.doseTimes) {
          // Daily medications appear every day
          times = schedule.doseTimes.map((time) =>
            FormatUtils.formatTime(time.hour, time.minute)
          );
        } else if (
          schedule?.frequency === "every-other-day" &&
          schedule?.doseTimes
        ) {
          // For every-other-day, we'd need start date to calculate which days
          // For now, show on all days (could be improved with more logic)
          times = schedule.doseTimes.map((time) =>
            FormatUtils.formatTime(time.hour, time.minute)
          );
        }

        return {
          medication: med,
          times: times,
        };
      })
      .filter((item) => item.times.length > 0);
  };

  const renderScheduleForPatient = (
    patientName: string,
    patientMeds: Medication[]
  ) => (
    <ThemedView
      key={patientName}
      style={styles.patientScheduleSection}
      lightColor="transparent"
      darkColor="transparent"
    >
      {/* Patient Name Header */}
      <ThemedView
        style={styles.patientHeader}
        lightColor="transparent"
        darkColor="transparent"
      >
        <ThemedText style={styles.patientHeaderText}>{patientName}</ThemedText>
      </ThemedView>

      {/* Calendar for this patient */}
      <ThemedView
        style={styles.calendarContainer}
        lightColor="transparent"
        darkColor="transparent"
      >
        <ThemedView
          style={styles.daysHeader}
          lightColor="#f8f9fa"
          darkColor="#404040"
        >
          {daysOfWeek.map((day) => (
            <ThemedView
              key={day}
              style={styles.dayHeaderCell}
              lightColor="transparent"
              darkColor="transparent"
            >
              <ThemedText
                style={styles.dayHeaderText}
                lightColor="#333"
                darkColor="#fff"
              >
                {day}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>

        <ThemedView
          style={styles.calendarGrid}
          lightColor="transparent"
          darkColor="transparent"
        >
          {daysOfWeek.map((day, dayIndex) => {
            const dayMedications = getMedicationsForDay(patientMeds, dayIndex);

            return (
              <ThemedView
                key={day}
                style={styles.dayColumn}
                lightColor="#fff"
                darkColor="#2a2a2a"
              >
                {dayMedications.length > 0 ? (
                  dayMedications.map((item, medIndex) => (
                    <ThemedView
                      key={`${item.medication.id}-${dayIndex}`}
                      style={[
                        styles.medicationEntry,
                        medIndex % 2 === 0 && styles.medicationEntryEven,
                      ]}
                      lightColor={medIndex % 2 === 0 ? "#fafafa" : "#fff"}
                      darkColor={medIndex % 2 === 0 ? "#333" : "#2a2a2a"}
                    >
                      <ThemedText
                        style={styles.medicationName}
                        lightColor="#333"
                        darkColor="#fff"
                        numberOfLines={2}
                      >
                        {item.medication.brandName}
                      </ThemedText>
                      {item.times.map((time, timeIndex) => (
                        <ThemedText
                          key={timeIndex}
                          style={styles.medicationTime}
                        >
                          {time}
                        </ThemedText>
                      ))}
                    </ThemedView>
                  ))
                ) : (
                  <ThemedView
                    style={styles.emptyDay}
                    lightColor="transparent"
                    darkColor="transparent"
                  >
                    <ThemedText
                      style={styles.emptyDayText}
                      lightColor="#ccc"
                      darkColor="#666"
                    >
                      —
                    </ThemedText>
                  </ThemedView>
                )}
              </ThemedView>
            );
          })}
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );

  const renderAllSchedules = () => (
    <ThemedView
      style={styles.container}
      lightColor="transparent"
      darkColor="transparent"
    >
      {sortedPatients.map((patientName, index) => (
        <ThemedView
          key={patientName}
          style={index > 0 ? styles.patientSpacing : undefined}
          lightColor="transparent"
          darkColor="transparent"
        >
          {renderScheduleForPatient(patientName, grouped[patientName])}
        </ThemedView>
      ))}
    </ThemedView>
  );

  const scheduleContent =
    Platform.OS === "web" && !isSmallScreen ? (
      renderAllSchedules()
    ) : (
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {renderAllSchedules()}
      </ScrollView>
    );

  return (
    <SafetyPlanSection
      title="When You Take Your Medicines"
      content={medications.length > 0 ? scheduleContent : "No medicines yet."}
      isEmpty={medications.length === 0}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  patientSpacing: {
    marginTop: 24,
  },
  patientScheduleSection: {},
  patientHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderColor: "#f78b33",
  },
  patientHeaderText: {
    color: "#f78b33",
    fontSize: 16,
    fontWeight: "600",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  calendarContainer: {
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    ...(Platform.OS !== "web" && { minWidth: 700 }),
  },
  daysHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#e0e0e0",
  },
  dayHeaderCell: {
    ...(Platform.OS === "web" ? { flex: 1 } : { width: 100 }),
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
  },
  dayHeaderText: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  calendarGrid: {
    flexDirection: "row",
  },
  dayColumn: {
    ...(Platform.OS === "web" ? { flex: 1 } : { width: 100 }),
    borderRightWidth: 1,
    borderRightColor: "#f0f0f0",
    minHeight: 80,
  },
  medicationEntry: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    alignItems: "center",
    minHeight: 50,
  },
  medicationEntryEven: {},
  medicationName: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  medicationTime: {
    fontSize: 10,
    color: "#f78b33",
    fontWeight: "500",
    marginBottom: 2,
    textAlign: "center",
  },
  emptyDay: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
  },
  emptyDayText: {
    fontSize: 16,
    textAlign: "center",
  },
});
