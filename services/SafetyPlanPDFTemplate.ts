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
    const grouped = this.groupMedicationsByPatient(medications);

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Family Medicine Safety Plan</title>
    <style>
        @page {
            margin: 0.4in 0.5in;
            size: letter landscape;
        }
        
        body {
            font-family: Arial, sans-serif;
            font-size: 8px;
            line-height: 1.2;
            color: #333;
            margin: 0;
            padding: 0;
        }
        
        .header {
            text-align: center;
            margin-bottom: 12px;
            padding-bottom: 6px;
            border-bottom: 2px solid #f78b33;
        }
        
        .header h1 {
            margin: 0 0 3px 0;
            font-size: 14px;
            color: #333;
            font-weight: bold;
        }
        
        .header .subtitle {
            font-size: 8px;
            color: #666;
            margin: 0;
        }
        
        .patient-section {
            margin-bottom: 12px;
        }
        
        .patient-header {
            background: #f78b33;
            color: white;
            padding: 5px 8px;
            margin-bottom: 8px;
            font-size: 11px;
            font-weight: bold;
            border-radius: 3px;
        }
        
        .medications-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            margin-bottom: 12px;
        }
        
        .medication {
            border: 1px solid #ccc;
            padding: 6px;
            page-break-inside: avoid;
            background: #fafafa;
        }
        
        .med-header {
            margin-bottom: 4px;
            padding-bottom: 3px;
            border-bottom: 1px solid #ddd;
        }
        
        .med-name {
            font-size: 9px;
            font-weight: bold;
            color: #f78b33;
            margin: 0;
        }
        
        .med-generic {
            font-size: 7px;
            color: #666;
            font-style: italic;
            margin: 0;
        }
        
        .med-info {
            margin: 3px 0;
        }
        
        .info-row {
            margin: 2px 0;
            display: flex;
        }
        
        .info-label {
            font-weight: bold;
            color: #555;
            min-width: 50px;
            font-size: 7px;
        }
        
        .info-value {
            color: #333;
            font-size: 7px;
            flex: 1;
        }
        
        .schedule-box {
            margin: 3px 0;
            padding: 3px;
            background: #e8f4f8;
            border-left: 2px solid #2196f3;
            font-size: 7px;
        }
        
        .schedule-times {
            font-weight: bold;
            color: #f78b33;
            margin-top: 2px;
        }
        
        .safety-box {
            margin: 3px 0;
            padding: 3px;
            background: #fff9e6;
            border-left: 2px solid #ff9800;
            font-size: 7px;
        }
        
        .contact-box {
            margin: 3px 0;
            padding: 3px;
            background: #f0f4ff;
            border-left: 2px solid #2196f3;
            font-size: 7px;
        }
        
        .box-title {
            font-weight: bold;
            font-size: 7px;
            margin-bottom: 2px;
        }
        
        .emergency-info {
            margin-top: 12px;
            padding: 6px;
            background: #fff3cd;
            border: 1px solid #ffc107;
            page-break-inside: avoid;
        }
        
        .emergency-title {
            font-weight: bold;
            font-size: 9px;
            color: #856404;
            margin: 0 0 3px 0;
        }
        
        .emergency-content {
            font-size: 7px;
            color: #856404;
            line-height: 1.3;
        }
        
        .footer {
            position: fixed;
            bottom: 0.2in;
            left: 0.5in;
            right: 0.5in;
            text-align: center;
            font-size: 6px;
            color: #999;
            border-top: 1px solid #eee;
            padding-top: 2px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Family Medicine Safety Plan</h1>
        <p class="subtitle">Created ${currentDate} • ${medications.length} medicine${medications.length !== 1 ? 's' : ''}</p>
    </div>

    ${this.generateMedicationsByPatient(grouped)}
    
    ${this.generateEmergencyInfo()}

    <div class="footer">
        Family Medicine Safety Plan • ${currentDate} • Keep where you can find it easily
    </div>
</body>
</html>`;
  }

  private static groupMedicationsByPatient(medications: Medication[]) {
    const grouped = medications.reduce((acc, med) => {
      const patientName = med.patientName || "Unknown";
      if (!acc[patientName]) {
        acc[patientName] = [];
      }
      acc[patientName].push(med);
      return acc;
    }, {} as Record<string, Medication[]>);

    const sortedPatients = Object.keys(grouped).sort((a, b) => {
      if (a === "Myself") return -1;
      if (b === "Myself") return 1;
      return a.localeCompare(b);
    });

    return { grouped, sortedPatients };
  }

  private static formatPlanTitle(name: string): string {
    if (name === "Myself") {
      return "My Plan";
    }
    return name.endsWith('s') ? `${name}' Plan` : `${name}'s Plan`;
  }

  private static generateMedicationsByPatient(grouped: { grouped: Record<string, Medication[]>, sortedPatients: string[] }): string {
    if (grouped.sortedPatients.length === 0) {
      return `<div style="text-align: center; padding: 40px; color: #666; font-size: 10px;">No medicines in plan yet.</div>`;
    }

    return grouped.sortedPatients.map((patientName) => {
      const patientMeds = grouped.grouped[patientName];
      
      return `
        <div class="patient-section">
            <div class="patient-header">${this.escapeHtml(this.formatPlanTitle(patientName))}</div>
            <div class="medications-grid">
                ${patientMeds.map(med => this.generateCompactMedicationCard(med)).join('')}
            </div>
        </div>`;
    }).join('');
  }

  private static generateCompactMedicationCard(med: Medication): string {
    const hasSchedule = med.schedule && !med.schedule.isAsNeeded && med.schedule.doseTimes && med.schedule.doseTimes.length > 0;
    const hasSafety = med.benefits?.trim() || med.sideEffects?.trim() || med.drugInteractions?.trim() || med.foodInteractions?.trim();
    const hasContact = med.communication?.primaryContact?.name?.trim() || med.communication?.primaryContact?.phone?.trim();
    
    return `
      <div class="medication">
          <div class="med-header">
              <div class="med-name">${this.escapeHtml(med.brandName)}</div>
              ${med.genericName && med.genericName !== med.brandName ? 
                `<div class="med-generic">${this.escapeHtml(med.genericName)}</div>` : ''}
          </div>
          
          <div class="med-info">
              <div class="info-row">
                  <div class="info-label">Why:</div>
                  <div class="info-value">${this.escapeHtml(this.truncate(med.reasonForUse, 40))}</div>
              </div>
              
              <div class="info-row">
                  <div class="info-label">Dose:</div>
                  <div class="info-value">${this.escapeHtml(FormatUtils.formatDosage(med.dosageAmount, med.dosageUnit))}${med.dosageStrength ? ` (${this.escapeHtml(med.dosageStrength)})` : ''}</div>
              </div>
              
              <div class="info-row">
                  <div class="info-label">How:</div>
                  <div class="info-value">${this.escapeHtml(FormatUtils.formatAdministrationMethod(med.administrationMethod))}</div>
              </div>
              
              <div class="info-row">
                  <div class="info-label">Food:</div>
                  <div class="info-value">${this.escapeHtml(FormatUtils.formatFoodRequirement(med.foodRequirement))}</div>
              </div>
          </div>

          ${hasSchedule ? `
          <div class="schedule-box">
              <div class="box-title">When: ${this.escapeHtml(FormatUtils.formatScheduleFrequency(med.schedule.frequency))}</div>
              <div class="schedule-times">${this.escapeHtml(FormatUtils.formatDoseTimes(med.schedule.doseTimes))}</div>
          </div>` : med.schedule?.isAsNeeded ? `
          <div class="schedule-box">
              <div class="box-title">When needed</div>
          </div>` : ''}

          ${hasSafety ? `
          <div class="safety-box">
              <div class="box-title">Safety</div>
              ${med.benefits?.trim() ? `<div><strong>Does:</strong> ${this.escapeHtml(this.truncate(med.benefits, 60))}</div>` : ''}
              ${med.sideEffects?.trim() ? `<div><strong>Side effects:</strong> ${this.escapeHtml(this.truncate(med.sideEffects, 60))}</div>` : ''}
              ${med.drugInteractions?.trim() ? `<div><strong>Drug interactions:</strong> ${this.escapeHtml(this.truncate(med.drugInteractions, 50))}</div>` : ''}
          </div>` : ''}

          ${hasContact ? `
          <div class="contact-box">
              <div class="box-title">Contact</div>
              ${med.communication.primaryContact?.name?.trim() ? `<div><strong>${this.escapeHtml(med.communication.primaryContact.name)}</strong></div>` : ''}
              ${med.communication.primaryContact?.phone?.trim() ? `<div>${this.escapeHtml(med.communication.primaryContact.phone)}</div>` : ''}
          </div>` : ''}
      </div>`;
  }

  private static generateEmergencyInfo(): string {
    return `
      <div class="emergency-info">
          <div class="emergency-title">Emergency Information</div>
          <div class="emergency-content">
              <strong>Overdose/Poisoning:</strong> Call 911 or Poison Control (1-800-222-1222) • 
              <strong>Medicine Questions:</strong> Contact your healthcare provider or pharmacist
          </div>
      </div>`;
  }

  private static truncate(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
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