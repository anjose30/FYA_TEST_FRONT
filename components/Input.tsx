"use client";

import { useEffect, useState } from "react";
import { Asterisk, Eye, EyeOff } from "lucide-react";

interface InputProps {
  label: string;
  onChange?: (value: string) => void;
  value?: string;
  disabled?: boolean;
  color?: string;
  type?: "text" | "password" | "email" | "date" | "number";
  required?: boolean;
  helperText?: string;
  children?: React.ReactNode;
}

export default function Input({
  label,
  onChange,
  value,
  disabled = false,
  color,
  type = "text",
  required = false,
  helperText,
  children,
}: InputProps) {
  const [internalValue, setInternalValue] = useState(value ?? "");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const displayValue = value !== undefined ? value : internalValue;
  const hasPrefix = Boolean(children);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="relative w-full pt-4 select-none">
      <input
        type={inputType}
        disabled={disabled}
        value={displayValue}
        placeholder=" "
        onChange={(e) => {
          const nextValue = e.target.value;

          if (value === undefined) {
            setInternalValue(nextValue);
          }

          onChange?.(nextValue);
        }}
        className={`
          peer w-full px-3 py-2 border shadow-md min-w-50
          hover:shadow-lg hover:scale-[1.02] active:scale-100
          focus:outline-none focus:border-2 transition rounded-xl
          ${hasPrefix ? "pl-10" : ""}
          ${
            disabled
              ? "opacity-50 bg-gray-200 cursor-not-allowed border-gray-300"
              : ""
          }
        `}
        style={{ color: "#000", borderColor: color }}
        required={required}
      />

      {/* Prefix icon */}
      {hasPrefix && (
        <div className="pointer-events-none absolute left-3 top-6 flex items-center opacity-50">
          <span className="w-4 flex items-center justify-center">
            {children}
          </span>
        </div>
      )}

      {/* Toggle password */}
      {type === "password" && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-6 text-gray-500 hover:text-gray-700 transition-colors"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      )}

      {/* Required Asterisk */}
      {required && (
        <div className="absolute top-6 right-3 text-red-600 transition-opacity peer-focus:opacity-0 peer-not-placeholder-shown:opacity-0">
          <Asterisk className="w-4 h-4" />
        </div>
      )}

      {/* Floating label */}
      <label
        className={`
          pointer-events-none absolute left-3 px-1 text-gray-500 flex gap-2
          transition-all duration-200
          top-6 text-base
          peer-focus:-top-1 peer-focus:text-sm
          peer-placeholder-shown:top-6 peer-placeholder-shown:text-base
          peer-not-placeholder-shown:-top-1 peer-not-placeholder-shown:text-sm
          ${hasPrefix ? "pl-6" : ""}
          ${disabled ? "text-gray-400 font-semibold" : ""}
        `}
        style={{ color }}
      >
        {label}
      </label>

      {/* Helper text */}
      {helperText && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
}