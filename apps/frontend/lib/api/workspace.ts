const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  ownerId: string;
  owner: {
    id: string;
    email: string;
    name?: string;
  };
  members: {
    id: string;
    userId: string;
    role: string;
    user: {
      id: string;
      email: string;
      name?: string;
    };
  }[];
  createdAt: string;
  updatedAt: string;
}

export async function getWorkspaces(): Promise<Workspace[]> {
  const res = await fetch(`${API_URL}/workspaces`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch workspaces');
  return res.json();
}

export async function createWorkspace(data: { name: string; slug: string; description?: string }): Promise<Workspace> {
  const res = await fetch(`${API_URL}/workspaces`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to create workspace');
  return res.json();
}

export async function getWorkspace(id: string): Promise<Workspace> {
  const res = await fetch(`${API_URL}/workspaces/${id}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch workspace');
  return res.json();
}

export async function updateWorkspace(id: string, data: { name?: string; slug?: string; description?: string }): Promise<Workspace> {
  const res = await fetch(`${API_URL}/workspaces/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to update workspace');
  return res.json();
}

export async function deleteWorkspace(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/workspaces/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete workspace');
}