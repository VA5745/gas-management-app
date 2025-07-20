import React, { useState } from 'react';
import { create } from 'zustand';

// Types
type TrainingModule = {
  id: string;
  title: string;
  completed: boolean;
};

const useTrainingStore = create<{
  modules: TrainingModule[];
  toggleCompletion: (id: string) => void;
}>((set) => ({
  modules: [
    { id: 'm1', title: 'Procédure d’étalonnage', completed: false },
    { id: 'm2', title: 'Consignes de sécurité gaz', completed: false },
    { id: 'm3', title: 'Utilisation du détecteur portable', completed: true },
  ],
  toggleCompletion: (id) => set((s) => ({ modules: s.modules.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m)) })),
}));

const TrainingList = () => {
  const { modules, toggleCompletion } = useTrainingStore();
  return (
    <div className="space-y-4">
      {modules.map((m) => (
        <div key={m.id} className="p-4 border rounded shadow flex justify-between items-center">
          <div>
            <div className="font-semibold">{m.title}</div>
            <div className="text-sm text-gray-500">{m.completed ? '✅ Terminé' : '⏳ En cours'}</div>
          </div>
          <button onClick={() => toggleCompletion(m.id)} className={`px-3 py-1 rounded text-white ${m.completed ? 'bg-gray-500' : 'bg-green-600'}`}>
            {m.completed ? 'Revoir' : 'Marquer comme terminé'}
          </button>
        </div>
      ))}
    </div>
  );
};

const DocumentationSearch = () => {
  const [query, setQuery] = useState('');
  const docs = ['Manuel technique détecteur X3000', 'Procédure de vérification bump test', 'Liste des gaz détectables'];
  const filtered = docs.filter((d) => d.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="space-y-2">
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher dans la documentation..." className="input" />
      <ul className="list-disc ml-4 text-sm">
        {filtered.map((doc, i) => (
          <li key={i}>{doc}</li>
        ))}
      </ul>
    </div>
  );
};

const TrainingPage = () => (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold">Formations & Compétences</h1>
    <h2 className="text-xl font-semibold">Modules de formation</h2>
    <TrainingList />
    <h2 className="text-xl font-semibold mt-6">Documentation technique</h2>
    <DocumentationSearch />
  </div>
);

export default TrainingPage;
