import React from 'react';

interface ToastProps {
  message: string;
}

const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="toast">
      <p className="font-semibold">{message}</p>
    </div>
  );
};

export default Toast;