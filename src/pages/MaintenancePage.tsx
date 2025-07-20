import React, { useState } from 'react';
import { create } from 'zustand';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import jsPDF from 'jspdf';

// Types
export type MaintenanceEvent = {
  id: string;
  equipmentId: string;
  type: 'calibration' | 'maintenance' | 'bump';
  date: string;
  status: 'planned' | 'done' | 'missed';
};

// Store
const useMaintenanceStore = create<{
  events: MaintenanceEvent[];
  add: (e: MaintenanceEvent) => void;
}>((set) => ({
  events: [],
  add: (e) => set((s) => ({ events: [...s.events, e] })),
}));

// Add maintenance component
const AddMaintenance = () => {
  const add = useMaintenanceStore((s) => s.add);
  const [form, setForm] = useState({ equipmentId: '', type: 'calibration', date: '' });

  const handleSubmit = () => {
    const newEvent: MaintenanceEvent = {
      id: crypto.randomUUID(),
      ...form,
      status: 'planned',
    };
    add(newEvent);
    setForm({ equipmentId: '', type: 'calibration', date: '' });
  };

  return (
    <div className="space-y-2">
      <input
        value={form.equipmentId}
        onChange={(e) => setForm({ ...form, equipmentId: e.target.value })}
        placeholder="ID équipement"
        className="input"
      />
      <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })} className="input">
        <option value="calibration">Étalonnage</option>
        <option value="maintenance">Maintenance</option>
        <option value="bump">Bump Test</option>
      </select>
      <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input" />
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
        Ajouter
      </button>
    </div>
  );
};

// Calendar component
const MaintenanceCalendar = () => {
  const events = useMaintenanceStore((s) => s.events);
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events.map((e) => ({
        id: e.id,
        title: `${e.type} - ${e.status}`,
        date: e.date,
        color: e.status === 'done' ? 'green' : e.status === 'missed' ? 'red' : 'orange',
      }))}
    />
  );
};

// Generate certificate
const GenerateCertificate = ({ event }: { event: MaintenanceEvent }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`Certificat d'étalonnage`, 20, 20);
    doc.text(`Équipement : ${event.equipmentId}`, 20, 30);
    doc.text(`Type : ${event.type}`, 20, 40);
    doc.text(`Date : ${event.date}`, 20, 50);
    doc.text(`Statut : ${event.status}`, 20, 60);
    doc.save(`certificat_${event.equipmentId}.pdf`);
  };
  return (
    <button onClick={generatePDF} className="text-blue-600 underline">
      Télécharger Certificat PDF
    </button>
  );
};

// Bump test workflow
const BumpTestWorkflow = () => {
  const [step, setStep] = useState(0);
  const steps = ['Connecter le capteur de gaz', 'Lancer le test de gaz', 'Observer le comportement', 'Confirmer les seuils', 'Valider le test'];

  return (
    <div className="p-4 border rounded space-y-4">
      <h2 className="text-xl font-bold">Bump Test Guidé</h2>
      <p>{steps[step]}</p>
      <div className="space-x-2">
        <button disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="px-2 py-1 bg-gray-300 rounded">
          Précédent
        </button>
        {step < steps.length - 1 ? (
          <button onClick={() => setStep((s) => s + 1)} className="px-2 py-1 bg-green-600 text-white rounded">
            Suivant
          </button>
        ) : (
          <span className="text-green-600 font-bold">Test terminé ✅</span>
        )}
      </div>
    </div>
  );
};

const MaintenancePage = () => {
  const events = useMaintenanceStore((s) => s.events);
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Maintenance & Étalonnage</h1>
      <AddMaintenance />
      <MaintenanceCalendar />
      <h2 className="text-xl font-semibold">Certificats</h2>
      <div className="space-y-2">
        {events.filter((e) => e.type === 'calibration' && e.status === 'done').map((e) => (
          <GenerateCertificate key={e.id} event={e} />
        ))}
      </div>
      <BumpTestWorkflow />
    </div>
  );
};

export default MaintenancePage;
