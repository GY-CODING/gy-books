// components/AnimatedAlert.tsx
import { ESeverity } from '@/utils/constants/ESeverity';
import { Alert, AlertTitle } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import React from 'react';

type AnimatedAlertProps = {
  open: boolean;
  severity?: ESeverity;
  title?: string;
  message: string;
  onClose?: () => void;
  duration?: number; // duración en milisegundos
};

export default function AnimatedAlert({
  open,
  severity = ESeverity.INFO,
  title,
  message,
  onClose,
  duration = 5000,
}: AnimatedAlertProps) {
  useEffect(() => {
    if (open && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 20 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 1 }}
          style={{
            position: 'fixed',
            bottom: 20,
            left: 20,
            zIndex: 1300,
          }}
        >
          <Alert severity={severity} onClose={onClose} variant="filled">
            {title && <AlertTitle>{title}</AlertTitle>}
            {message}
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
