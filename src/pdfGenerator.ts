import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

import logo from './logo.png'; // Importuj lokalny plik PNG (np. logo.png).

// Zaimportuj czcionkę
import './roboto-normal.js'; // Plik wygenerowany przez fontconverter


interface CertificateData {
  fullName: string;
  pesel: string;
  sessions: number;
  sessionDates: string[]; // Daty sesji w formacie "dd.MM.yyyy".
  pricePerSession: number; // Cena jednej sesji.
}

export const generatePDF = (data: CertificateData) => {
  const doc = new jsPDF();
  const currentDate = format(new Date(), 'd MMMM yyyy', { locale: pl });


  // Dodanie niestandardowej czcionki
  doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal'); // Zgodnie z nazwą w wygenerowanym pliku
  doc.setFont('Roboto'); // Ustawienie czcionki jako aktywnej


  // Dodanie logotypu
  const img = new Image();
  img.src = logo; // Lokalny plik wczytany dzięki Webpack/Vite.
  const aspectRatio = img.width / img.height; // Obliczanie proporcji
  const newWidth = 60; // Ustalona szerokość
  const newHeight = newWidth / aspectRatio; // Oblicz wysokość na podstawie proporcji

  doc.addImage(img, 'PNG', 20, 10, newWidth, newHeight);

  // Lokalizacja i data w prawym górnym rogu
  doc.setFontSize(10);
  doc.text('Płock, ' + currentDate, 180, 20, { align: 'right' });

  // Nagłówek "ZAŚWIADCZENIE"
  doc.setFontSize(16);
  doc.text("ZAŚWIADCZENIE", 105, 60, { align: "center" });

  // Treść główna
  doc.setFontSize(12);
  doc.setFont("Roboto", "normal");
  const sessionDates = data.sessionDates.join(' - ');
  const content = [
    `Niniejszym zaświadczam, iż ${data.fullName} (PESEL ${data.pesel}) uczestniczył w ${data.sessions} konsultacjach`,
    `psychoterapeutycznych w Centrum Obecności, w Płocku.`,
    "",
    `Sesje odbyły się w dniach: ${sessionDates}.`,
    `Ilość sesji odbytych: ${data.sessions}`,
    `Cena jednej sesji: ${data.pricePerSession} zł`,
    "",
    "Zaświadczenie wydaje się na bezpośrednią prośbę " + (data.fullName.includes("Pan") ? "Pana " : "Pani ") + data.fullName
  ];

  doc.text(content, 20, 80);

  // Podpis terapeuty
  doc.text("........................................", 105, 140, { align: "center" });
  doc.text("Podpis i pieczęć terapeuty", 105, 150, { align: "center" });

  // Zapisanie PDF
  doc.save(`zaswiadczenie_${data.fullName.replace(/\s+/g, '_')}.pdf`);
};