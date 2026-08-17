'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getWorkspaces, Workspace } from '@/lib/api/workspace';
import CreateWorkspaceModal from './components/CreateWorkspaceModal';

export default function WorkspacesPage() {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchWorkspaces = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getWorkspaces();
      setWorkspaces(data);
    } catch (err) {
      setError('Failed to load workspaces');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleWorkspaceCreated = () => {
    setIsModalOpen(false);
    fetchWorkspaces();
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Workspaces</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create Workspace
        </button>
      </div>

      {workspaces.length === 0 ? (
        <p className="text-gray-500">No workspaces yet. Create your first one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((ws) => (
            <div
              key={ws.id}
              className="border rounded-lg p-4 shadow hover:shadow-md cursor-pointer"
              onClick={() => router.push(`/workspaces/${ws.id}`)}
            >
              <h2 className="text-xl font-semibold">{ws.name}</h2>
              <p className="text-gray-600">{ws.description || 'No description'}</p>
              <p className="text-sm text-gray-400 mt-2">
                Owner: {ws.owner.email}
              </p>
            </div>
          ))}
        </div>
      )}

      <CreateWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleWorkspaceCreated}
      />
    </div>
  );
}