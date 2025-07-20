import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { create } from 'zustand';
import QRCode from 'react-qr-code';
import QrScanner from 'react-qr-scanner';

// Types
export type Equipment = {
  id: string;
  brand: string;
  model: string;
  gasTypes: string[];
  status: 'stock' | 'in_use' | 'maintenance';
  serial: string;
  site: string;
};

// Store
const useEquipmentStore = create<{
  equipments: Equipment[];
  add: (eq: Equipment) => void;
  remove: (id: string) => void;
}>((set) => ({
  equipments: [],
  add: (eq) => set((s) => ({ equipments: [...s.equipments, eq] })),
  remove: (id) => set((s) => ({ equipments: s.equipments.filter((e) => e.id !== id) })),
}));

// Form component
const EquipmentForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const add = useEquipmentStore((s) => s.add);

  const onSubmit = (data: any) => {
    const newEquipment: Equipment = {
      id: crypto.randomUUID(),
      brand: data.brand,
      model: data.model,
      gasTypes: data.gasTypes.split(','),
      status: data.status,
      serial: data.serial,
      site: data.site,
    };
    add(newEquipment);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <input {...register('brand')} placeholder="Marque" className="input" />
      <input {...register('model')} placeholder="Modèle" className="input" />
      <input {...register('gasTypes')} placeholder="Gaz détectés (séparés par ,)" className="input" />
      <input {...register('serial')} placeholder="Numéro de série" className="input" />
      <input {...register('site')} placeholder="Site" className="input" />
      <select {...register('status')} className="input">
        <option value="stock">En stock</option>
        <option value="in_use">En service</option>
        <option value="maintenance">En maintenance</option>
      </select>
      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Ajouter</button>
    </form>
  );
};

// List component
const EquipmentList = () => {
  const equipments = useEquipmentStore((s) => s.equipments);
  const remove = useEquipmentStore((s) => s.remove);

  return (
    <div className="space-y-4">
      {equipments.map((e) => (
        <div key={e.id} className="p-4 border rounded shadow-sm">
          <div className="font-bold">
            {e.brand} {e.model}
          </div>
          <div>
            {e.status} - SN: {e.serial}
          </div>
          <div className="my-2">
            <QRCode value={e.id} size={64} />
          </div>
          <button onClick={() => remove(e.id)} className="text-red-600">
            Supprimer
          </button>
        </div>
      ))}
    </div>
  );
};

// QR Scanner
const QrScannerView = ({ onScan }: { onScan: (value: string) => void }) => {
  const handleScan = (data: any) => {
    if (data) onScan(data.text);
  };
  return <QrScanner delay={300} onError={console.error} onScan={handleScan} style={{ height: 200, width: 200 }} />;
};

// Timeline simple
const EquipmentTimeline = ({ id }: { id: string }) => (
  <div className="p-4 border-l-4 border-blue-500">
    <p>Historique pour l'équipement #{id}</p>
    <ul className="list-disc ml-4">
      <li>12/07/2025 : Étalonnage réussi</li>
      <li>01/06/2025 : Maintenance préventive</li>
    </ul>
  </div>
);

const EquipmentsPage = () => {
  const [scannedId, setScannedId] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestion des Équipements</h1>
      <EquipmentForm />
      <QrScannerView onScan={setScannedId} />
      {scannedId && <EquipmentTimeline id={scannedId} />}
      <EquipmentList />
    </div>
  );
};

export default EquipmentsPage;
