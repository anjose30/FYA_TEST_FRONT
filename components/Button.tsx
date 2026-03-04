"use client";
//COMPONENTE BOTON

interface ButtonProps {
  label?: string; // TEXTO DEL BOTON
  onClick?: () => void; // FUNCION AL HACER CLICK
  variant?: "primary" | "secondary" | "outline" | "mini" | "text"; // VARIANTE DEL BOTON
  type?: "button" | "submit" | "reset"; // TIPO DE BOTON
  children?: React.ReactNode; // CONTENIDO ICONICO
  color?: string; // COLOR PERSONALIZADO
  disabled?: boolean; // ESTADO DESHABILITADO
  helperText?: string; // TEXTO DE AYUDA
}

const variantStyles = {
  primary: "bg-[var(--btn-color)] text-white font-bold",
  secondary:
    "bg-[color-mix(in_srgb,var(--btn-color)_30%,transparent)] text-[var(--btn-color)] font-bold",
  outline:
    "border-2 border-[var(--btn-color)] text-[var(--btn-color)] bg-transparent font-bold",
  mini: "bg-[var(--btn-color)] text-white text-xs! px-2 py-1",
  text: "bg-transparent text-[var(--btn-color)] underline font-bold shadow-none hover:scale-100! active:scale-105! hover:shadow-none! p-1!",
};

export default function Button({
  label,
  onClick,
  variant = "primary",
  type = "button",
  children,
  color,
  disabled = false,
  helperText,
}: ButtonProps) {
  return (
    <div className="relative inline-flex">
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        style={
          color ? ({ "--btn-color": color } as React.CSSProperties) : undefined
        }
        className={`
            ${variantStyles[variant]}
            py-2 px-4 rounded-xl shadow-lg
            transition hover:scale-105 active:scale-95 select-none
            flex items-center justify-center cursor-pointer hover:shadow-xl relative
            ${disabled ? "opacity-50 cursor-not-allowed! bg-gray-600 text-gray-300!" : ""}
        `}
      >
        <p className="flex gap-1 justify-center items-center">
          {children}
          {label}
        </p>
      </button>
    </div>
  );
}
