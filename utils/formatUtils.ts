/**
 * Formatting utility functions for FMSP app
 */

import { AdministrationMethod, FoodRequirement, ScheduleFrequency } from '../types/Medication';
 
export class FormatUtils {
  
  /**
   * Format medication name for display
   */
  static formatMedicationName(brandName: string, genericName?: string): string {
    if (!genericName || brandName.toLowerCase() === genericName.toLowerCase()) {
      return brandName;
    }
    return `${brandName} (${genericName})`;
  }

  /**
   * Format dosage for display
   */
  static formatDosage(amount: string, unit: string): string {
    return `${amount} ${unit}`;
  }

  /**
   * Format administration method for display
   */
  static formatAdministrationMethod(method: string): string {
    const methodMap: Record<string, string> = {
      'by mouth': 'By mouth',
      'under tongue': 'Under tongue',
      'between cheek and gums': 'Between cheek and gums',
      'inhaled into lungs': 'Inhaled',
      'rubbed on skin': 'Applied to skin',
      'injection': 'Injection',
      'eye': 'In eye',
      'ear': 'In ear',
      'nasal': 'In nose',
      'vaginal': 'Vaginal',
      'rectal': 'Rectal',
      'other': 'Other'
    };
    
    return methodMap[method] || method;
  }

  /**
   * Format food requirement for display
   */
  static formatFoodRequirement(requirement: string): string {
    const requirementMap: Record<string, string> = {
      'with food': 'With food',
      'before food': 'Before eating',
      'after food': 'After eating',
      'no food requirement': 'No food restrictions',
      'none': 'No food restrictions'
    };
    
    return requirementMap[requirement] || requirement;
  }

  /**
   * Format schedule frequency for display
   */
  static formatScheduleFrequency(frequency: string): string {
    const frequencyMap: Record<string, string> = {
      'every day': 'Every day',
      'daily': 'Every day',
      'specific-days': 'Specific days',
      'every-other-day': 'Every other day',
      'every-x-days': 'Every few days',
      'every-x-weeks': 'Every few weeks',
      'every-x-months': 'Every few months',
      'as-needed': 'When needed'
    };
    
    return frequencyMap[frequency] || frequency;
  }

  /**
   * Format dose times for display
   */
  static formatDoseTimes(doseTimes: Array<{ hour: number; minute: number; label?: string }>): string {
    if (doseTimes.length === 0) return 'No times set';
    
    return doseTimes
      .map(time => {
        const timeStr = this.formatTime(time.hour, time.minute);
        return time.label ? `${timeStr} (${time.label})` : timeStr;
      })
      .join(', ');
  }

