import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedView } from "../common/ThemedView";
import { ThemedText } from "../common/ThemedText";

interface QuestionInputProps {
  questionId: string;
  type: string;
  question: string;
  options?: string[];
  placeholder?: string;
  helpText?: string;
  required: boolean;
  value: any;
  onValueChange: (value: any) => void;
  answers?: Record<string, any>;
}

interface TimeEntry {
  hour: number;
  minute: number;
  id: string;
}

export default function QuestionInput({
  questionId,
  type,
  question,
  options,
  placeholder,
  helpText,
  required,
  value,
  onValueChange,
  answers = {},
}: QuestionInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [editingTimeIndex, setEditingTimeIndex] = useState<number | null>(null);

  const formatOptionText = (option: string) => {
    const formatMap: Record<string, string> = {
      "over-the-counter": "Over the Counter",
      "prescription": "Prescription",
      "by mouth": "By mouth / Swallowed",
      "under tongue": "Under the tongue",
      "between cheek and gums": "Between cheek and gums",
      "inhaled into lungs": "Inhaled into lungs",
      "rubbed on skin": "Applied to skin or hair",
      "eye": "Placed in eye",
      "ear": "Placed in ear canal",
      "nasal": "Placed in nostril/s",
    };

    return formatMap[option] || 
           (option.charAt(0).toUpperCase() + option.slice(1).replace(/-/g, " "));
  };

  const computeScheduleTimes = (): TimeEntry[] => {
    if (!answers.first_dose_time || !answers.daily_frequency) {
      return [];
    }

    const firstDoseTime = new Date(answers.first_dose_time);
    const dailyFreq = answers.daily_frequency;
    const intervalHours = parseInt(answers.interval_hours) || 4;

    const times: TimeEntry[] = [];
    const firstHour = firstDoseTime.getHours();
    const firstMinute = firstDoseTime.getMinutes();

    if (dailyFreq === "every-x-hours") {
      // 24-hour schedule with specified intervals
      let currentHour = firstHour;
      let currentMinute = firstMinute;

      for (let i = 0; i < 24 / intervalHours; i++) {
        times.push({ 
          hour: currentHour, 
          minute: currentMinute, 
          id: `dose-${i}` 
        });
        currentHour = (currentHour + intervalHours) % 24;
      }
    } else {
      // Fixed times with last dose at 11pm
      times.push({ 
        hour: firstHour, 
        minute: firstMinute, 
        id: 'dose-0' 
      });

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
          times.push({ 
            hour, 
            minute, 
            id: `dose-${i}` 
          });
        }
      }
    }

    return times;
  };

  // Initialize time list with computed times if not already set
  const initializeTimeList = (): TimeEntry[] => {
    if (Array.isArray(value) && value.length > 0) {
      return value;
    }
    return computeScheduleTimes();
  };

  // Helper function to format date for web input
  const formatDateForWeb = (date: Date | string | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  };

  // Helper function to format time for web input
  const formatTimeForWeb = (date: Date | string | null) => {
    if (!date) return "";
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`; // Returns HH:MM format
  };

  // Helper function to convert web date input to ISO string
  const handleWebDateChange = (dateString: string) => {
    if (!dateString) {
      onValueChange(null);
      return;
    }
    const date = new Date(dateString + 'T00:00:00.000Z');
    onValueChange(date.toISOString());
  };

  // Helper function to convert web time input to ISO string
  const handleWebTimeChange = (timeString: string) => {
    if (!timeString) {
      onValueChange(null);
      return;
    }
    const [hours, minutes] = timeString.split(':');
    const date = value ? new Date(value) : new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    onValueChange(date.toISOString());
  };

  // Helper function to update a specific time in the time list
  const updateTimeInList = (index: number, newHour: number, newMinute: number) => {
    const timeList = initializeTimeList();
    const updatedList = [...timeList];
    updatedList[index] = {
      ...updatedList[index],
      hour: newHour,
      minute: newMinute
    };
    onValueChange(updatedList);
    setEditingTimeIndex(null);
  };

  // Helper function to create a Date object for time picker
  const createTimeDate = (hour: number, minute: number) => {
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(0);
    return date;
  };

  // Helper function to handle web time input for time list
  const handleWebTimeListChange = (index: number, timeString: string) => {
    if (!timeString) return;
    const [hours, minutes] = timeString.split(':');
    updateTimeInList(index, parseInt(hours, 10), parseInt(minutes, 10));
  };

  const renderTextInput = () => (
    <TextInput
      style={[styles.textInput, isFocused && styles.textInputFocused]}
      value={value || ""}
      onChangeText={onValueChange}
      placeholder={placeholder}
      placeholderTextColor="#999"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );

  const renderTextArea = () => (
    <TextInput
      style={[
        styles.textInput,
        styles.textArea,
        isFocused && styles.textInputFocused,
      ]}
      value={value || ""}
      onChangeText={onValueChange}
      placeholder={placeholder}
      placeholderTextColor="#999"
      multiline
      numberOfLines={4}
      textAlignVertical="top"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );

  const renderDatePicker = () => {
    if (Platform.OS === 'web') {
      // Web implementation using native HTML input
      return (
        <input
          type="date"
          value={formatDateForWeb(value)}
          onChange={(e) => handleWebDateChange(e.target.value)}
          style={styles.webDateInput}
          placeholder={placeholder}
        />
      );
    }

    // Mobile implementation using DateTimePicker
    return (
      <ThemedView
        style={styles.pickerContainer}
        lightColor="transparent"
        darkColor="transparent"
      >
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <ThemedText style={styles.pickerButtonText}>
            {value ? new Date(value).toLocaleDateString() : "Select Date"}
          </ThemedText>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={value ? new Date(value) : new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === "ios");
              if (selectedDate) {
                onValueChange(selectedDate.toISOString());
              }
            }}
          />
        )}
      </ThemedView>
    );
  };

  const renderTimePicker = () => {
    if (Platform.OS === 'web') {
      // Web implementation using native HTML input
      return (
        <input
          type="time"
          value={formatTimeForWeb(value)}
          onChange={(e) => handleWebTimeChange(e.target.value)}
          style={styles.webTimeInput}
          placeholder={placeholder}
        />
      );
    }

    // Mobile implementation using DateTimePicker
    return (
      <ThemedView
        style={styles.pickerContainer}
        lightColor="transparent"
        darkColor="transparent"
      >
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowTimePicker(true)}
        >
          <ThemedText style={styles.pickerButtonText}>
            {value
              ? new Date(value).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Select Time"}
          </ThemedText>
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            value={value ? new Date(value) : new Date()}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedTime) => {
              setShowTimePicker(Platform.OS === "ios");
              if (selectedTime) {
                onValueChange(selectedTime.toISOString());
              }
            }}
          />
        )}
      </ThemedView>
    );
  };

  const renderTimeList = () => {
    const timeList = initializeTimeList();

    if (timeList.length === 0) {
      return (
        <ThemedView style={styles.timeListEmpty}>
          <ThemedText style={styles.timeListEmptyText}>
            Complete the previous questions to see your medicine schedule
          </ThemedText>
        </ThemedView>
      );
    }

    return (
      <ThemedView style={styles.timeListContainer} darkColor="#222" lightColor="#fff">
        <ThemedText style={styles.timeListTitle}>
          Daily Medication Times:
        </ThemedText>
        
        {timeList.map((timeEntry, index) => (
          <ThemedView key={timeEntry.id} style={styles.timeListItem} darkColor="#222" lightColor="#fff">
            <ThemedText style={styles.timeListLabel}>
              Dose {index + 1}:
            </ThemedText>
            
            {Platform.OS === 'web' ? (
              <input
                type="time"
                value={`${timeEntry.hour.toString().padStart(2, '0')}:${timeEntry.minute.toString().padStart(2, '0')}`}
                onChange={(e) => handleWebTimeListChange(index, e.target.value)}
                style={styles.webTimeListInput}
              />
            ) : (
              <TouchableOpacity
                style={styles.timeListButton}
                onPress={() => setEditingTimeIndex(index)}
              >
                <ThemedText style={styles.timeListButtonText}>
                  {`${timeEntry.hour.toString().padStart(2, '0')}:${timeEntry.minute.toString().padStart(2, '0')}`}
                </ThemedText>
              </TouchableOpacity>
            )}
          </ThemedView>
        ))}

        {Platform.OS !== 'web' && editingTimeIndex !== null && (
          <DateTimePicker
            value={createTimeDate(
              timeList[editingTimeIndex].hour,
              timeList[editingTimeIndex].minute
            )}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedTime) => {
              if (Platform.OS === "android") {
                setEditingTimeIndex(null);
              }
              if (selectedTime && editingTimeIndex !== null) {
                updateTimeInList(
                  editingTimeIndex,
                  selectedTime.getHours(),
                  selectedTime.getMinutes()
                );
              }
              if (Platform.OS === "ios") {
                // On iOS, we keep the picker open until user dismisses
              }
            }}
          />
        )}
      </ThemedView>
    );
  };

  const renderSelect = () => (
    <ThemedView
      style={styles.selectContainer}
      lightColor="transparent"
      darkColor="transparent"
    >
      {options?.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.selectOption,
            value === option && styles.selectOptionSelected,
          ]}
          onPress={() => onValueChange(option)}
          activeOpacity={0.7}
        >
          <ThemedView
            style={[
              styles.selectOptionCircle,
              value === option && styles.selectOptionCircleSelected,
            ]}
          />
          <ThemedText
            style={[
              styles.selectOptionText,
              value === option && styles.selectOptionTextSelected,
            ]}
            lightColor="#333"
            darkColor="#999"
          >
            {formatOptionText(option)}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </ThemedView>
  );

  const renderMultiSelect = () => {
    const selectedValues = Array.isArray(value) ? value : [];

    return (
      <ThemedView
        style={styles.selectContainer}
        lightColor="transparent"
        darkColor="transparent"
      >
        {options?.map((option) => {
          const isSelected = selectedValues.includes(option);

          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.selectOption,
                isSelected && styles.selectOptionSelected,
              ]}
              onPress={() => {
                const newValues = isSelected
                  ? selectedValues.filter((v) => v !== option)
                  : [...selectedValues, option];
                onValueChange(newValues);
              }}
              activeOpacity={0.7}
            >
              <ThemedView
                style={[
                  styles.checkboxContainer,
                  isSelected && styles.checkboxSelected,
                ]}
              >
                {isSelected && (
                  <ThemedText style={styles.checkmark}>✓</ThemedText>
                )}
              </ThemedView>
              <ThemedText
                style={[
                  styles.selectOptionText,
                  isSelected && styles.selectOptionTextSelected,
                ]}
                lightColor="#333"
                darkColor="#999"
              >
                {option}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </ThemedView>
    );
  };

  const renderInput = () => {
    switch (type) {
      case "text":
        return renderTextInput();
      case "textarea":
        return renderTextArea();
      case "select":
        return renderSelect();
      case "multiselect":
        return renderMultiSelect();
      case "date":
        return renderDatePicker();
      case "time":
        return renderTimePicker();
      case "time-list":
        return renderTimeList();
      default:
        return renderTextInput();
    }
  };

  return (
    <ThemedView
      style={styles.inputContainer}
      lightColor="transparent"
      darkColor="transparent"
    >
      {renderInput()}
      {helpText && (
        <ThemedText style={styles.helpText} lightColor="#666" darkColor="#999">
          {helpText}
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  textInputFocused: {
    borderColor: "#f78b33",
    shadowColor: "#f78b33",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 16,
    textAlignVertical: "top",
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
  },
  pickerButtonText: {
    fontSize: 16,
    color: "#333",
  },
  webDateInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 32,
    backgroundColor: "#fff",
    color: "#333",
    width: "100%",
    boxSizing: "border-box" as any,
    outline: "none",
    fontFamily: "inherit",
  },
  webTimeInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 32,
    backgroundColor: "#fff",
    color: "#333",
    width: "100%",
    boxSizing: "border-box" as any,
    outline: "none",
    fontFamily: "inherit",
  },
  timeListContainer: {
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#f78b33",
  },
  timeListEmpty: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  timeListEmptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  timeListTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#f78b33",
  },
  timeListItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  timeListLabel: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  timeListButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 80,
    alignItems: "center",
  },
  timeListButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  webTimeListInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
    minWidth: 80,
    textAlign: "center",
    outline: "none",
    fontFamily: "inherit",
  },
  selectContainer: {
    gap: 12,
  },
  selectOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  selectOptionSelected: {
    borderColor: "#f78b33",
    backgroundColor: "#fff8f5",
  },
  selectOptionCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    marginRight: 12,
  },
  selectOptionCircleSelected: {
    borderColor: "#f78b33",
    backgroundColor: "#f78b33",
  },
  checkboxContainer: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    borderColor: "#f78b33",
    backgroundColor: "#f78b33",
  },
  checkmark: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  selectOptionText: {
    fontSize: 16,
    flex: 1,
  },
  selectOptionTextSelected: {
    color: "#f78b33",
    fontWeight: "500",
  },
  helpText: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
});