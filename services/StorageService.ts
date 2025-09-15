import AsyncStorage from '@react-native-async-storage/async-storage';
import { Medication } from '../types/Medication';

export class StorageService {
  private static readonly STORAGE_KEYS = {
    MEDICATIONS: '@fmsp_medications',
    APP_SETTINGS: '@fmsp_app_settings',
    MEDICATION_INDEX: '@fmsp_medication_index', // For faster searches
  } as const;

  /**
   * Initialize the storage service
   */
  static async initialize(): Promise<void> {
    try {
      // Just verify AsyncStorage is working
      await AsyncStorage.getItem(this.STORAGE_KEYS.MEDICATIONS);
      console.log('AsyncStorage initialized successfully');
      
      // Run any cleanup tasks
      await this.cleanupExpiredMedications();
    } catch (error) {
      console.error('Error initializing storage:', error);
      throw new Error('Failed to initialize storage');
    }
  }

  /**
   * Generic storage methods
   */
  private static async storeData<T>(key: string, data: T): Promise<void> {
    try {
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonData);
    } catch (error) {
      console.error(`Error storing data for key ${key}:`, error);
      throw new Error(`Failed to store data: ${error}`);
    }
  }

  private static async retrieveData<T>(key: string): Promise<T | null> {
    try {
      const jsonData = await AsyncStorage.getItem(key);
      if (jsonData === null) {
        return null;
      }
      return JSON.parse(jsonData) as T;
    } catch (error) {
      console.error(`Error retrieving data for key ${key}:`, error);
      return null;
    }
  }

  private static async removeData(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
      throw new Error(`Failed to remove data: ${error}`);
    }
  }

  /**
   * Helper method to safely convert date to ISO string
   */
  private static safeDateToISO(date: any): string | null {
    if (!date) return null;
    try {
      if (date instanceof Date) {
        return date.toISOString();
      }
      if (typeof date === 'string') {
        return new Date(date).toISOString();
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Helper method to safely convert ISO string to Date
   */
  private static safeISOToDate(isoString: any): Date | undefined {
    if (!isoString) return undefined;
    try {
      const date = new Date(isoString);
      return isNaN(date.getTime()) ? undefined : date;
    } catch {
      return undefined;
    }
  }

  /**
   * Medication storage methods
   */
  static async storeMedications(medications: Medication[]): Promise<void> {
    const medicationsWithDates = medications.map(med => ({
      ...med,
      createdAt: this.safeDateToISO(med.createdAt),
      updatedAt: this.safeDateToISO(med.updatedAt),
      startDate: this.safeDateToISO(med.startDate),
      endDate: this.safeDateToISO(med.endDate),
      storage: med.storage ? {
        ...med.storage,
        expirationDate: this.safeDateToISO(med.storage.expirationDate),
      } : undefined,
    }));

    await this.storeData(this.STORAGE_KEYS.MEDICATIONS, medicationsWithDates);
    await this.updateMedicationIndex(medications);
  }

  static async retrieveMedications(): Promise<Medication[]> {
    const medications = await this.retrieveData<any[]>(this.STORAGE_KEYS.MEDICATIONS);
    if (!medications) {
      return [];
    }

    // Convert date strings back to Date objects
    return medications.map(med => ({
      ...med,
      createdAt: this.safeISOToDate(med.createdAt) || new Date(),
      updatedAt: this.safeISOToDate(med.updatedAt) || new Date(),
      startDate: this.safeISOToDate(med.startDate) || new Date(),
      endDate: this.safeISOToDate(med.endDate),
      storage: med.storage ? {
        ...med.storage,
        expirationDate: this.safeISOToDate(med.storage.expirationDate),
      } : undefined,
    })) as Medication[];
  }

  static async storeMedication(medication: Medication): Promise<void> {
    const medications = await this.retrieveMedications();
    const existingIndex = medications.findIndex(med => med.id === medication.id);
    
    const medicationWithDates = {
      ...medication,
      updatedAt: new Date(),
    };

    if (existingIndex >= 0) {
      medications[existingIndex] = medicationWithDates;
    } else {
      medications.push(medicationWithDates);
    }

    await this.storeMedications(medications);
  }

  static async deleteMedication(medicationId: string): Promise<void> {
    const medications = await this.retrieveMedications();
    const filteredMedications = medications.filter(med => med.id !== medicationId);
    await this.storeMedications(filteredMedications);
  }

  static async getMedication(medicationId: string): Promise<Medication | null> {
    const medications = await this.retrieveMedications();
    return medications.find(med => med.id === medicationId) || null;
  }

  /**
   * Advanced queries (implemented with in-memory filtering for AsyncStorage)
   */
  static async getMedicationsByPatient(patientName: string): Promise<Medication[]> {
    const medications = await this.retrieveMedications();
    return medications.filter(med => med.patientName === patientName);
  }

  static async getActiveMedications(): Promise<Medication[]> {
    const medications = await this.retrieveMedications();
    return medications.filter(med => med.isActive && !med.isExpired);
  }

  static async searchMedications(searchTerm: string): Promise<Medication[]> {
    const medications = await this.retrieveMedications();
    const term = searchTerm.toLowerCase();
    
    return medications.filter(med => 
      med.brandName.toLowerCase().includes(term) ||
      med.genericName.toLowerCase().includes(term) ||
      med.patientName.toLowerCase().includes(term) ||
      med.reasonForUse.toLowerCase().includes(term)
    );
  }

  static async updateMedicationStatus(medicationId: string, isActive: boolean): Promise<void> {
    const medication = await this.getMedication(medicationId);
    if (medication) {
      medication.isActive = isActive;
      medication.updatedAt = new Date();
      await this.storeMedication(medication);
    }
  }

  static async markExpiredMedications(): Promise<number> {
    const medications = await this.retrieveMedications();
    const now = new Date();
    let expiredCount = 0;
    
    const updatedMedications = medications.map(med => {
      const storageExpired = med.storage?.expirationDate && med.storage.expirationDate < now;
      const endDateExpired = med.endDate && med.endDate < now;
      
      const shouldExpire = storageExpired || endDateExpired;
      
      if (shouldExpire && !med.isExpired) {
        expiredCount++;
        return { ...med, isExpired: true, updatedAt: new Date() };
      }
      return med;
    });

    if (expiredCount > 0) {
      await this.storeMedications(updatedMedications);
    }

    return expiredCount;
  }

  /**
   * Medication index for faster searches (optional optimization)
   */
  private static async updateMedicationIndex(medications: Medication[]): Promise<void> {
    const index = {
      byPatient: medications.reduce((acc, med) => {
        if (!acc[med.patientName]) acc[med.patientName] = [];
        acc[med.patientName].push(med.id);
        return acc;
      }, {} as Record<string, string[]>),
      
      byBrand: medications.reduce((acc, med) => {
        const key = med.brandName.toLowerCase();
        if (!acc[key]) acc[key] = [];
        acc[key].push(med.id);
        return acc;
      }, {} as Record<string, string[]>),
      
      active: medications.filter(med => med.isActive).map(med => med.id),
      expired: medications.filter(med => med.isExpired).map(med => med.id),
      
      lastUpdated: new Date().toISOString()
    };

    await this.storeData(this.STORAGE_KEYS.MEDICATION_INDEX, index);
  }

  /**
   * App settings
   */
  static async storeAppSetting(key: string, value: any): Promise<void> {
    const settings = await this.retrieveAppSettings();
    settings[key] = value;
    await this.storeData(this.STORAGE_KEYS.APP_SETTINGS, settings);
  }

  static async retrieveAppSetting(key: string): Promise<any> {
    const settings = await this.retrieveAppSettings();
    return settings[key];
  }

  static async retrieveAppSettings(): Promise<any> {
    const defaultSettings = {
      notifications: true,
      reminderMinutes: 15,
      theme: 'system',
      exportFormat: 'pdf',
    };

    const settings = await this.retrieveData(this.STORAGE_KEYS.APP_SETTINGS);
    return { ...defaultSettings, ...settings };
  }

  static async storeAppSettings(settings: any): Promise<void> {
    await this.storeData(this.STORAGE_KEYS.APP_SETTINGS, settings);
  }

  /**
   * Data management
   */
  static async clearAllData(): Promise<void> {
    const keys = Object.values(this.STORAGE_KEYS);
    await Promise.all(keys.map(key => this.removeData(key)));
  }

  static async exportAllData(): Promise<string> {
    const data = {
      medications: await this.retrieveMedications(),
      settings: await this.retrieveAppSettings(),
      exportedAt: new Date().toISOString(),
      version: 1
    };

    return JSON.stringify(data, null, 2);
  }

  static async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.medications && Array.isArray(data.medications)) {
        // Convert date strings back to Date objects during import
        const medications = data.medications.map((med: any) => ({
          ...med,
          createdAt: this.safeISOToDate(med.createdAt) || new Date(),
          updatedAt: this.safeISOToDate(med.updatedAt) || new Date(),
          startDate: this.safeISOToDate(med.startDate) || new Date(),
          endDate: this.safeISOToDate(med.endDate),
          storage: med.storage ? {
            ...med.storage,
            expirationDate: this.safeISOToDate(med.storage.expirationDate),
          } : undefined,
        }));
        
        await this.storeMedications(medications);
      }
      
      if (data.settings) {
        await this.storeAppSettings(data.settings);
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Invalid data format for import');
    }
  }

  /**
   * Data cleanup for expired medications
   */
  static async cleanupExpiredMedications(): Promise<number> {
    return await this.markExpiredMedications();
  }

  /**
   * Get database statistics
   */
  static async getDatabaseStats(): Promise<{
    totalMedications: number;
    activeMedications: number;
    expiredMedications: number;
    patients: string[];
  }> {
    const medications = await this.retrieveMedications();
    
    return {
      totalMedications: medications.length,
      activeMedications: medications.filter(med => med.isActive).length,
      expiredMedications: medications.filter(med => med.isExpired).length,
      patients: [...new Set(medications.map(med => med.patientName))].sort()
    };
  }

  /**
   * Batch operations for better performance
   */
  static async batchStoreMedications(medications: Medication[]): Promise<void> {
    await this.storeMedications(medications);
  }

  static async batchDeleteMedications(medicationIds: string[]): Promise<void> {
    const medications = await this.retrieveMedications();
    const filteredMedications = medications.filter(med => !medicationIds.includes(med.id));
    await this.storeMedications(filteredMedications);
  }

  /**
   * Utility methods
   */
  static async getStorageInfo(): Promise<{
    totalSize: number;
    medicationCount: number;
    lastUpdated: string;
  }> {
    const medications = await this.retrieveMedications();
    const jsonData = await AsyncStorage.getItem(this.STORAGE_KEYS.MEDICATIONS);
    
    return {
      totalSize: jsonData ? jsonData.length : 0,
      medicationCount: medications.length,
      lastUpdated: medications.length > 0 
        ? Math.max(...medications.map(med => med.updatedAt.getTime())).toString()
        : 'Never'
    };
  }
}