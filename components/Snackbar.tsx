import React from 'react';

interface SnackbarProps {
  message: string;
}

const Snackbar: React.FC<SnackbarProps> = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="assertive"
      aria-atomic="true"
      className="fixed bottom-5 left-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl text-sm font-medium z-[100] snackbar-animate-appear"
    >
      {message}
    </div>
  );
};

export default Snackbar;