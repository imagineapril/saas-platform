'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getWorkspace, deleteWorkspace, Workspace } from '@/lib/api/workspace';
import EditWorkspaceModal from './components/EditWorkspaceModal';

export default function WorkspaceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchWorkspace = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getWorkspace(id);
      setWorkspace(data);
    } catch (err) {
      setError('Workspace not found or you have no access');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchWorkspace();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this workspace?')) return;
    try {
      await deleteWorkspace(id);
      router.push('/workspaces');
    } catch (err) {
      alert('Failed to delete workspace');
    }
  };

  const handleUpdate = () => {
    setIsEditModalOpen(false);
    fetchWorkspace();
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!workspace) return <div className="p-8">Workspace not found</div>;

  const isOwner = workspace.members.some(m => m.role === 'owner' && m.userId === workspace.ownerId);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{workspace.name}</h1>
          <p className="text-gray-600">{workspace.description || 'No description'}</p>
          <p className="text-sm text-gray-400 mt-2">Slug: {workspace.slug}</p>
        </div>
        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="border-t pt-4 mt-4">
        <h2 className="text-xl font-semibold mb-2">Owner</h2>
        <p>{workspace.owner.email}</p>
      </div>

      <div className="border-t pt-4 mt-4">
        <h2 className="text-xl font-semibold mb-2">Members</h2>
        <ul className="space-y-1">
          {workspace.members.map((member) => (
            <li key={member.id} className="flex justify-between border-b py-1">
              <span>{member.user.email}</span>
              <span className="text-sm bg-gray-200 px-2 py-0.5 rounded">{member.role}</span>
            </li>
          ))}
        </ul>
      </div>

      <EditWorkspaceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleUpdate}
        workspace={workspace}
      />
    </div>
  );
}