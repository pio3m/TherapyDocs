import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

import logoBase64 from './logo.png'; // Import obrazka jako Base64
import robotoFont from './Roboto-Regular.ttf'; // Import czcionki

// Interfejs danych
interface CertificateData {
  fullName: string;
  pesel: string;
  sessions: number;
  sessionDates: string[];
  pricePerSession: number;
  gender: 'Pan' | 'Pani';
}

// **Funkcja generująca i pobierająca PDF**
export const generatePDF = async (data: CertificateData) => {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // Rozmiar A4 (595x842 px)
  const currentDate = format(new Date(), 'd MMMM yyyy', { locale: pl });

  // **Załadowanie czcionki Roboto**
  const fontBytes = await fetch(robotoFont).then(res => res.arrayBuffer());
  const customFont = await doc.embedFont(fontBytes);

  page.setFont(customFont);
  page.setFontSize(12);

  // **Dodanie logotypu**
  const logoImage = await doc.embedPng(logoBase64);
  const imgWidth = 60;
  const aspectRatio = logoImage.width / logoImage.height;
  const imgHeight = imgWidth / aspectRatio;

  page.drawImage(logoImage, {
    x: (595 - imgWidth) / 2,
    y: 780,
    width: imgWidth,
    height: imgHeight,
  });

  // **Dodanie nagłówka i daty**
  page.drawText(`Płock, ${currentDate}`, { x: 400, y: 810, size: 10, color: rgb(0, 0, 0) });
  page.drawText('ZAŚWIADCZENIE', { x: 220, y: 750, size: 16, color: rgb(0, 0, 0) });

  // **Treść certyfikatu**
  const sessionDates = data.sessionDates.join(', ');
  const content = [
    `Niniejszym zaświadczam, iż ${data.gender} ${data.fullName} (PESEL ${data.pesel})`,
    `uczestniczył w ${data.sessions} konsultacjach psychoterapeutycznych w Centrum Obecności, w Płocku.`,
    "",
    `Sesje odbyły się w dniach: ${sessionDates}.`,
    `Ilość sesji odbytych: ${data.sessions}`,
    `Cena jednej sesji: ${data.pricePerSession} zł`,
    "",
    `Zaświadczenie wydaje się na bezpośrednią prośbę ${data.gender} ${data.fullName}.`
  ];

  let y = 700;
  content.forEach(line => {
    page.drawText(line, { x: 50, y, size: 12, color: rgb(0, 0, 0) });
    y -= 20;
  });

  // **Podpis i pieczęć**
  page.drawText('........................................', { x: 220, y: 200, size: 12, color: rgb(0, 0, 0) });
  page.drawText('Podpis terapeuty | Pieczęć ośrodka', { x: 190, y: 180, size: 12, color: rgb(0, 0, 0) });

  // **Zapisanie i automatyczne pobranie PDF**
  const pdfBytes = await doc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `zaswiadczenie_${data.fullName.replace(/\s+/g, '_')}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  URL.revokeObjectURL(url);
};
