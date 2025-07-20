import React, { useState } from 'react';
import { create } from 'zustand';

// Types
type StockItem = {
  id: string;
  name: string;
  quantity: number;
  minThreshold: number;
  expirationDate: string;
};

// Store
const useStockStore = create<{
  items: StockItem[];
  add: (item: StockItem) => void;
  updateQty: (id: string, qty: number) => void;
}>((set) => ({
  items: [
    { id: 'c1', name: 'Capteur gaz CO2', quantity: 5, minThreshold: 3, expirationDate: '2025-10-01' },
    { id: 'f1', name: 'Filtre H2S', quantity: 2, minThreshold: 5, expirationDate: '2025-08-20' },
  ],
  add: (item) => set((s) => ({ items: [...s.items, item] })),
  updateQty: (id, qty) => set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)) })),
}));

const StockDashboard = () => {
  const items = useStockStore((s) => s.items);
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isLow = item.quantity <= item.minThreshold;
        const isExpiring = item.expirationDate <= today;
        return (
          <div
            key={item.id}
            className={`p-4 border rounded shadow ${isLow ? 'border-red-500' : isExpiring ? 'border-yellow-500' : 'border-gray-300'}`}
          >
            <div className="flex justify-between">
              <div>
                <div className="font-bold">{item.name}</div>
                <div>Quantité : {item.quantity}</div>
                <div>Expiration : {item.expirationDate}</div>
              </div>
              {isLow && <div className="text-red-600 font-semibold">⚠ Stock faible</div>}
              {isExpiring && <div className="text-yellow-600 font-semibold">⚠ Bientôt périmé</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const AddStockItem = () => {
  const add = useStockStore((s) => s.add);
  const [form, setForm] = useState({ name: '', quantity: 1, minThreshold: 1, expirationDate: '' });

  const handleSubmit = () => {
    const item: StockItem = {
      id: crypto.randomUUID(),
      ...form,
      quantity: Number(form.quantity),
      minThreshold: Number(form.minThreshold),
    };
    add(item);
    setForm({ name: '', quantity: 1, minThreshold: 1, expirationDate: '' });
  };

  return (
    <div className="space-y-2">
      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nom consommable" className="input" />
      <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} placeholder="Quantité" className="input" />
      <input type="number" value={form.minThreshold} onChange={(e) => setForm({ ...form, minThreshold: Number(e.target.value) })} placeholder="Seuil minimum" className="input" />
      <input type="date" value={form.expirationDate} onChange={(e) => setForm({ ...form, expirationDate: e.target.value })} className="input" />
      <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded">
        Ajouter / Simuler Commande
      </button>
    </div>
  );
};

const StockPage = () => (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold">Gestion des Stocks</h1>
    <AddStockItem />
    <StockDashboard />
  </div>
);

export default StockPage;
