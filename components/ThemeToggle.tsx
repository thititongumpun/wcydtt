'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import useHasMounted from '../hooks/useHasMounted';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const hasMounted = useHasMounted();

  return (
    <section className="flex cursor-pointer">
      {hasMounted && theme === 'light' ? (
        <Moon onClick={() => setTheme('dark')} />
      ) : (
        <Sun onClick={() => setTheme('light')} />
      )}
    </section>
  );
}
