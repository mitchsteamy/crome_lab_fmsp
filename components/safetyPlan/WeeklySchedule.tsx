import React from "react";
import { StyleSheet, ScrollView, Platform } from "react-native";
import { ThemedText } from "../common/ThemedText";
import { ThemedView } from "../common/ThemedView";
import SafetyPlanSection from "./SafetyPlanSection";
import { Medication } from "../../types/Medication";
import { FormatUtils } from "../../utils/formatUtils";

interface WeeklyScheduleProps {
  medications: Medication[];
}

export default function WeeklySchedule({ medications }: WeeklyScheduleProps) {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  // Get all medications with schedule info for each day
  const getMedicationsForDay = (dayIndex: number) => {
    return medications.map(med => {
      const schedule = med.schedule;
      let times: string[] = [];

      if (schedule?.isAsNeeded) {
        times = ["As needed"];
      } else if (schedule?.daysOfWeek?.includes((dayIndex + 1) % 7) && schedule?.doseTimes) {
        times = schedule.doseTimes.map(time => 
          FormatUtils.formatTime(time.hour, time.minute)
        );
      } else if (schedule?.frequency === 'daily' && schedule?.doseTimes) {
        // Daily medications appear every day
        times = schedule.doseTimes.map(time => 
          FormatUtils.formatTime(time.hour, time.minute)
        );
      }

      return {
        medication: med,
        times: times
      };
    }).filter(item => item.times.length > 0); // Only include meds that have times for this day
  };

  const renderCalendarContent = () => (
    <ThemedView style={styles.calendarContainer} lightColor="transparent" darkColor="transparent">
      {/* Days of week header */}
      <ThemedView style={styles.daysHeader} lightColor="#f8f9fa" darkColor="#404040">
        {daysOfWeek.map((day) => (
          <ThemedView key={day} style={styles.dayHeaderCell} lightColor="transparent" darkColor="transparent">
            <ThemedText style={styles.dayHeaderText} lightColor="#333" darkColor="#fff">
              {day}
            </ThemedText>
          </ThemedView>
        ))}
      </ThemedView>

      {/* Calendar grid */}
      <ThemedView style={styles.calendarGrid} lightColor="transparent" darkColor="transparent">
        {daysOfWeek.map((day, dayIndex) => {
          const dayMedications = getMedicationsForDay(dayIndex);
          
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
                      medIndex % 2 === 0 && styles.medicationEntryEven
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
                <ThemedView style={styles.emptyDay} lightColor="transparent" darkColor="transparent">
                  <ThemedText style={styles.emptyDayText} lightColor="#ccc" darkColor="#666">
                    —
                  </ThemedText>
                </ThemedView>
              )}
            </ThemedView>
          );
        })}
      </ThemedView>
    </ThemedView>
  );

  const scheduleContent = Platform.OS === 'web' ? (
    // Web: Direct rendering, no scroll
    renderCalendarContent()
  ) : (
    // Mobile: Wrapped in horizontal scroll
    <ScrollView 
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
    >
      {renderCalendarContent()}
    </ScrollView>
  );

  return (
    <SafetyPlanSection
      title="Weekly Medication Schedule"
      content={medications.length > 0 ? scheduleContent : "No medications to schedule."}
      isEmpty={medications.length === 0}
    />
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  calendarContainer: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    ...(Platform.OS !== 'web' && { minWidth: 700 }),
  },
  daysHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#e0e0e0",
  },
  dayHeaderCell: {
    ...(Platform.OS === 'web' ? { flex: 1 } : { width: 100 }),
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
    ...(Platform.OS === 'web' ? { flex: 1 } : { width: 100 }),
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
  medicationEntryEven: {
    // Background handled by ThemedView
  },
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