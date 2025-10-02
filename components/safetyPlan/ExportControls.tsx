import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as MailComposer from 'expo-mail-composer';
import { ThemedView } from "../common/ThemedView";
import { ThemedText } from "../common/ThemedText";
import { Medication } from "../../types/Medication";
import { SafetyPlanPDFTemplate } from "../../services/SafetyPlanPDFTemplate";
import { DateUtils } from "../../utils/dateUtils";

interface SafetyPlanStats {
  totalMedications: number;
  activeMedications: number;
  expiredMedications: number;
  patients: string[];
}

interface ExportControlsProps {
  medications: Medication[];
  stats: SafetyPlanStats;
}

export default function ExportControls({
  medications,
  stats,
}: ExportControlsProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const generatePDFForWeb = async (): Promise<void> => {
    const htmlContent = SafetyPlanPDFTemplate.generateHTML(medications, stats);
    const currentDate = DateUtils.formatDate(new Date(), "short").replace(/\//g, "-");
    const filename = `family-medicine-plan-${currentDate}.pdf`;
    
    // Create a new window with our content and trigger print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load, then trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 100);
      };
    } else {
      // Fallback: create a blob and download link
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename.replace('.pdf', '.html');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      Alert.alert(
        "Download Complete", 
        "HTML file downloaded. You can open it in your browser and print to PDF."
      );
    }
  };

  const generatePDFForMobile = async (): Promise<string | null> => {
    try {
      const htmlContent = SafetyPlanPDFTemplate.generateHTML(medications, stats);
      
      const { uri } = await printToFileAsync({
        html: htmlContent,
        base64: false,
        margins: {
          left: 20,
          top: 20,
          right: 20,
          bottom: 20,
        },
      });

      return uri;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to create PDF');
    }
  };

  const handleShareExport = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      if (medications.length === 0) {
        Alert.alert(
          "No Medicines Yet", 
          "Add some medicines to your plan before creating a PDF."
        );
        return;
      }

      if (Platform.OS === 'web') {
        await generatePDFForWeb();
      } else {
        // Mobile: Check if email is available first
        const isEmailAvailable = await MailComposer.isAvailableAsync();
        
        if (isEmailAvailable) {
          // Show options: Email or Save/Share
          Alert.alert(
            "Share Your Plan",
            "How would you like to share your family medicine plan?",
            [
              { text: "Cancel", style: "cancel" },
              { 
                text: "Email PDF", 
                onPress: async () => {
                  const pdfUri = await generatePDFForMobile();
                  if (pdfUri) {
                    await sendEmail(pdfUri);
                  }
                }
              },
              { 
                text: "Save/Share", 
                onPress: async () => {
                  const pdfUri = await generatePDFForMobile();
                  if (pdfUri) {
                    await shareFile(pdfUri);
                  }
                }
              }
            ]
          );
        } else {
          // No email available, just generate and share
          const pdfUri = await generatePDFForMobile();
          if (pdfUri) {
            await shareFile(pdfUri);
          }
        }
      }
    } catch (error) {
      console.error('Process error:', error);
      Alert.alert(
        "Error", 
        "Failed to create PDF. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const sendEmail = async (pdfUri: string) => {
    try {
      // Get unique patient names, with "Myself" first
      const patientNames = [...new Set(medications.map(med => med.patientName))];
      const sortedNames = patientNames.sort((a, b) => {
        if (a === "Myself") return -1;
        if (b === "Myself") return 1;
        return a.localeCompare(b);
      });
      
      const patientNameList = sortedNames.length > 1 
        ? `${sortedNames.slice(0, -1).join(', ')} and ${sortedNames[sortedNames.length - 1]}`
        : sortedNames[0] || 'Patient';

      await MailComposer.composeAsync({
        subject: `Family Medicine Safety Plan - ${patientNameList}`,
        body: `Please find attached the family medicine safety plan for ${patientNameList}.\n\nThis plan includes:\n• ${medications.length} medicine${medications.length !== 1 ? 's' : ''}\n• When and how to take each medicine\n• How to store and dispose of medicines\n• Emergency contact information\n\nCreated on ${DateUtils.formatDate(new Date(), "long")}\n\nPlease keep this information where you can find it easily for emergencies.`,
        attachments: [pdfUri],
        isHtml: false,
      });
    } catch (error) {
      console.error('Email error:', error);
      Alert.alert("Email Error", "Failed to compose email.");
    }
  };

  const shareFile = async (pdfUri: string) => {
    try {
      const currentDate = DateUtils.formatDate(new Date(), "short").replace(/\//g, "-");
      const filename = `family-medicine-plan-${currentDate}.pdf`;

      await shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Family Medicine Plan',
        UTI: 'com.adobe.pdf',
      });

      Alert.alert(
        "PDF Created", 
        `Your family medicine plan has been created!\n\nFile: ${filename}`
      );
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert("Share Error", "Failed to share PDF.");
    }
  };

  return (
    <ThemedView style={styles.container} lightColor="#fff" darkColor="#1f1f1f">
      <ThemedView
        style={styles.topBorder}
        lightColor="#e0e0e0"
        darkColor="#404040"
      />
      
      <TouchableOpacity
        style={[
          styles.button,
          isProcessing && styles.buttonDisabled
        ]}
        onPress={handleShareExport}
        activeOpacity={0.8}
        disabled={isProcessing}
      >
        <ThemedText
          type="defaultSemiBold"
          style={[
            styles.buttonText,
            isProcessing && styles.buttonTextDisabled
          ]}
          lightColor="#f78b33"
          darkColor="#f78b33"
        >
          {isProcessing ? "Creating PDF..." : Platform.OS === 'web' ? "Save as PDF" : "Share PDF"}
        </ThemedText>
      </TouchableOpacity>

      {medications.length > 0 && (
        <ThemedView 
          style={styles.info}
          lightColor="transparent"
          darkColor="transparent"
        >
          <ThemedText 
            style={styles.infoText}
            lightColor="#666"
            darkColor="#999"
          >
            {Platform.OS === 'web' 
              ? `PDF will include ${medications.length} medicine${medications.length !== 1 ? 's' : ''} - use browser print to save as PDF`
              : `PDF will include a complete plan for ${medications.length} medicine${medications.length !== 1 ? 's' : ''}`
            }
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  topBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#f78b33",
    backgroundColor: "transparent",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextDisabled: {
    opacity: 0.6,
  },
  info: {
    marginTop: 8,
    alignItems: "center",
  },
  infoText: {
    fontSize: 11,
    textAlign: "center",
  },
});