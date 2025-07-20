import React, { useState } from 'react';
import { create } from 'zustand';

// Types
type ClientTicket = {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'closed';
};

// Store
const useClientPortalStore = create<{
  tickets: ClientTicket[];
  addTicket: (ticket: ClientTicket) => void;
}>((set) => ({
  tickets: [],
  addTicket: (ticket) => set((s) => ({ tickets: [...s.tickets, ticket] })),
}));

const TicketForm = () => {
  const addTicket = useClientPortalStore((s) => s.addTicket);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    addTicket({ id: crypto.randomUUID(), subject, message, status: 'open' });
    setSubject('');
    setMessage('');
  };

  return (
    <div className="space-y-2">
      <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Objet" className="input" />
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Votre message" className="input h-24" />
      <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
        Envoyer la demande
      </button>
    </div>
  );
};

const TicketList = () => {
  const tickets = useClientPortalStore((s) => s.tickets);
  return (
    <div className="space-y-2">
      {tickets.map((t) => (
        <div key={t.id} className="border p-3 rounded shadow">
          <div className="font-semibold">{t.subject}</div>
          <div className="text-sm text-gray-700">{t.message}</div>
          <div className="text-xs text-gray-500">Statut : {t.status}</div>
        </div>
      ))}
    </div>
  );
};

const ChatbotSim = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('Posez votre question ci-dessous.');

  const handleAsk = () => {
    const lower = input.toLowerCase();
    if (lower.includes('certificat')) setResponse("Vous pouvez télécharger vos certificats dans l'historique équipement.");
    else if (lower.includes('maintenance')) setResponse('Une maintenance est prévue. Consultez le planning.');
    else setResponse("Je n'ai pas compris. Veuillez reformuler.");
    setInput('');
  };

  return (
    <div className="space-y-2 border rounded p-4 bg-gray-50">
      <div className="text-sm text-gray-600">{response}</div>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Votre question..." className="input" />
      <button onClick={handleAsk} className="px-3 py-1 bg-indigo-600 text-white rounded">
        Demander
      </button>
    </div>
  );
};

const ClientPortalPage = () => (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold">Portail Client</h1>
    <ChatbotSim />
    <h2 className="text-xl font-semibold">Nouveau Ticket</h2>
    <TicketForm />
    <h2 className="text-xl font-semibold">Historique des demandes</h2>
    <TicketList />
  </div>
);

export default ClientPortalPage;
