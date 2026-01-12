import { useCallback } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Presentation } from '../store/types/presentation';
import { createRoot } from 'react-dom/client';
import { PdfSlide } from './PdfSlide';

export const usePdfExport = () => {
  const exportToPdf = useCallback(async (presentation: Presentation) => {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [960, 540],
    });

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    document.body.appendChild(container);

    for (let i = 0; i < presentation.slides.length; i++) {
      const slide = presentation.slides[i];

      container.innerHTML = '';
      const root = createRoot(container);
      root.render(<PdfSlide slide={slide} />);

      await new Promise((r) => setTimeout(r, 50));

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
      });

      const img = canvas.toDataURL('image/png');

      if (i > 0) pdf.addPage();
      pdf.addImage(img, 'PNG', 0, 0, 960, 540);

      root.unmount();
    }

    document.body.removeChild(container);
    pdf.save(`${presentation.title}.pdf`);
  }, []);

  return { exportToPdf };
};
