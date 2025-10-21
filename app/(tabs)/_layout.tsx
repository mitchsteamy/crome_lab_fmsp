import { Tabs, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform } from "react-native";

import { HapticTab } from "@/components/common/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import AddMethodSelector from "@/components/index/AddMedicationSelector";
import { MedicationImportExport } from "@/services/MedicationImportExport";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [showAddMethodSelector, setShowAddMethodSelector] = useState(false);

  const handleAddTab = () => {
    setShowAddMethodSelector(true);
  };

  const handleManualAdd = () => {
    setShowAddMethodSelector(false);
    router.push("/add");
  };

  const handleImport = async () => {
    setShowAddMethodSelector(false);

    try {
      const result = await MedicationImportExport.importMedications();

      if (result.success && result.medications) {
        const { added, skipped } =
          await MedicationImportExport.mergeImportedMedications(
            result.medications
          );

        const message = `Successfully imported ${added} medicine${
          added !== 1 ? "s" : ""
        }${
          skipped > 0
            ? `. ${skipped} medicine${skipped !== 1 ? "s" : ""} skipped.`
            : "."
        }`;

        if (Platform.OS === "web") {
          alert(message);
        } else {
          Alert.alert("Import Successful", message);
        }

        // Refresh the medications list
        router.push("/(tabs)");
      } else if (result.error) {
        if (Platform.OS === "web") {
          alert(result.error);
        } else {
          Alert.alert("Import Failed", result.error);
        }
      }
    } catch (error) {
      console.error("Import error:", error);
      if (Platform.OS === "web") {
        alert("Failed to import medicines");
      } else {
        Alert.alert("Error", "Failed to import medicines");
      }
    }
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: "absolute",
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "My Medicines",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="medication.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: "Add Medicine",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="add.circle" color={color} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              handleAddTab();
            },
          }}
        />
        <Tabs.Screen
          name="safetyPlan"
          options={{
            title: "Safety Plan",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="plan.fill" color={color} />
            ),
          }}
        />
      </Tabs>

      <AddMethodSelector
        visible={showAddMethodSelector}
        onClose={() => setShowAddMethodSelector(false)}
        onManual={handleManualAdd}
        onImport={handleImport}
      />
    </>
  );
}
