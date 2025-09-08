'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      router.push('/auth/signin');
    } else {
      const err = await res.json();
      alert(err.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold mb-6">Create an Account</h2>

        <form onSubmit={submit} className="space-y-4">
          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
            autoComplete="name"
          />

          {/* Email */}
  <input
  type="email"
  placeholder="Email Address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full rounded-xl border border-gray-600   px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
/>


          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
            autoComplete="new-password"
          />

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full rounded-full bg-[#2563EB] text-white py-3 font-semibold hover:bg-[#1D4ED8] transition disabled:opacity-50"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        {/* Already have an account */}
        <div className="text-center text-sm mt-6">
          <span className="text-gray-600">Already have an account? </span>
          <Link href="/auth/signin" className="text-white font-medium underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
