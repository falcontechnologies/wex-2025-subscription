'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          password 
        })
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/login');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1>Register</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <input 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        placeholder="Email"
        type="email"
        disabled={isLoading}
        className="block mb-2 p-2 border"
      />
      <input 
        type="password" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
        placeholder="Password"
        disabled={isLoading}
        className="block mb-2 p-2 border"
      />
      <button 
        onClick={handleRegister}
        disabled={isLoading}
        className="p-2 bg-blue-500 text-white disabled:opacity-50"
      >
        {isLoading ? 'Registering...' : 'Register'}
      </button>
    </div>
  );
}