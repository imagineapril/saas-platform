'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateWorkspace, Workspace } from '@/lib/api/workspace';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Invalid slug'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditWorkspaceModal({
  isOpen,
  onClose,
  onSuccess,
  workspace,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  workspace: Workspace;
}) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: workspace.name,
      slug: workspace.slug,
      description: workspace.description || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    setLoading(true);
    try {
      await updateWorkspace(workspace.id, data);
      onSuccess();
    } catch (err) {
      setError('Failed to update workspace');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Edit Workspace</h2>
        {error && <div className="bg-red-50 text-red-600 p-2 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input {...register('name')} className="mt-1 block w-full border rounded px-3 py-2" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Slug</label>
            <input {...register('slug')} className="mt-1 block w-full border rounded px-3 py-2" />
            {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea {...register('description')} rows={3} className="mt-1 block w-full border rounded px-3 py-2" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}