import React, { useEffect } from 'react';
import { create } from 'zustand';

// Types
export type IoTReading = {
  timestamp: number;
  equipmentId: string;
  gasLevel: number;
};

const useIoTStore = create<{
  readings: IoTReading[];
  addReading: (r: IoTReading) => void;
  alerts: string[];
  addAlert: (msg: string) => void;
}>((set) => ({
  readings: [],
  alerts: [],
  addReading: (r) =>
    set((s) => {
      const updated = [...s.readings, r];
      return {
        readings: updated,
        alerts: r.gasLevel > 50 ? [...s.alerts, `⚠ Gaz élevé détecté pour ${r.equipmentId} (${r.gasLevel} ppm)`] : s.alerts,
      };
    }),
  addAlert: (msg) => set((s) => ({ alerts: [...s.alerts, msg] })),
}));

const SimulateIoT = () => {
  const addReading = useIoTStore((s) => s.addReading);
  useEffect(() => {
    const id = setInterval(() => {
      const reading: IoTReading = {
        timestamp: Date.now(),
        equipmentId: `EQ-${Math.ceil(Math.random() * 5)}`,
        gasLevel: Math.floor(Math.random() * 100),
      };
      addReading(reading);
    }, 5000);
    return () => clearInterval(id);
  }, [addReading]);
  return <p className="text-sm text-gray-600">Données IoT simulées toutes les 5 secondes...</p>;
};

const AlertList = () => {
  const alerts = useIoTStore((s) => s.alerts);
  return (
    <div className="space-y-2">
      {alerts.slice(-5).map((a, i) => (
        <div key={i} className="bg-red-100 text-red-700 p-2 rounded shadow">
          {a}
        </div>
      ))}
    </div>
  );
};

const IoTAutomationPage = () => (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold">Automatisation & IoT</h1>
    <SimulateIoT />
    <AlertList />
  </div>
);

export default IoTAutomationPage;