  /**
   * Format time (24-hour to 12-hour format)
   */
  static formatTime(hour: number, minute: number, use24Hour: boolean = false): string {
    if (use24Hour) {
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }
    
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  }

/**
 * Format days of week for display
 */
static formatDaysOfWeek(days: string[]): string {
  if (days.length === 7) return 'Every day';
  if (days.length === 0) return 'No days set';
  
  // Day order for sorting
  const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayAbbr: Record<string, string> = {
    'Sunday': 'Sun',
    'Monday': 'Mon',
    'Tuesday': 'Tue',
    'Wednesday': 'Wed',
    'Thursday': 'Thu',
    'Friday': 'Fri',
    'Saturday': 'Sat'
  };
  
  // Check for weekdays only (Monday-Friday)
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  if (days.length === 5 && weekdays.every(day => days.includes(day))) {
    return 'Weekdays';
  }
  
  // Check for weekends only
  const weekends = ['Saturday', 'Sunday'];
  if (days.length === 2 && weekends.every(day => days.includes(day))) {
    return 'Weekends';
  }
  
  // Sort days according to week order and abbreviate
  return days
    .sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b))
    .map(day => dayAbbr[day] || day)
    .join(', ');
}

  /**
   * Format patient name for display
   */
  static formatPatientName(name: string): string {
    if (name === "Myself") return "Myself";
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Format phone number for display
   */
  static formatPhoneNumber(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length === 11 && digits[0] === '1') {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    
    return phone; // Return original if can't format
  }

  /**
   * Format medication schedule summary
   */
  static formatScheduleSummary(schedule: any): string {
    if (schedule.isAsNeeded) {
      return 'When needed';
    }
    
    const frequency = this.formatScheduleFrequency(schedule.frequency);
    const times = this.formatDoseTimes(schedule.doseTimes || []);
    
    if (schedule.frequency === 'daily' || schedule.frequency === 'every day') {
      return `${frequency} at ${times}`;
    } else if (schedule.frequency === 'specific-days') {
      const days = this.formatDaysOfWeek(schedule.daysOfWeek || []);
      return `${days} at ${times}`;
    }
    
    return `${frequency} at ${times}`;
  }

  /**
   * Format medication list item
   */
  static formatMedicationListItem(medication: any): string {
    const name = this.formatMedicationName(medication.brandName, medication.genericName);
    const dosage = this.formatDosage(medication.dosageAmount, medication.dosageUnit);
    const strength = medication.dosageStrength ? ` (${medication.dosageStrength})` : '';
    return `${name} - ${dosage}${strength}`;
  }

  /**
   * Truncate text with ellipsis
   */
  static truncateText(text: string, maxLength: number, addEllipsis: boolean = true): string {
    if (text.length <= maxLength) return text;
    
    const truncated = text.slice(0, maxLength);
    return addEllipsis ? `${truncated}...` : truncated;
  }

  /**
   * Format list with proper conjunctions
   */
  static formatList(items: string[], conjunction: string = 'and'): string {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
    
    return `${items.slice(0, -1).join(', ')}, ${conjunction} ${items[items.length - 1]}`;
  }

  /**
   * Format percentage
   */
  static formatPercentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Format initials from name
   */
  static formatInitials(name: string): string {
    if (name === "Myself") return "Me";
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }

  /**
   * Format adherence rate with description
   */
  static formatAdherenceRate(rate: number): string {
    if (rate >= 95) return `${this.formatPercentage(rate)} (Excellent)`;
    if (rate >= 80) return `${this.formatPercentage(rate)} (Good)`;
    if (rate >= 60) return `${this.formatPercentage(rate)} (Fair)`;
    return `${this.formatPercentage(rate)} (Needs improvement)`;
  }

  /**
   * Format prescription type for display
   */
  static formatPrescriptionType(type: 'prescription' | 'over-the-counter'): string {
    return type === 'prescription' ? 'Prescription' : 'Over-the-Counter';
  }

  /**
   * Format export filename with timestamp
   */
  static formatExportFilename(baseName: string, extension: string = 'json'): string {
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/[:\-]/g, '').replace('T', '_');
    const sanitizedName = baseName.replace(/[^a-zA-Z0-9\-_]/g, '_');
    return `${sanitizedName}_${timestamp}.${extension}`;
  }

  /**
   * Capitalize first letter of each word
   */
  static titleCase(text: string): string {
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Format currency amount
   */
  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Format schedule for export/display
   */
  static formatScheduleForExport(schedule: any): string {
    if (schedule.isAsNeeded) {
      return 'Take when needed';
    }
    
    let result = '';
    
    switch (schedule.frequency) {
      case 'daily':
      case 'every day':
        result = 'Take every day';
        break;
      case 'specific-days':
        const days = this.formatDaysOfWeek(schedule.daysOfWeek || []);
        result = `Take on ${days}`;
        break;
      case 'every-other-day':
        result = 'Take every other day';
        break;
      case 'every-x-days':
        result = `Take every ${schedule.intervalDays} days`;
        break;
      case 'every-x-weeks':
        result = `Take every ${schedule.intervalWeeks} weeks`;
        break;
      case 'every-x-months':
        result = `Take every ${schedule.intervalMonths} months`;
        break;
      default:
        result = 'Custom schedule';
    }
    
    if (schedule.doseTimes && schedule.doseTimes.length > 0) {
      const times = this.formatDoseTimes(schedule.doseTimes);
      result += ` at ${times}`;
    }
    
    return result;
  }
}