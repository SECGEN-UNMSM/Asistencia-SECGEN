
"use client";

import type { Attendee } from '@/contexts/attendance-context';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import for side effects

interface ExportButtonProps {
  attendees: Attendee[];
}

// Extend jsPDF interface to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export default function ExportButton({ attendees }: ExportButtonProps) {
  const { toast } = useToast();

  const handleExport = () => {
    if (attendees.length === 0) {
      toast({
        title: "Sin Datos",
        description: "No hay datos de asistencia para exportar.",
        variant: "destructive",
      });
      return;
    }

    const presentAttendees = attendees.filter(a => a.status === 'present');
    const absentAttendees = attendees.filter(a => a.status === 'absent');
    const unmarkedAttendees = attendees.filter(a => a.status === 'unmarked');
    
    try {
      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
      const margin = 15;
      let y = margin;

      // Title
      const titleText = 'Reporte de Asistencia';
      const titleFontSize = 20;
      doc.setFontSize(titleFontSize);
      doc.setFont('helvetica', 'bold');
      const titleWidth = doc.getTextWidth(titleText);
      doc.text(titleText, (pageWidth - titleWidth) / 2, y);
      y += titleFontSize * 0.7 + 5; 

      // Subtext/Summary
      const summaryFontSize = 10;
      doc.setFontSize(summaryFontSize);
      doc.setFont('helvetica', 'normal');
      const summaryLines = [
        `Fecha: ${new Date().toLocaleDateString()}`,
        `Total de Asistentes: ${attendees.length}`,
        `Presentes: ${presentAttendees.length}`,
        `Ausentes: ${absentAttendees.length}`,
        `Sin Marcar: ${unmarkedAttendees.length}`,
      ];
      summaryLines.forEach(line => {
        const lineWidth = doc.getTextWidth(line);
        doc.text(line, (pageWidth - lineWidth) / 2, y);
        y += summaryFontSize * 0.6 + 2; 
      });
      y += 10; 

      // Table
      const tableColumn = ["Nombre de Asistente", "Asistencia"];
      const tableRows = attendees.map(attendee => [
        attendee.name,
        attendee.status === 'present' ? 'Presente' :
        attendee.status === 'absent' ? 'Ausente' :
        'Sin Marcar'
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: y,
        theme: 'grid',
        styles: {
          font: 'helvetica',
          fontSize: 10,
        },
        headStyles: {
          fillColor: [63, 81, 181],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center',
        },
        columnStyles: {
          0: { halign: 'left', cellWidth: 'auto' },
          1: { halign: 'center', cellWidth: 80 },
        },
        didParseCell: function (data) {
          if (data.section === 'body' && data.column.index === 1) {
            const cellText = typeof data.cell.raw === 'string' ? data.cell.raw : (data.cell.text && data.cell.text[0]) || '';
            if (cellText === 'Presente') {
              data.cell.styles.textColor = [0, 100, 0];
            } else if (cellText === 'Ausente') {
              data.cell.styles.textColor = [200, 0, 0];
            } else if (cellText === 'Sin Marcar') {
              data.cell.styles.textColor = [128, 128, 128];
            }
          }
        },
        margin: { horizontal: margin },
        tableWidth: 'auto',
      });
      
      doc.save(`reporte_asistencia_${new Date().toISOString().split('T')[0]}.pdf`);

      toast({
        title: "Reporte Descargado",
      });
    } catch (error) {
        console.error("Error exporting data:", error);
        toast({
            title: "Fallo al Exportar",
            description: "No se pudo generar el reporte para descargar.",
            variant: "destructive",
        });
    }
  };

  return (
    <Button
      onClick={handleExport}
      className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
      <Download className="mr-2 h-5 w-5" />
      Exportar reporte
    </Button>
  );
}

