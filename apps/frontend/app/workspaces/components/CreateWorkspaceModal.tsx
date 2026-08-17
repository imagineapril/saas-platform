'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createWorkspace } from '@/lib/api/workspace';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CreateWorkspaceModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', slug: '', description: '' },
  });

  const name = watch('name');

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('name', val);
    if (!watch('slug') || watch('slug') === generateSlug(name)) {
      setValue('slug', generateSlug(val));
    }
  };

  const onSubmit = async (data: FormData) => {
    setError('');
    setLoading(true);
    try {
      await createWorkspace(data);
      onSuccess();
    } catch (err) {
      setError('Failed to create workspace');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Create Workspace</h2>
        {error && <div className="bg-red-50 text-red-600 p-2 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              {...register('name')}
              onChange={onNameChange}
              className="mt-1 block w-full border rounded px-3 py-2"
              placeholder="My Workspace"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Slug</label>
            <input
              {...register('slug')}
              className="mt-1 block w-full border rounded px-3 py-2"
              placeholder="my-workspace"
            />
            {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              {...register('description')}
              className="mt-1 block w-full border rounded px-3 py-2"
              rows={3}
              placeholder="Optional description"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300">
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}