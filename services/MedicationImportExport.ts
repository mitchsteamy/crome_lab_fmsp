import { Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy'; // Updated to use legacy API
import * as Sharing from 'expo-sharing';
import { Medication } from '../types/Medication';
import { StorageService } from './StorageService';

export interface FMSPExport {
  version: string;
  exportDate: string;
  medicationCount: number;
  medications: Medication[];
}

export class MedicationImportExport {
  private static readonly EXPORT_VERSION = '1.0';

  /**
   * Export all medications as JSON
   */
  static async exportMedications(medications: Medication[]): Promise<void> {
    const exportData: FMSPExport = {
      version: this.EXPORT_VERSION,
      exportDate: new Date().toISOString(),
      medicationCount: medications.length,
      medications: medications,
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const fileName = `fmsp_export_${new Date().toISOString().split('T')[0]}.json`;

    if (Platform.OS === 'web') {
      // Web: Download file
      this.downloadJSON(jsonString, fileName);
    } else {
      // Mobile: Share file
      await this.shareJSON(jsonString, fileName);
    }
  }

  /**
   * Import medications from JSON file
   */
  static async importMedications(): Promise<{
    success: boolean;
    medications?: Medication[];
    error?: string;
  }> {
    try {
      if (Platform.OS === 'web') {
        return await this.importFromWeb();
      } else {
        return await this.importFromMobile();
      }
    } catch (error) {
      console.error('Import error:', error);
      return {
        success: false,
        error: `Failed to import medications: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Web: Download JSON file
   */
  private static downloadJSON(jsonString: string, fileName: string): void {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Mobile: Share JSON file
   */
  private static async shareJSON(jsonString: string, fileName: string): Promise<void> {
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(fileUri, jsonString);
    
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      throw new Error('Sharing is not available on this device');
    }
  }

  /**
   * Web: Import from file picker
   */
  private static async importFromWeb(): Promise<{
    success: boolean;
    medications?: Medication[];
    error?: string;
  }> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,application/json';
      
      input.onchange = async (e: any) => {
        const file = e.target.files?.[0];
        if (!file) {
          resolve({ success: false, error: 'No file selected' });
          return;
        }

        try {
          const text = await file.text();
          const result = this.validateAndParseJSON(text);
          resolve(result);
        } catch (error) {
          console.error('Web import error:', error);
          resolve({
            success: false,
            error: 'Invalid file format. Please select a valid FMSP JSON file.',
          });
        }
      };

      input.click();
    });
  }

  /**
   * Mobile: Import from document picker
   */
  private static async importFromMobile(): Promise<{
    success: boolean;
    medications?: Medication[];
    error?: string;
  }> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return { success: false, error: 'Import cancelled' };
      }

      console.log('Document picker result:', result);
      
      if (!result.assets || result.assets.length === 0) {
        return { success: false, error: 'No file selected' };
      }

      const fileUri = result.assets[0].uri;
      console.log('Reading file from URI:', fileUri);
      
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      console.log('File read successfully, length:', fileContent.length);
      
      return this.validateAndParseJSON(fileContent);
    } catch (error) {
      console.error('Mobile import error:', error);
      return {
        success: false,
        error: `Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
      };
    }
  }

  /**
   * Validate and parse JSON file
   */
  private static validateAndParseJSON(jsonString: string): {
    success: boolean;
    medications?: Medication[];
    error?: string;
  } {
    try {
      const data: FMSPExport = JSON.parse(jsonString);

      // Validate structure
      if (!data.medications || !Array.isArray(data.medications)) {
        return {
          success: false,
          error: 'Invalid file format: medications array not found',
        };
      }

      if (data.medications.length === 0) {
        return {
          success: false,
          error: 'The selected file contains no medications',
        };
      }

      // Validate each medication has required fields
      const hasRequiredFields = data.medications.every(
        (med) => med.brandName && med.dosageAmount && med.dosageUnit
      );

      if (!hasRequiredFields) {
        return {
          success: false,
          error: 'Invalid file format: medications missing required fields',
        };
      }

      // Convert date strings back to Date objects
      const medications = data.medications.map((med) => ({
        ...med,
        startDate: med.startDate ? new Date(med.startDate) : new Date(),
        endDate: med.endDate ? new Date(med.endDate) : undefined,
        createdAt: med.createdAt ? new Date(med.createdAt) : new Date(),
        updatedAt: med.updatedAt ? new Date(med.updatedAt) : new Date(),
        storage: med.storage
          ? {
              ...med.storage,
              expirationDate: med.storage.expirationDate
                ? new Date(med.storage.expirationDate)
                : undefined,
            }
          : undefined,
      }));

      console.log(`Successfully parsed ${medications.length} medications`);
      return {
        success: true,
        medications,
      };
    } catch (error) {
      console.error('JSON parsing error:', error);
      return {
        success: false,
        error: 'Invalid JSON file. Please select a valid FMSP export file.',
      };
    }
  }

  /**
   * Merge imported medications with existing ones
   * Generates new IDs for imported medications to avoid conflicts
   */
  static async mergeImportedMedications(
    importedMedications: Medication[]
  ): Promise<{ added: number; skipped: number }> {
    const existingMedications = await StorageService.retrieveMedications();
    
    let added = 0;
    let skipped = 0;

    for (const med of importedMedications) {
      // Generate new ID for imported medication
      const newMed: Medication = {
        ...med,
        id: `med_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      try {
        await StorageService.storeMedication(newMed);
        added++;
        // Small delay to ensure unique IDs
        await new Promise(resolve => setTimeout(resolve, 10));
      } catch (error) {
        console.error('Failed to save imported medication:', error);
        skipped++;
      }
    }

    return { added, skipped };
  }
}