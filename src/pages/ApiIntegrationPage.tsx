import React from 'react';
import { create } from 'zustand';

// Types
type APIContract = {
  id: string;
  client: string;
  service: string;
  renewalDate: string;
};

const useApiDataStore = create<{
  contracts: APIContract[];
}>((set) => ({
  contracts: [
    { id: 'ct-api-1', client: 'Client API', service: 'Support 24/7', renewalDate: '2026-01-01' },
  ],
}));

const fetchContractsFromApi = () => {
  const contracts = useApiDataStore.getState().contracts;
  return new Promise<APIContract[]>((resolve) => setTimeout(() => resolve(contracts), 500));
};

const ERPIntegrationDemo = () => {
  const [data, setData] = React.useState<APIContract[] | null>(null);
  const handleFetch = async () => {
    const res = await fetchContractsFromApi();
    setData(res);
  };

  return (
    <div className="space-y-4">
      <button onClick={handleFetch} className="px-4 py-2 bg-indigo-600 text-white rounded">Appeler l'API externe</button>
      {data && (
        <ul className="text-sm list-disc ml-4">
          {data.map((c) => (
            <li key={c.id}>
              {c.client} – {c.service} – renouvellement {c.renewalDate}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const ApiDocumentation = () => (
  <div className="bg-gray-100 p-4 rounded shadow text-sm">
    <h3 className="font-bold mb-2">📘 API Documentation (Simulation)</h3>
    <p>
      <strong>GET /api/contracts</strong> — retourne tous les contrats
    </p>
    <p>
      <strong>POST /api/contracts</strong> — ajoute un contrat
    </p>
    <p>
      <strong>PUT /api/contracts/:id</strong> — met à jour un contrat
    </p>
    <p>
      <strong>DELETE /api/contracts/:id</strong> — supprime un contrat
    </p>
  </div>
);

const ApiIntegrationPage = () => (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold">Intégration API & ERP</h1>
    <ERPIntegrationDemo />
    <ApiDocumentation />
  </div>
);

export default ApiIntegrationPage;
