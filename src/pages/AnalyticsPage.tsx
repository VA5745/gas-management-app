import React from 'react';
import { create } from 'zustand';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';

// Types
type ReportData = {
  date: string;
  interventions: number;
  incidents: number;
};

// Store
const useAnalyticsStore = create<{
  data: ReportData[];
}>((set) => ({
  data: [
    { date: '2025-07-01', interventions: 5, incidents: 1 },
    { date: '2025-07-02', interventions: 8, incidents: 0 },
    { date: '2025-07-03', interventions: 4, incidents: 2 },
    { date: '2025-07-04', interventions: 6, incidents: 1 },
  ],
}));

const ExportReportPDF = () => {
  const { data } = useAnalyticsStore();
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Rapport de maintenance', 20, 20);
    data.forEach((d, i) => {
      doc.text(`${d.date} - Interventions: ${d.interventions}, Incidents: ${d.incidents}`, 20, 30 + i * 10);
    });
    doc.save('rapport_maintenance.pdf');
  };
  return (
    <button onClick={exportPDF} className="px-4 py-2 bg-blue-600 text-white rounded">
      Exporter en PDF
    </button>
  );
};

const InterventionChart = () => {
  const { data } = useAnalyticsStore();
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" />
        <Line type="monotone" dataKey="interventions" stroke="#3b82f6" name="Interventions" />
        <Line type="monotone" dataKey="incidents" stroke="#ef4444" name="Incidents" />
      </LineChart>
    </ResponsiveContainer>
  );
};

const AnalyticsPage = () => (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold">Analytique & Rapports</h1>
    <InterventionChart />
    <ExportReportPDF />
  </div>
);

export default AnalyticsPage;
