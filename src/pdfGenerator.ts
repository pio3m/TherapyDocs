import { Document, Page, Text, View, Image, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

import logo from './logo.png'; // Import logo lokalnie
import DejaVuSans from './DejaVuSans.ttf'; // Import czcionki obsługującej polskie znaki

// Rejestracja czcionki, aby obsługiwała polskie znaki
Font.register({
  family: 'DejaVuSans',
  src: DejaVuSans,
});

// Style dla PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'DejaVuSans',
  },
  header: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'left',
  },
  signature: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 40,
  },
  date: {
    fontSize: 10,
    textAlign: 'right',
    marginBottom: 20,
  },
  logo: {
    width: 60,
    alignSelf: 'center',
    marginBottom: 20,
  },
});

// Interfejs danych
interface CertificateData {
  fullName: string;
  pesel: string;
  sessions: number;
  sessionDates: string[];
  pricePerSession: number;
  gender: 'Pan' | 'Pani';
}

// Komponent PDF
const CertificatePDF = ({ data }: { data: CertificateData }) => {
  const currentDate = format(new Date(), 'd MMMM yyyy', { locale: pl });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Data w prawym górnym rogu */}
        <Text style={styles.date}>Płock, {currentDate}</Text>

        {/* Logo */}
        <Image style={styles.logo} src={logo} />

        {/* Nagłówek */}
        <Text style={styles.header}>ZAŚWIADCZENIE</Text>

        {/* Treść główna */}
        <View>
          <Text style={styles.text}>
            Niniejszym zaświadczam, iż {data.gender} {data.fullName} (PESEL {data.pesel}) uczestniczył w {data.sessions} konsultacjach
            psychoterapeutycznych w Centrum Obecności, w Płocku.
          </Text>
          <Text style={styles.text}>Sesje odbyły się w dniach: {data.sessionDates.join(', ')}.</Text>
          <Text style={styles.text}>Ilość sesji odbytych: {data.sessions}</Text>
          <Text style={styles.text}>Cena jednej sesji: {data.pricePerSession} zł</Text>
          <Text style={styles.text}>Zaświadczenie wydaje się na bezpośrednią prośbę {data.gender} {data.fullName}.</Text>
        </View>

        {/* Podpis terapeuty */}
        <Text style={styles.signature}>
          ........................................
        </Text>
        <Text style={styles.signature}>
          Podpis terapeuty | Pieczęć ośrodka
        </Text>
      </Page>
    </Document>
  );
};

// Komponent przycisku do pobrania PDF
const GeneratePDFButton = ({ data }: { data: CertificateData }) => {
  return (
    <PDFDownloadLink
      document={<CertificatePDF data={data} />}
      fileName={`zaswiadczenie_${data.fullName.replace(/\s+/g, '_')}.pdf`}
    >
      {({ loading }) => (loading ? 'Generowanie PDF...' : 'Pobierz Zaświadczenie')}
    </PDFDownloadLink>
  );
};

export default GeneratePDFButton;
