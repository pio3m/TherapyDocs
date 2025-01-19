import React, { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { generatePDF } from './pdfGenerator';

interface FormData {
  fullName: string;
  pesel: string;
  sessions: number;
  sessionDates: string[];
  pricePerSession: number;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    pesel: '',
    sessions: 1,
    sessionDates: [''], // Tablica z datami sesji, początkowo pusta
    pricePerSession: 0, // Cena jednej sesji
  });

  // Obsługa przesłania formularza
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Sprawdzanie, czy wszystkie daty są podane
    const missingDates = formData.sessionDates.some(date => !date.trim());
    if (missingDates) {
      alert('Proszę wypełnić wszystkie daty sesji.');
      return;
    }
    if (formData.pricePerSession <= 0) {
      alert('Proszę podać poprawną cenę za sesję.');
      return;
    }
    generatePDF(formData);
  };

  // Obsługa zmiany w polach tekstowych i numerycznych
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'sessions' || name === 'pricePerSession' ? parseFloat(value) || 0 : value,
    }));
  };

  // Obsługa zmiany w polach dla dat sesji
  const handleDateChange = (index: number, value: string) => {
    const updatedDates = [...formData.sessionDates];
    updatedDates[index] = value;
    setFormData(prev => ({
      ...prev,
      sessionDates: updatedDates,
    }));
  };

  // Obsługa dodania nowego pola daty
  const handleAddDateField = () => {
    setFormData(prev => ({
      ...prev,
      sessionDates: [...prev.sessionDates, ''],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 py-6">
          <div className="flex items-center justify-center mb-6">
            <FileText className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">
            Generator Zaświadczeń Terapeutycznych
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Imię i Nazwisko
              </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>

            <div>
              <label htmlFor="pesel" className="block text-sm font-medium text-gray-700">
                PESEL
              </label>
              <input
                type="text"
                name="pesel"
                id="pesel"
                required
                pattern="[0-9]{11}"
                value={formData.pesel}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>

            <div>
              <label htmlFor="sessions" className="block text-sm font-medium text-gray-700">
                Liczba Sesji
              </label>
              <input
                type="number"
                name="sessions"
                id="sessions"
                required
                min="1"
                value={formData.sessions}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Daty Sesji
              </label>
              {formData.sessionDates.map((date, index) => (
                <input
                  key={index}
                  type="date"
                  required
                  value={date}
                  onChange={(e) => handleDateChange(index, e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border mb-2"
                />
              ))}
              <button
                type="button"
                onClick={handleAddDateField}
                className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                Dodaj kolejną datę
              </button>
            </div>

            <div>
              <label htmlFor="pricePerSession" className="block text-sm font-medium text-gray-700">
                Cena Jednej Sesji (zł)
              </label>
              <input
                type="number"
                name="pricePerSession"
                id="pricePerSession"
                required
                min="0"
                step="0.01"
                value={formData.pricePerSession}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Download className="h-4 w-4" />
              Generuj Zaświadczenie
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
