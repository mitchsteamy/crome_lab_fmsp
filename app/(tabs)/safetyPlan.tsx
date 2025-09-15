import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Platform, ScrollView, Share, StyleSheet } from "react-native";
import { ThemedView } from "../../components/common/ThemedView";
import { ThemedText } from "../../components/common/ThemedText";
import ExportControls from "../../components/safetyPlan/ExportControls";
import SafetyPlanHeader from "../../components/safetyPlan/SafetyPlanHeader";
import MedicationTable from "../../components/safetyPlan/MedicationTable";
import BenefitsAndEffects from "../../components/safetyPlan/BenefitsAndEffects";
import InteractionsSection from "../../components/safetyPlan/Interactions";
import WeeklySchedule from "../../components/safetyPlan/WeeklySchedule";
import StorageAndDisposal from "../../components/safetyPlan/StorageAndDisposal";
import CommunicationSection from "../../components/safetyPlan/Communication";
import EmptyState from "../../components/safetyPlan/EmptyState";
import { StorageService } from "../../services/StorageService";
import { Medication } from "../../types/Medication";
import { DateUtils } from "../../utils/dateUtils";

export default function SafetyPlanTab() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMedications: 0,
    activeMedications: 0,
    expiredMedications: 0,
    patients: [] as string[],
  });

  // Load data when component mounts
  useEffect(() => {
    loadSafetyPlanData();
  }, []);

  // Reload data when screen comes into focus (after adding/editing medications)
  useFocusEffect(
    useCallback(() => {
      loadSafetyPlanData();
    }, [])
  );

  const loadSafetyPlanData = async () => {
    try {
      setLoading(true);
      const [medicationsData, statsData] = await Promise.all([
        StorageService.getActiveMedications(),
        StorageService.getDatabaseStats(),
      ]);

      setMedications(medicationsData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading safety plan data:", error);
      Alert.alert("Error", "Failed to load safety plan data");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const safetyPlanData = await StorageService.exportAllData();
      await Share.share({
        message: safetyPlanData,
        title: "Medication Safety Plan",
      });
    } catch (error) {
      Alert.alert("Export Error", "Failed to export safety plan");
    }
  };

  const handleEmailShare = async () => {
    try {
      const safetyPlanData = await StorageService.exportAllData();
      const subject = `Medication Safety Plan - ${DateUtils.formatDate(
        new Date(),
        "short"
      )}`;

      await Share.share({
        message: `Medication Safety Plan\n\nGenerated on: ${DateUtils.formatDate(
          new Date(),
          "long"
        )}\n\n${safetyPlanData}`,
        title: subject,
      });
    } catch (error) {
      Alert.alert("Share Error", "Failed to share safety plan");
    }
  };

  if (loading) {
    return (
      <ThemedView
        style={styles.container}
        lightColor="#f5f5f5"
        darkColor="#1f1f1f"
      >
        <ThemedView
          style={styles.loadingContainer}
          lightColor="transparent"
          darkColor="transparent"
        >
          <ThemedText
            style={styles.loadingText}
            lightColor="#666"
            darkColor="#999"
          >
            Loading safety plan...
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  if (medications.length === 0) {
    return (
      <ThemedView
        style={styles.container}
        lightColor="#f5f5f5"
        darkColor="#1f1f1f"
      >
        <SafetyPlanHeader stats={stats} />
        <EmptyState />
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={styles.container}
      lightColor="#f5f5f5"
      darkColor="#1f1f1f"
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <SafetyPlanHeader stats={stats} />
        <MedicationTable medications={medications} />
        <WeeklySchedule medications={medications} />
        <BenefitsAndEffects medications={medications} />
        <InteractionsSection medications={medications} />
        <StorageAndDisposal medications={medications} />
        <CommunicationSection medications={medications} />

        <ThemedView
          style={styles.footer}
          lightColor="transparent"
          darkColor="transparent"
        >
          <ThemedText
            style={styles.footerText}
            lightColor="#666"
            darkColor="#999"
          >
            This plan was generated on{" "}
            {DateUtils.formatDate(new Date(), "datetime")}
          </ThemedText>
        </ThemedView>
      </ScrollView>

      <ExportControls
        onExportPDF={handleExportPDF}
        onEmailShare={handleEmailShare}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === "web" ? 0 : 48,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
  },
  footer: {
    padding: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
  },
});
