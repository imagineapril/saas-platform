'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:4000/auth/me', {
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error('Unauthorized');
        }
        const data = await res.json();
        setUser(data);
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await fetch('http://localhost:4000/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    router.push('/login');
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {user && <p>Welcome, {user.email}!</p>}
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white p-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}