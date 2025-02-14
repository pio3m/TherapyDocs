import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

import logo from './logo.png'; // Importuj lokalny plik PNG (np. logo.png).


interface CertificateData {
  fullName: string;
  pesel: string;
  sessions: number;
  sessionDates: string[]; // Daty sesji w formacie "dd.MM.yyyy".
  pricePerSession: number; // Cena jednej sesji.
}

export const generatePDF = (data: CertificateData & { gender: 'Pan' | 'Pani' }) => {
  const doc = new jsPDF();
  const currentDate = format(new Date(), 'd MMMM yyyy', { locale: pl });
  doc.setFont("DejaVuSans", "normal");
  // Dodanie logotypu
  const img = new Image();
  img.src = logo; // Lokalny plik wczytany dzięki Webpack/Vite.
  const aspectRatio = img.width / img.height; // Obliczanie proporcji
  const newWidth = 60; // Ustalona szerokość
  const newHeight = newWidth / aspectRatio; // Oblicz wysokość na podstawie proporcji

  // Ustawienie zdjęcia centralnie nad tytułem
  const imgX = (doc.internal.pageSize.getWidth() - newWidth) / 2; // Obliczanie współrzędnej X dla centrowania
  doc.addImage(img, 'PNG', imgX, 20, newWidth, newHeight); // Zmiana współrzędnej Y na 40

  // Lokalizacja i data w prawym górnym rogu
  doc.setFontSize(10);
  doc.text('Płock, ' + currentDate, 180, 20, { align: 'right' });

  doc.setFontSize(16);
  doc.text("ZAŚWIADCZENIE", 105, 60, { align: "center" });

  // Treść główna
  doc.setFontSize(12);
  const sessionDates = data.sessionDates.join(', '); // Wyrównanie dat sesji po przecinku
  const content = [
    `Niniejszym zaświadczam, iż ${data.gender} ${data.fullName} (PESEL ${data.pesel}) uczestniczył w ${data.sessions} konsultacjach`,
    `psychoterapeutycznych w Centrum Obecności, w Płocku.`,
    "",
    `Sesje odbyły się w dniach: ${sessionDates}.`,
    `Ilość sesji odbytych: ${data.sessions}`,
    `Cena jednej sesji: ${data.pricePerSession} zł`,
    "",
    "Zaświadczenie wydaje się na bezpośrednią prośbę ${data.gender} ${data.fullName}"
  ];

  // Justowanie tekstu
  doc.text(content, 20, 80, { align: "left" }); // Justowanie tekstu

  // Podpis terapeuty i pieczęć ośrodka w tej samej linii
  doc.text("........................................", 105, 140, { align: "center" });
  doc.text("Podpis terapeuty Pieczęć ośrodka", 105, 150, { align: "center" }); // Zmiana tekstu

  // Zapisanie PDF
  doc.save(`zaswiadczenie_${data.fullName.replace(/\s+/g, '_')}.pdf`);
};