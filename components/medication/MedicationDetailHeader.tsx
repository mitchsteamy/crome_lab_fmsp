import { ThemedText } from "@/components/common/ThemedText";
import { ThemedView } from "@/components/common/ThemedView";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";

interface MedicationDetailHeaderProps {
  title: string;
  onBack?: () => void;
}

export default function MedicationDetailHeader({
  title,
  onBack,
}: MedicationDetailHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (Platform.OS === "web") {
      router.push("/");
    } else {
      router.back();
    }
  };
  

  return (
    <ThemedView style={styles.header} lightColor="#fff" darkColor="#1f1f1f">
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <ThemedText type="link">← Back</ThemedText>
      </TouchableOpacity>
      <ThemedText type="subtitle" numberOfLines={1}>
        {title}
      </ThemedText>
      <ThemedView
        style={styles.headerSpacer}
        lightColor="transparent"
        darkColor="transparent"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginTop: Platform.OS === "android" ? 48 : 0,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    minWidth: 60,
  },
  headerSpacer: {
    minWidth: 0,
  },
});