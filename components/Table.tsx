import React, { useState } from "react";
import { Link2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface TableProps {
  headers?: string[];
  rows?: (string | number)[][];
  data?: Array<any>;
}

const headerTranslations: Record<string, string> = {
  id: "ID",
  full_name: "Nombre completo",
  dni: "Documento",
  credit_value: "Valor del crédito",
  interests: "Interés",
  months: "Plazo (meses)",
  created_at: "Fecha de registro",
  updated_at: "Última actualización",
  status: "Estado",
  drive_url: "Archivo",
  email: "Correo electrónico",
  phone: "Teléfono",
  address: "Dirección",
  city: "Ciudad",
  description: "Descripción",
  name: "Nombre",
  date: "Fecha",
  amount: "Monto",
  total: "Total",
  type: "Tipo",
  user: "Usuario",
  notes: "Notas",
};

const translateHeader = (header: string): string => {
  return headerTranslations[header] || header.replace(/_/g, " ");
};

const formatCurrency = (value: any) => {
  if (value === null || value === undefined || value === "") return "—";
  const number = Number(value.toString().replace(/\./g, ""));
  if (isNaN(number)) return value;
  return `$ ${number.toLocaleString("es-CO")}`;
};

const formatPercentage = (value: any) => {
  if (value === null || value === undefined || value === "") return "—";
  const number = Number(value);
  if (isNaN(number)) return value;
  const percentage = number <= 1 ? number * 100 : number;
  return `${percentage}%`;
};

const formatDate = (value: any) => {
  if (!value) return "—";
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return value;
  }
};

const formatCell = (header: string, value: any) => {
  if (!header) return value ?? "—";
  const h = header.toLowerCase();

  if (h.includes("value") || h.includes("monto") || h.includes("total") || h.includes("amount"))
    return formatCurrency(value);
  if (h.includes("interes") || h.includes("interest") || h.includes("rate"))
    return formatPercentage(value);
  if (h.includes("date") || h.includes("_at") || h.includes("fecha"))
    return formatDate(value);

  return value ?? "—";
};

type SortDir = "asc" | "desc" | null;

const Table: React.FC<TableProps> = ({ headers, rows, data }) => {
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const rawHeaders =
    headers || (data && data.length > 0 ? Object.keys(data[0]) : []);

  const rawRows =
    rows ||
    (data
      ? data.map((item) => rawHeaders.map((h) => item[h] ?? "—"))
      : []);

  const driveIdx = rawHeaders.findIndex((h) => h === "drive_url");

  const displayHeaders =
    driveIdx >= 0
      ? [rawHeaders[driveIdx], ...rawHeaders.filter((_, i) => i !== driveIdx)]
      : rawHeaders;

  const displayRows =
    driveIdx >= 0
      ? rawRows.map((row) => [
          row[driveIdx],
          ...row.filter((_, i) => i !== driveIdx),
        ])
      : rawRows;

  const handleSort = (colIndex: number) => {
    if (displayHeaders[colIndex] === "drive_url") return;
    if (sortCol === colIndex) {
      setSortDir((prev) => (prev === "asc" ? "desc" : prev === "desc" ? null : "asc"));
      if (sortDir === "desc") setSortCol(null);
    } else {
      setSortCol(colIndex);
      setSortDir("asc");
    }
  };

  const sortedRows = [...displayRows].sort((a, b) => {
    if (sortCol === null || sortDir === null) return 0;
    const va = a[sortCol];
    const vb = b[sortCol];
    const na = Number(String(va).replace(/[^0-9.-]/g, ""));
    const nb = Number(String(vb).replace(/[^0-9.-]/g, ""));
    const comp = !isNaN(na) && !isNaN(nb)
      ? na - nb
      : String(va).localeCompare(String(vb), "es");
    return sortDir === "asc" ? comp : -comp;
  });

  if (displayHeaders.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
        Sin datos para mostrar
      </div>
    );
  }

  return (
    <div className="w-full font-sans">
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-slate-700 to-slate-800">
              {displayHeaders.map((header, index) => (
                <th
                  key={index}
                  onClick={() => handleSort(index)}
                  className={`
                    px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-200
                    ${header !== "drive_url" ? "cursor-pointer select-none hover:bg-slate-600 transition-colors" : ""}
                    ${index === 0 ? "rounded-tl-xl" : ""}
                    ${index === displayHeaders.length - 1 ? "rounded-tr-xl" : ""}
                  `}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{translateHeader(header)}</span>
                    {header !== "drive_url" && (
                      <span className="text-slate-400">
                        {sortCol === index && sortDir === "asc" ? (
                          <ArrowUp size={13} className="text-slate-200" />
                        ) : sortCol === index && sortDir === "desc" ? (
                          <ArrowDown size={13} className="text-slate-200" />
                        ) : (
                          <ArrowUpDown size={13} className="opacity-40" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {sortedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={displayHeaders.length}
                  className="px-4 py-12 text-center text-gray-400 text-sm"
                >
                  No hay registros disponibles
                </td>
              </tr>
            ) : (
              sortedRows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-slate-50 transition-colors duration-100"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-3 text-gray-700 whitespace-nowrap"
                    >
                      {displayHeaders[cellIndex] === "drive_url" && cell && cell !== "—" ? (
                        <a
                          href={String(cell)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors"
                          title="Ver archivo"
                        >
                          <Link2 size={15} />
                          <span className="text-xs font-medium">Ver</span>
                        </a>
                      ) : (
                        <span className={`
                          ${String(cell) === "—" ? "text-gray-300" : ""}
                          ${displayHeaders[cellIndex]?.toLowerCase().includes("value") || 
                            displayHeaders[cellIndex]?.toLowerCase().includes("monto") 
                            ? "font-medium text-slate-800" : ""}
                        `}>
                          {formatCell(displayHeaders[cellIndex], cell)}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {sortedRows.length > 0 && (
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 rounded-b-xl">
            <span className="text-xs text-gray-400">
              {sortedRows.length} {sortedRows.length === 1 ? "registro" : "registros"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;