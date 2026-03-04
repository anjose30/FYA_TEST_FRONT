// COMOPONENTE SELECT
"use client";

import { Asterisk, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface SelectProps {
  options: string[];
  onChange: (value: string) => void;
  value?: string;
  label: string;
  disabled?: boolean;
  color?: string;
  requeired?: boolean;
  helperText?: string;
}

export default function Select({
  options,
  onChange,
  value,
  label,
  disabled = false,
  color,
  requeired = false,
  helperText,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value ?? "");
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!selectRef.current) return;
      if (!selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const displayValue = value !== undefined ? value : internalValue;
  const isActive = displayValue.length > 0 || isOpen;

  return (
    <div ref={selectRef} className="relative w-full pt-4 select-none">
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          peer w-full px-3 py-2 border shadow-md-10 select-none
          hover:shadow-lg hover:scale-105 active:scale-100
          focus:outline-none focus:border-2! transition rounded-xl
          flex justify-between items-center cursor-pointer gap-2 min-w-50
          ${disabled ? "opacity-50 bg-gray-600 cursor-not-allowed! border-gray-300!" : ""}
        `}
        style={{ color: "#000", borderColor: color }}
      >
        <span
          className={`${displayValue ? "text-gray-900" : "text-transparent"} truncate flex-1`}
        >
          {displayValue || label}
        </span>

        <div
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? "-translate-y-1 -translate-x-1" : "rotate-180"
          } 
          `}
        >
          {requeired && !isOpen ? (
            <div
              className={`
                ${requeired ? "text-red-700 scale-80" : ""}
            `}
            >
              <Asterisk />
            </div>
          ) : (
            <ChevronUp />
          )}
        </div>
      </div>

      <label
        className={`
          pointer-events-none absolute left-3 px-1 transition-all
          ${isActive ? "-top-1 text-sm" : "top-6 text-base"}
          ${disabled ? "text-gray-200" : ""}
        `}
        style={{ color }}
      >
        {label}
      </label>

      {isOpen && (
        <div className="absolute z-60 mt-1 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option, i) => (
            <div
              key={i}
              onClick={() => {
                if (value === undefined) {
                  setInternalValue(option);
                }
                onChange(option);
                setIsOpen(false);
              }}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-lg transition-all text-sm truncate"
              title={option}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
