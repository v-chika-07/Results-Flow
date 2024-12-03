import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
  highContrast: boolean;
  toggleTheme: () => void;
  toggleContrast: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
      highContrast: false,
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
      toggleContrast: () => set((state) => ({ highContrast: !state.highContrast })),
    }),
    {
      name: 'theme-storage',
    }
  )
);

export const useTheme = () => {
  const { isDark, highContrast } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('high-contrast', highContrast);
  }, [isDark, highContrast]);

  return useThemeStore();
};