"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const router=useRouter();

  const signup = async () => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/auth/signin');
    } else {
      const err = await res.json();
      alert(err.error || 'Registration failed');
    }
    
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border p-2 rounded w-full mb-2"
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="border p-2 rounded w-full mb-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="border p-2 rounded w-full mb-4"
      />
      <button
        onClick={signup}
        className="bg-blue-500 text-white p-2 rounded w-full"
      >
        Sign Up
      </button>
    </div>
  );
}
