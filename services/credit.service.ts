import { apiClient } from "@/lib/api-client";
import { sileo } from "sileo";
import {
  Credit,
  CreditChoices,
  CreditData,
  CreditListResponse,
} from "@/types/credit.type";

export class CreditService {
  private static readonly BASE_URL = "/api/credit";

  private static notifySuccess(title: string, description?: string): void {
    if (typeof window === "undefined") {
      return;
    }

    sileo.success({
      title,
      description,
    });
  }

  static async create(data: CreditData): Promise<Credit> {
    try {
      const response = await apiClient.post<Credit>(
        `${this.BASE_URL}/create/`,
        data,
      );
      this.notifySuccess("Crédito creado", "La solicitud fue registrada correctamente.");
      return response.data;
    } catch (error) {
      console.error("Error creating credit:", error);
      throw error;
    }
  }

  static async list(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    ordering?: string;
    [key: string]: any;
  }): Promise<CreditListResponse> {
    try {
      const response = await apiClient.get<CreditListResponse>(
        `${this.BASE_URL}/list/`,
        { params },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching credits:", error);
      throw error;
    }
  }

  static async getChoices(): Promise<CreditChoices> {
    try {
      const response = await apiClient.get<CreditChoices>(
        `${this.BASE_URL}/choices/`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching credit choices:", error);
      throw error;
    }
  }


}
