import React from 'react';
import { create } from 'zustand';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { DndContext, closestCenter, useDraggable, useDroppable } from '@dnd-kit/core';
import 'leaflet/dist/leaflet.css';

// Types
type Technician = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

type Intervention = {
  id: string;
  label: string;
  assignedTo?: string;
};

// Store
const usePlanningStore = create<{
  technicians: Technician[];
  interventions: Intervention[];
  assign: (interventionId: string, technicianId: string) => void;
}>((set) => ({
  technicians: [
    { id: 't1', name: 'Alice', lat: 48.85, lng: 2.35 },
    { id: 't2', name: 'Bob', lat: 43.6, lng: 1.44 },
  ],
  interventions: [
    { id: 'i1', label: 'Maintenance capteur A' },
    { id: 'i2', label: 'Étalonnage détecteur B' },
  ],
  assign: (id, techId) =>
    set((s) => ({ interventions: s.interventions.map((i) => (i.id === id ? { ...i, assignedTo: techId } : i)) })),
}));

// Draggable item
const DraggableItem = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style} className="p-2 bg-white shadow rounded">
      {children}
    </div>
  );
};

const DroppableTechnician = ({ technician }: { technician: Technician }) => {
  const { isOver, setNodeRef } = useDroppable({ id: technician.id });
  const style = isOver ? { backgroundColor: '#d1fae5' } : {};
  const interventions = usePlanningStore((s) => s.interventions);
  return (
    <div ref={setNodeRef} style={style} className="p-2 border rounded">
      <strong>{technician.name}</strong>
      <ul className="text-sm list-disc ml-4">
        {interventions.filter((i) => i.assignedTo === technician.id).map((i) => (
          <li key={i.id}>{i.label}</li>
        ))}
      </ul>
    </div>
  );
};

const TechnicianMap = () => {
  const technicians = usePlanningStore((s) => s.technicians);
  return (
    <MapContainer center={[46.5, 2.5]} zoom={6} className="h-96 w-full z-0">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {technicians.map((t) => (
        <Marker key={t.id} position={[t.lat, t.lng]}>
          <Popup>
            <strong>{t.name}</strong>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

const PlanningPage = () => {
  const interventions = usePlanningStore((s) => s.interventions);
  const technicians = usePlanningStore((s) => s.technicians);
  const assign = usePlanningStore((s) => s.assign);

  const handleDragEnd = (event: any) => {
    const { over, active } = event;
    if (over && active) assign(active.id, over.id);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Planification des Interventions</h1>
      <TechnicianMap />
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <h2 className="font-semibold">Interventions non assignées</h2>
            {interventions.filter((i) => !i.assignedTo).map((i) => (
              <DraggableItem key={i.id} id={i.id}>
                {i.label}
              </DraggableItem>
            ))}
          </div>
          {technicians.map((t) => (
            <DroppableTechnician key={t.id} technician={t} />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default PlanningPage;
