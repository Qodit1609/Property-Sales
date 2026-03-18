// src/components/common/Input/Input.tsx
import React from "react";

type InputProps = {
  label?: string;
  error?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && <label className="block mb-1 text-sm">{label}</label>}

      <input
        {...props}
        className={`
          w-full px-4 py-2 rounded-lg border border-border
          focus:outline-none focus:ring-2 focus:ring-primary
          ${error ? "border-red-500" : ""}
          ${className}
        `}
      />

      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;