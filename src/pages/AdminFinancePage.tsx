import React, { useState } from 'react';
import { create } from 'zustand';
import jsPDF from 'jspdf';

// Types
type Contract = {
  id: string;
  client: string;
  service: string;
  renewalDate: string;
};

const useAdminStore = create<{
  contracts: Contract[];
  addContract: (c: Contract) => void;
}>((set) => ({
  contracts: [
    { id: 'ct1', client: 'Société A', service: 'Maintenance annuelle', renewalDate: '2025-08-15' },
  ],
  addContract: (c) => set((s) => ({ contracts: [...s.contracts, c] })),
}));

const ContractForm = () => {
  const addContract = useAdminStore((s) => s.addContract);
  const [form, setForm] = useState({ client: '', service: '', renewalDate: '' });

  const handleSubmit = () => {
    const contract: Contract = { id: crypto.randomUUID(), ...form };
    addContract(contract);
    setForm({ client: '', service: '', renewalDate: '' });
  };

  return (
    <div className="space-y-2">
      <input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="Client" className="input" />
      <input value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} placeholder="Service" className="input" />
      <input type="date" value={form.renewalDate} onChange={(e) => setForm({ ...form, renewalDate: e.target.value })} className="input" />
      <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Ajouter Contrat</button>
    </div>
  );
};

const ContractList = () => {
  const contracts = useAdminStore((s) => s.contracts);
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-2">
      {contracts.map((c) => (
        <div key={c.id} className={`p-3 border rounded shadow ${c.renewalDate <= today ? 'border-red-500' : 'border-gray-300'}`}>
          <div className="font-semibold">{c.client}</div>
          <div>{c.service}</div>
          <div className="text-sm">Renouvellement : {c.renewalDate}</div>
          {c.renewalDate <= today && <div className="text-red-600 font-bold">⚠ Contrat à renouveler</div>}
        </div>
      ))}
    </div>
  );
};

const GenerateInvoice = () => {
  const [client, setClient] = useState('');
  const [service, setService] = useState('');
  const [amount, setAmount] = useState('');

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('FACTURE', 20, 20);
    doc.text(`Client : ${client}`, 20, 30);
    doc.text(`Service : ${service}`, 20, 40);
    doc.text(`Montant : ${amount} €`, 20, 50);
    doc.save(`facture_${client}.pdf`);
  };

  return (
    <div className="space-y-2 mt-6">
      <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" className="input" />
      <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service" className="input" />
      <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Montant (€)" className="input" />
      <button onClick={exportPDF} className="px-4 py-2 bg-green-600 text-white rounded">Générer Facture PDF</button>
    </div>
  );
};

const AdminFinancePage = () => (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold">Gestion Administrative & Financière</h1>
    <h2 className="text-xl font-semibold">Contrats</h2>
    <ContractForm />
    <ContractList />
    <h2 className="text-xl font-semibold">Facturation</h2>
    <GenerateInvoice />
  </div>
);

export default AdminFinancePage;
