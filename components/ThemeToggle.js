'use client';
import { useEffect, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.dataset.theme === 'studiodark'), []);
  const toggle = () => {
    const t = dark ? 'studiolight' : 'studiodark';
    document.documentElement.dataset.theme = t;
    localStorage.setItem('theme', t);
    setDark(!dark);
  };
  return (
    <button onClick={toggle} className="btn btn-ghost btn-circle btn-sm sm:btn-md" aria-label="Toggle light and dark theme">
      {dark ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  );
}