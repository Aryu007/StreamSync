import { create } from 'zustand';

export const useThemeStore = create((set) => ({
    theme : localStorage.getItem('theme') || 'night', // Default to 'light' theme if not set
    setTheme: (newTheme) => {
        localStorage.setItem('theme', newTheme); // Save theme to localStorage
        set({ theme: newTheme }); // Update state
    },
}))