import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ILP, ILPProgress } from '../types/ilp';

/**
 * Service for generating PDF reports for ILPs
 */
export class PDFExportService {
  /**
   * Generates a PDF report for an ILP with progress data and objectives
   * 
   * @param ilp The ILP to generate a report for
   * @param progressData Array of progress entries for the ILP
   * @param overallProgress The calculated overall progress percentage
   * @returns A data URL for the generated PDF
   */
  static async generateILPReport(
    ilp: ILP, 
    progressData: ILPProgress[], 
    overallProgress: number
  ): Promise<string> {
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.setTextColor(0, 102, 204);
    doc.text('Individualized Learning Plan (ILP) Report', 15, 20);
    
    // Add ILP details
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('ILP Details', 15, 35);
    
    doc.setFontSize(10);
    doc.text(`Goal: ${ilp.goalDescription}`, 20, 45);
    doc.text(`Target Skill: ${ilp.targetSkill}`, 20, 50);
    doc.text(`Timeframe: ${formatDate(ilp.timeframeStart)} - ${formatDate(ilp.timeframeEnd)}`, 20, 55);
    doc.text(`Status: ${ilp.status}`, 20, 60);
    
    // Add colored status indicator
    const statusColor = getStatusColor(ilp.status);
    doc.setFillColor(statusColor.r, statusColor.g, statusColor.b);
    doc.circle(180, 60, 3, 'F');
    
    // Add objectives section if there are objectives
    let yPos = 70;
    if (ilp.objectives && ilp.objectives.length > 0) {
      doc.setFontSize(14);
      doc.text('Objectives', 15, yPos);
      yPos += 10;
      
      // Create objectives table
      const objectivesData = ilp.objectives.map(obj => [
        obj.description,
        `${obj.currentValue}/${obj.targetValue}`,
        `${Math.round((obj.currentValue / obj.targetValue) * 100)}%`,
        obj.isCompleted ? 'Yes' : 'No'
      ]);
      
      // Use the autotable plugin
      const autoTable = (doc as any).autoTable;
      autoTable({
        startY: yPos,
        head: [['Description', 'Progress', 'Percentage', 'Completed']],
        body: objectivesData,
        theme: 'grid',
        headStyles: {
          fillColor: [69, 130, 236],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        }
      });
      
      yPos = autoTable.previous.finalY + 15;
    }
    
    // Add progress section
    doc.setFontSize(14);
    doc.text('Overall Progress', 15, yPos);
    
    // Add progress bar
    const progressBarY = yPos + 10;
    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(220, 220, 220);
    doc.rect(20, progressBarY, 170, 10, 'F');
    
    doc.setDrawColor(39, 168, 68);
    doc.setFillColor(39, 168, 68);
    doc.rect(20, progressBarY, 170 * (overallProgress / 100), 10, 'F');
    
    doc.setFontSize(10);
    doc.text(`${Math.round(overallProgress)}%`, 195, progressBarY + 7, { align: 'right' });
    
    // Add activity log section
    yPos = progressBarY + 25;
    doc.setFontSize(14);
    doc.text('Activity Log', 15, yPos);
    
    // Create activity log table
    const activityData = progressData
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .map(progress => [
        formatDate(progress.timestamp),
        capitalizeFirstLetter(progress.activityType),
        `${progress.score !== undefined ? progress.score : '-'}%`,
        progress.completionStatus ? 'Yes' : 'No',
        `${progress.progressPercentageContribution.toFixed(1)}%`
      ]);
    
    // Use the autotable plugin again
    const autoTable = (doc as any).autoTable;
    autoTable({
      startY: yPos + 5,
      head: [['Date', 'Activity Type', 'Score', 'Completed', 'Progress Contribution']],
      body: activityData,
      theme: 'striped',
      headStyles: {
        fillColor: [69, 130, 236],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      }
    });
    
    // Add educator notes if present
    yPos = autoTable.previous.finalY + 15;
    if (ilp.educatorNotes) {
      doc.setFontSize(14);
      doc.text('Educator Notes', 15, yPos);
      
      doc.setFontSize(10);
      
      // Wrap the text to fit within the page
      const splitText = doc.splitTextToSize(ilp.educatorNotes, 180);
      doc.text(splitText, 20, yPos + 10);
    }
    
    // Add footer with proper typing for accessing internal properties
    const docInternal = doc.internal as any;
    const pageCount = docInternal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Generated on ${formatDate(new Date())} - Page ${i} of ${pageCount}`,
        docInternal.pageSize.width / 2, 
        docInternal.pageSize.height - 10, 
        { align: 'center' }
      );
    }
    
    // Return a data URL for the PDF
    return doc.output('dataurlstring');
  }
}

// Helper functions
function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString();
}

function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getStatusColor(status: string): { r: number; g: number; b: number } {
  switch (status) {
    case 'active':
      return { r: 39, g: 168, b: 68 }; // Green
    case 'achieved':
      return { r: 58, g: 134, b: 255 }; // Blue
    case 'archived':
      return { r: 107, g: 114, b: 128 }; // Gray
    case 'paused':
      return { r: 245, g: 158, b: 11 }; // Orange
    default:
      return { r: 156, g: 163, b: 175 }; // Default gray
  }
} 