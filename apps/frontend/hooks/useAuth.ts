'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type AuthMode = 'login' | 'register';

export function useAuth(mode: AuthMode) {
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const mutate = async (data: any) => {
    setServerError('');
    setLoading(true);

    const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
    const payload = mode === 'login'
      ? { email: data.email, password: data.password }
      : { email: data.email, password: data.password, name: data.name };

    try {
      const res = await fetch(`http://localhost:4000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        const errorData = await res.json();
        setServerError(errorData.message || (mode === 'login' ? 'Invalid credentials' : 'Registration failed'));
      }
    } catch {
      setServerError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { mutate, serverError, loading };
}