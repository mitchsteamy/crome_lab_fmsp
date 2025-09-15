/**
 * Date utility functions for FMSP app
 */

export class DateUtils {
  
  /**
   * Format date for display
   */
  static formatDate(date: Date, format: 'short' | 'long' | 'time' | 'datetime' = 'short'): string {
    switch (format) {
      case 'short':
        return date.toLocaleDateString();
      case 'long':
        return date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      case 'time':
        return date.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
      case 'datetime':
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        })}`;
      default:
        return date.toLocaleDateString();
    }
  }

  /**
   * Get relative time string (e.g., "2 hours ago", "in 3 days")
   */
  static getRelativeTime(date: Date): string {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const absDiff = Math.abs(diff);
    
    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    const year = day * 365;

    if (absDiff < minute) {
      return 'Just now';
    } else if (absDiff < hour) {
      const minutes = Math.floor(absDiff / minute);
      const suffix = diff < 0 ? 'ago' : 'from now';
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ${suffix}`;
    } else if (absDiff < day) {
      const hours = Math.floor(absDiff / hour);
      const suffix = diff < 0 ? 'ago' : 'from now';
      return `${hours} hour${hours !== 1 ? 's' : ''} ${suffix}`;
    } else if (absDiff < week) {
      const days = Math.floor(absDiff / day);
      const suffix = diff < 0 ? 'ago' : 'from now';
      return `${days} day${days !== 1 ? 's' : ''} ${suffix}`;
    } else if (absDiff < month) {
      const weeks = Math.floor(absDiff / week);
      const suffix = diff < 0 ? 'ago' : 'from now';
      return `${weeks} week${weeks !== 1 ? 's' : ''} ${suffix}`;
    } else if (absDiff < year) {
      const months = Math.floor(absDiff / month);
      const suffix = diff < 0 ? 'ago' : 'from now';
      return `${months} month${months !== 1 ? 's' : ''} ${suffix}`;
    } else {
      const years = Math.floor(absDiff / year);
      const suffix = diff < 0 ? 'ago' : 'from now';
      return `${years} year${years !== 1 ? 's' : ''} ${suffix}`;
    }
  }

  /**
   * Check if date is today
   */
  static isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  /**
   * Check if date is tomorrow
   */
  static isTomorrow(date: Date): boolean {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  }

  /**
   * Check if date is yesterday
   */
  static isYesterday(date: Date): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  }

  /**
   * Get start of day
   */
  static startOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  /**
   * Get end of day
   */
  static endOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  /**
   * Add days to date
   */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Add hours to date
   */
  static addHours(date: Date, hours: number): Date {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
  }

  /**
   * Add minutes to date
   */
  static addMinutes(date: Date, minutes: number): Date {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
  }

  /**
   * Get days until date
   */
  static getDaysUntil(date: Date): number {
    const today = this.startOfDay(new Date());
    const targetDate = this.startOfDay(date);
    const diffTime = targetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Check if date is expired
   */
  static isExpired(date: Date): boolean {
    return date < new Date();
  }

  /**
   * Check if date is expiring soon (within specified days)
   */
  static isExpiringSoon(date: Date, days: number = 7): boolean {
    const daysUntil = this.getDaysUntil(date);
    return daysUntil >= 0 && daysUntil <= days;
  }

  /**
   * Format duration between two dates
   */
  static formatDuration(startDate: Date, endDate: Date): string {
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      const remainingDays = diffDays % 7;
      let result = `${weeks} week${weeks !== 1 ? 's' : ''}`;
      if (remainingDays > 0) {
        result += ` ${remainingDays} day${remainingDays !== 1 ? 's' : ''}`;
      }
      return result;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
  }

  /**
   * Get time until next dose
   */
  static getTimeUntilDose(doseTime: Date): string {
    const now = new Date();
    const diff = doseTime.getTime() - now.getTime();
    
    if (diff <= 0) {
      return 'Overdue';
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  /**
   * Parse date string safely
   */
  static parseDate(dateString: string): Date | null {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  }

  /**
   * Create date from time components
   */
  static createTimeDate(hour: number, minute: number, baseDate?: Date): Date {
    const date = baseDate ? new Date(baseDate) : new Date();
    date.setHours(hour, minute, 0, 0);
    return date;
  }

  /**
   * Get day name
   */
  static getDayName(date: Date, short: boolean = false): string {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: short ? 'short' : 'long' 
    };
    return date.toLocaleDateString('en-US', options);
  }

  /**
   * Check if two dates are the same day
   */
  static isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  /**
   * Calculate age from birth date
   */
  static calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}
