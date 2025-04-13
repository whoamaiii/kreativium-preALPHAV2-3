import React, { useState } from 'react';
import { useIlps } from '../../context/ILPContext';
import { PDFExportService } from '../../services/PDFExportService';
import { FileText } from 'lucide-react';

interface PDFExportButtonProps {
  ilpId: string;
  className?: string;
  buttonText?: string;
}

/**
 * Button component for generating and downloading ILP PDF reports
 */
export const PDFExportButton: React.FC<PDFExportButtonProps> = ({ 
  ilpId, 
  className = '',
  buttonText = 'Export PDF Report'
}) => {
  const { state, getProgressForILP, getOverallProgress } = useIlps();
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Find the ILP by ID
  const ilp = state.ilps.find(i => i.id === ilpId);
  
  // If ILP not found, don't render the button
  if (!ilp) return null;
  
  const handleExport = async () => {
    try {
      setIsGenerating(true);
      
      // Get progress data and overall progress
      const [progressData, overallProgress] = await Promise.all([
        getProgressForILP(ilpId),
        getOverallProgress(ilpId)
      ]);
      
      // Generate the PDF
      const pdfDataUrl = await PDFExportService.generateILPReport(
        ilp,
        progressData,
        overallProgress
      );
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = pdfDataUrl;
      link.download = `ILP_Report_${ilp.targetSkill}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating PDF report:', error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <button
      onClick={handleExport}
      disabled={isGenerating}
      className={`flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 
        text-white rounded-md transition-colors focus:outline-none focus:ring-2 
        focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 
        disabled:cursor-not-allowed ${className}`}
    >
      <FileText size={18} />
      {isGenerating ? 'Generating...' : buttonText}
    </button>
  );
}; 