'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import useHasMounted from '../hooks/useHasMounted';

type Props = {};

export default function ThemeToggle({}: Props) {
  const { theme, setTheme } = useTheme();
  const hasMounted = useHasMounted();

  return (
    <section className="flex cursor-pointer">
      {hasMounted && theme === 'light' ? (
        <Sun onClick={() => setTheme('dark')} />
      ) : (
        <Moon onClick={() => setTheme('light')} />
      )}
    </section>
  );
}
