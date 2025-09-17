import { Medication } from "../types/Medication";
import { DateUtils } from "../utils/dateUtils";
import { FormatUtils } from "../utils/formatUtils";

interface SafetyPlanStats {
  totalMedications: number;
  activeMedications: number;
  expiredMedications: number;
  patients: string[];
}

export class SafetyPlanPDFTemplate {
  static generateHTML(medications: Medication[], stats: SafetyPlanStats): string {
    const currentDate = DateUtils.formatDate(new Date(), "long");
    const patientNames = [...new Set(medications.map(med => med.patientName))];

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Medication Safety Plan</title>
    <style>
        @page {
            margin: 0.5in;
            size: letter;
        }
        
        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        
        .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #333;
        }
        
        .header h1 {
            margin: 0 0 5px 0;
            font-size: 16px;
            color: #333;
            font-weight: bold;
        }
        
        .header .subtitle {
            font-size: 9px;
            color: #666;
            margin: 0;
        }
        
        .patient-info {
            margin-bottom: 15px;
            padding: 8px;
            background: #f9f9f9;
            border: 1px solid #ddd;
        }
        
        .patient-info h2 {
            margin: 0 0 5px 0;
            font-size: 12px;
            color: #333;
        }
        
        .medication {
            margin-bottom: 20px;
            page-break-inside: avoid;
            border: 1px solid #ccc;
            padding: 12px;
        }
        
        .med-header {
            margin-bottom: 8px;
            padding-bottom: 5px;
            border-bottom: 1px solid #ddd;
        }
        
        .med-name {
            font-size: 12px;
            font-weight: bold;
            color: #333;
            margin: 0 0 2px 0;
        }
        
        .med-generic {
            font-size: 9px;
            color: #666;
            font-style: italic;
            margin: 0;
        }
        
        .med-grid {
            display: table;
            width: 100%;
            margin: 8px 0;
        }
        
        .med-row {
            display: table-row;
        }
        
        .med-cell {
            display: table-cell;
            padding: 3px 8px 3px 0;
            vertical-align: top;
            border-bottom: 1px dotted #eee;
        }
        
        .med-label {
            font-weight: bold;
            color: #555;
            width: 25%;
            font-size: 9px;
        }
        
        .med-value {
            color: #333;
            font-size: 9px;
        }
        
        .schedule-grid {
            margin: 8px 0;
            border: 1px solid #ddd;
            background: #f8f8f8;
        }
        
        .schedule-header {
            background: #333;
            color: white;
            padding: 4px 8px;
            font-weight: bold;
            font-size: 9px;
        }
        
        .schedule-content {
            padding: 6px 8px;
            font-size: 9px;
        }
        
        .times-list {
            margin: 3px 0;
            font-weight: bold;
        }
        
        .safety-section {
            margin: 8px 0;
            padding: 6px 8px;
            background: #fffbf0;
            border-left: 3px solid #ff9800;
        }
        
        .safety-title {
            font-weight: bold;
            font-size: 9px;
            color: #333;
            margin: 0 0 3px 0;
        }
        
        .safety-content {
            font-size: 8px;
            color: #555;
            margin: 2px 0;
        }
        
        .storage-section {
            margin: 8px 0;
            padding: 6px 8px;
            background: #f0f8f0;
            border-left: 3px solid #4caf50;
        }
        
        .contact-section {
            margin: 8px 0;
            padding: 6px 8px;
            background: #f0f4ff;
            border-left: 3px solid #2196f3;
        }
        
        .emergency-info {
            margin-top: 20px;
            padding: 10px;
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            page-break-inside: avoid;
        }
        
        .emergency-title {
            font-weight: bold;
            font-size: 11px;
            color: #856404;
            margin: 0 0 5px 0;
        }
        
        .emergency-content {
            font-size: 9px;
            color: #856404;
        }
        
