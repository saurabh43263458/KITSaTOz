import { create } from 'zustand';

export const useToastStore = create((set) => ({
  toasts: [],

  addToast: ({ title, description, type = 'info', duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, title, description, type }]
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id)
        }));
      }, duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  }
}));

export const toast = {
  success: (title, description) => 
    useToastStore.getState().addToast({ title, description, type: 'success' }),
  error: (title, description) => 
    useToastStore.getState().addToast({ title, description, type: 'error' }),
  info: (title, description) => 
    useToastStore.getState().addToast({ title, description, type: 'info' }),
  warning: (title, description) => 
    useToastStore.getState().addToast({ title, description, type: 'warning' })
};
