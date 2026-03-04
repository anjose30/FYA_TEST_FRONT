export type TypeDni = "cc" | "id";

export interface CreditData {
  full_name: string;
  type_dni: TypeDni;
  dni: string;
  credit_value: number;
  interests: number;
  months: number;
}

export interface Credit {
  id: number;
  full_name: string;
  type_dni: TypeDni;
  dni: string;
  credit_value: number;
  interests: number;
  months: number;
  create_at: string;
}

export interface CreditChoices {
  type_dni: Array<{ value: TypeDni; label: string }>;
}

export interface CreditListResponse {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: Credit[];
}