        .footer {
            position: fixed;
            bottom: 0.25in;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 7px;
            color: #999;
            border-top: 1px solid #eee;
            padding-top: 3px;
        }
        
        @media print {
            .page-break {
                page-break-before: always;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Medication Safety Plan</h1>
        <p class="subtitle">Generated ${currentDate} • ${medications.length} medication${medications.length !== 1 ? 's' : ''}</p>
    </div>

    ${patientNames.length > 0 ? `
    <div class="patient-info">
        <h2>Patient${patientNames.length > 1 ? 's' : ''}: ${patientNames.join(', ')}</h2>
    </div>` : ''}

    ${this.generateMedicationList(medications)}
    
    ${this.generateEmergencyInfo()}

    <div class="footer">
        Medication Safety Plan • ${currentDate} • Keep accessible for emergencies
    </div>
</body>
</html>`;
  }

  private static generateMedicationList(medications: Medication[]): string {
    if (medications.length === 0) {
      return `
        <div style="text-align: center; padding: 40px; color: #666; font-size: 11px;">
            No medications found in safety plan.
        </div>`;
    }

    return medications.map((med, index) => {
      return `
        <div class="medication">
            <div class="med-header">
                <div class="med-name">${this.escapeHtml(med.brandName)}</div>
                ${med.genericName && med.genericName !== med.brandName ? 
                  `<div class="med-generic">${this.escapeHtml(med.genericName)}</div>` : ''}
            </div>
            
            <div class="med-grid">
                <div class="med-row">
                    <div class="med-cell med-label">Purpose:</div>
                    <div class="med-cell med-value">${this.escapeHtml(med.reasonForUse)}</div>
                </div>
                
                <div class="med-row">
                    <div class="med-cell med-label">Dosage:</div>
                    <div class="med-cell med-value">${this.escapeHtml(FormatUtils.formatDosage(med.dosageAmount, med.dosageUnit))}</div>
                </div>
                
                <div class="med-row">
                    <div class="med-cell med-label">Administration:</div>
                    <div class="med-cell med-value">${this.escapeHtml(FormatUtils.formatAdministrationMethod(med.administrationMethod))}</div>
                </div>
                
                <div class="med-row">
                    <div class="med-cell med-label">Food Requirements:</div>
                    <div class="med-cell med-value">${this.escapeHtml(FormatUtils.formatFoodRequirement(med.foodRequirement))}</div>
                </div>
                
                <div class="med-row">
                    <div class="med-cell med-label">Active Period:</div>
                    <div class="med-cell med-value">
                        ${DateUtils.formatDate(med.startDate, 'short')}${med.endDate ? ` to ${DateUtils.formatDate(med.endDate, 'short')}` : ' (ongoing)'}
                    </div>
                </div>
            </div>

            ${this.generateScheduleGrid(med)}
            ${this.generateSafetyInfo(med)}
            ${this.generateStorageInfo(med)}
            ${this.generateContactInfo(med)}
        </div>`;
    }).join('');
  }

  private static generateScheduleGrid(med: Medication): string {
    if (!med.schedule || med.schedule.isAsNeeded) {
      return `
        <div class="schedule-grid">
            <div class="schedule-header">Schedule</div>
            <div class="schedule-content">Take as needed</div>
        </div>`;
    }

    if (!med.schedule.doseTimes || med.schedule.doseTimes.length === 0) {
      return `
        <div class="schedule-grid">
            <div class="schedule-header">Schedule</div>
            <div class="schedule-content">${this.escapeHtml(FormatUtils.formatScheduleFrequency(med.schedule.frequency))}</div>
        </div>`;
    }

    const times = FormatUtils.formatDoseTimes(med.schedule.doseTimes);
    
    return `
      <div class="schedule-grid">
          <div class="schedule-header">Daily Schedule</div>
          <div class="schedule-content">
              <div>${this.escapeHtml(FormatUtils.formatScheduleFrequency(med.schedule.frequency))}</div>
              <div class="times-list">${this.escapeHtml(times)}</div>
          </div>
      </div>`;
  }

  private static generateSafetyInfo(med: Medication): string {
    const hasSafetyInfo = med.drugInteractions?.trim() || med.foodInteractions?.trim() || 
                         med.benefits?.trim() || med.sideEffects?.trim();
    
    if (!hasSafetyInfo) return '';

    return `
      <div class="safety-section">
          <div class="safety-title">Safety Information</div>
          ${med.benefits?.trim() ? `<div class="safety-content"><strong>Benefits:</strong> ${this.escapeHtml(med.benefits)}</div>` : ''}
          ${med.sideEffects?.trim() ? `<div class="safety-content"><strong>Side Effects:</strong> ${this.escapeHtml(med.sideEffects)}</div>` : ''}
          ${med.drugInteractions?.trim() ? `<div class="safety-content"><strong>Drug Interactions:</strong> ${this.escapeHtml(med.drugInteractions)}</div>` : ''}
          ${med.foodInteractions?.trim() ? `<div class="safety-content"><strong>Food Interactions:</strong> ${this.escapeHtml(med.foodInteractions)}</div>` : ''}
      </div>`;
  }

  private static generateStorageInfo(med: Medication): string {
    const hasStorageInfo = med.storage?.instructions?.trim() || med.storage?.location?.trim() || 
                          med.storage?.disposalInstructions?.trim() || med.storage?.expirationDate;
    
    if (!hasStorageInfo) return '';

    return `
      <div class="storage-section">
          <div class="safety-title">Storage & Disposal</div>
          ${med.storage?.instructions?.trim() ? `<div class="safety-content"><strong>Storage:</strong> ${this.escapeHtml(med.storage.instructions)}</div>` : ''}
          ${med.storage?.location?.trim() ? `<div class="safety-content"><strong>Location:</strong> ${this.escapeHtml(med.storage.location)}</div>` : ''}
          ${med.storage?.expirationDate ? `<div class="safety-content"><strong>Expires:</strong> ${DateUtils.formatDate(med.storage.expirationDate, 'short')}</div>` : ''}
          ${med.storage?.disposalInstructions?.trim() ? `<div class="safety-content"><strong>Disposal:</strong> ${this.escapeHtml(med.storage.disposalInstructions)}</div>` : ''}
      </div>`;
  }

  private static generateContactInfo(med: Medication): string {
    if (!med.communication?.primaryContact?.name?.trim() && !med.communication?.primaryContact?.phone?.trim()) {
      return '';
    }

    return `
      <div class="contact-section">
          <div class="safety-title">Healthcare Contact</div>
          ${med.communication.primaryContact?.name?.trim() ? `<div class="safety-content"><strong>Name:</strong> ${this.escapeHtml(med.communication.primaryContact.name)}</div>` : ''}
          ${med.communication.primaryContact?.phone?.trim() ? `<div class="safety-content"><strong>Phone:</strong> ${this.escapeHtml(med.communication.primaryContact.phone)}</div>` : ''}
          ${med.communication?.questionsAboutMedication?.trim() ? `<div class="safety-content"><strong>Questions:</strong> ${this.escapeHtml(med.communication.questionsAboutMedication)}</div>` : ''}
      </div>`;
  }

  private static generateEmergencyInfo(): string {
    return `
      <div class="emergency-info">
          <div class="emergency-title">Emergency Information</div>
          <div class="emergency-content">
              <strong>In case of overdose or poisoning:</strong><br>
              • Call 911 for immediate emergency<br>
              • Call Poison Control: 1-800-222-1222<br>
              • Have this medication safety plan available when calling<br><br>
              <strong>For medication questions:</strong><br>
              • Contact your healthcare provider or pharmacist<br>
              • Refer to the contact information listed for each medication above
          </div>
      </div>`;
  }

  private static escapeHtml(text: string): string {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
}