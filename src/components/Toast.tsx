import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';
import { ToastNotice } from '../types';

interface ToastProps {
  toasts: ToastNotice[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts }) => {
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-black text-white px-4 py-3 rounded-md shadow-2xl flex items-center space-x-3 pointer-events-auto border border-gray-800"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
            </div>
            <p className="font-jakarta font-medium text-xs tracking-wide text-gray-100">
              {t.message}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
