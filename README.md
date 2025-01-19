# TherapyDocs - Generator Zaświadczeń Terapeutycznych

TherapyDocs to aplikacja do generowania profesjonalnych zaświadczeń terapeutycznych w formacie PDF. Umożliwia szybkie i wygodne tworzenie dokumentów na podstawie danych wprowadzonych w formularzu.

## Funkcjonalności

- **Dynamiczny formularz**: Możliwość wprowadzania danych takich jak:
  - Imię i nazwisko
  - PESEL
  - Liczba odbytych sesji
  - Daty poszczególnych sesji
  - Cena jednej sesji
- **Generowanie PDF**: Zaświadczenie w formacie PDF zawiera wszystkie podane informacje, wraz z logotypem i poprawnym formatowaniem tekstu.
- **Obsługa języka polskiego**: Użycie czcionek obsługujących polskie znaki diakrytyczne.

## Wymagania

- **Node.js** (wersja 16 lub nowsza)
- Menedżer pakietów npm lub yarn
- Biblioteki zainstalowane w projekcie:
  - `jspdf` – do generowania plików PDF
  - `lucide-react` – ikony do interfejsu użytkownika
  - `date-fns` – formatowanie dat

## Instalacja

1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/twoje-repo/therapy-docs.git
   cd therapy-docs
