import React from "react";
import { Link2 } from "lucide-react";

interface TableProps {
  headers?: string[];
  rows?: (string | number)[][];
  data?: Array<any>;
}

const headerTranslations: Record<string, string> = {};

const translateHeader = (header: string): string => {
  return headerTranslations[header] || header;
};


const formatCurrency = (value: any) => {
  if (value === null || value === undefined || value === "") return "-";

  const number = Number(value.toString().replace(/\./g, ""));
  if (isNaN(number)) return value;

  return `$ ${number.toLocaleString("es-CO")}`;
};

const formatPercentage = (value: any) => {
  if (value === null || value === undefined || value === "") return "-";

  const number = Number(value);
  if (isNaN(number)) return value;

  const percentage = number <= 1 ? number * 100 : number;

  return `${percentage}%`;
};

const formatCell = (header: string, value: any) => {
  if (!header) return value;

  const normalizedHeader = header.toLowerCase();

  if (normalizedHeader.includes("monto")) {
    return formatCurrency(value);
  }

  if (normalizedHeader.includes("interes")) {
    return formatPercentage(value);
  }

  return value ?? "-";
};


const Table: React.FC<TableProps> = ({ headers, rows, data }) => {
  const finalHeaders =
    headers || (data && data.length > 0 ? Object.keys(data[0]) : []);

  const finalRows =
    rows ||
    (data
      ? data.map((item) => finalHeaders.map((header) => item[header] ?? "-"))
      : []);

  const driveUrlIndex = finalHeaders.findIndex(
    (header) => header === "drive_url",
  );

  const displayHeaders =
    driveUrlIndex >= 0
      ? [
          finalHeaders[driveUrlIndex],
          ...finalHeaders.filter((_, index) => index !== driveUrlIndex),
        ]
      : finalHeaders;

  const displayRows =
    driveUrlIndex >= 0
      ? finalRows.map((row) => [
          row[driveUrlIndex],
          ...row.filter((_, index) => index !== driveUrlIndex),
        ])
      : finalRows;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-xs sm:text-sm">
        <thead className="bg-gray-100">
          <tr>
            {displayHeaders?.map((header, index) => (
              <th
                key={index}
                className="px-2 sm:px-4 py-2 text-left font-semibold whitespace-nowrap"
              >
                {translateHeader(header)}.
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {displayRows?.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-2 sm:px-4 py-2 whitespace-nowrap"
                >
                  {displayHeaders[cellIndex] === "drive_url" && cell ? (
                    <a href={cell} target="_blank" rel="noopener noreferrer">
                      <Link2
                        size={18}
                        className="text-base-color/40 hover:text-base-color/90"
                      />
                    </a>
                  ) : (
                    formatCell(displayHeaders[cellIndex], cell)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
