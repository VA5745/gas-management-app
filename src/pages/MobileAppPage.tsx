import React from 'react';
import QrReader from 'react-qr-reader';
import { create } from 'zustand';

// Types
type MobileEquipment = {
  id: string;
  model: string;
  status: 'in_use' | 'maintenance';
};

const useMobileStore = create<{
  scannedId: string | null;
  setScannedId: (id: string | null) => void;
  equipments: MobileEquipment[];
}>((set) => ({
  scannedId: null,
  setScannedId: (id) => set({ scannedId: id }),
  equipments: [
    { id: 'EQ123', model: 'X3000', status: 'in_use' },
    { id: 'EQ456', model: 'Alpha 5', status: 'maintenance' },
  ],
}));

const QRScan = () => {
  const setScannedId = useMobileStore((s) => s.setScannedId);
  const handleScan = (data: string | null) => {
    if (data) setScannedId(data);
  };
  return <QrReader delay={300} onError={console.error} onScan={handleScan} style={{ width: '100%' }} />;
};

const EquipmentDetails = () => {
  const { scannedId, equipments } = useMobileStore();
  const equipment = equipments.find((e) => e.id === scannedId);
  if (!equipment) return <div className="text-gray-500">Aucun équipement trouvé</div>;
  return (
    <div className="p-4 border rounded shadow">
      <h2 className="font-bold">Équipement : {equipment.model}</h2>
      <p>Status : {equipment.status === 'in_use' ? '✅ En service' : '🛠 En maintenance'}</p>
      <div className="mt-4 flex gap-2">
        <button className="px-3 py-1 bg-blue-600 text-white rounded">Faire un Bump Test</button>
        <button className="px-3 py-1 bg-green-600 text-white rounded">Valider maintenance</button>
      </div>
    </div>
  );
};

const MobileAppPage = () => (
  <div className="p-4 space-y-4">
    <h1 className="text-xl font-bold">Scan d’Équipement (Technicien)</h1>
    <QRScan />
    <EquipmentDetails />
  </div>
);

export default MobileAppPage;
