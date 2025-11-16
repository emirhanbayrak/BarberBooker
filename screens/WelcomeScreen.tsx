import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const WelcomeScreen: React.FC = () => {
  const [name, setName] = useState('');
  const { loginUser } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      loginUser(name.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-brand-primary p-6 text-center animate-fade-in">
      <h1 className="text-4xl font-bold text-brand-accent mb-2">SY</h1>
      <h2 className="text-2xl font-light text-brand-text mb-12 tracking-wider">Hair Designer</h2>
      <p className="text-xl text-brand-light mb-4">Hoş Geldiniz!</p>
      <p className="text-md text-gray-400 mb-8">Uygulamayı kullanmak için lütfen adınızı girin.</p>
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Adınız"
          className="w-full p-3 bg-brand-secondary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent text-center"
          required
          autoFocus
        />
        <button
          type="submit"
          className="w-full bg-brand-accent text-brand-primary font-bold py-3 rounded-lg text-lg hover:opacity-90 transition-opacity"
        >
          Devam Et
        </button>
      </form>
    </div>
  );
};

export default WelcomeScreen;
