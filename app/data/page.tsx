"use client";

import React, { useEffect, useState } from "react";
import { CreditListResponse } from "@/types/credit.type";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";
import Table from "@/components/Table";
import { Search, ChevronLeft, ChevronRight, Plus, TrendingUp, Users, DollarSign, LayoutDashboard } from "lucide-react";
import { CreditService } from "@/services/credit.service";
import { useRouter } from "next/navigation";

export default function DataPage() {
  const [credits, setCredits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("create_at");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const orderingOptions = [
    { label: "Más reciente", value: "-create_at" },
    { label: "Más antiguo", value: "create_at" },
    { label: "Mayor valor", value: "-credit_value" },
    { label: "Menor valor", value: "credit_value" },
    { label: "Nombre A-Z", value: "full_name" },
    { label: "Nombre Z-A", value: "-full_name" },
  ];

  const router = useRouter();

  const loadCredits = async (
    searchQuery?: string,
    orderBy?: string,
    pageNum?: number,
  ) => {
    setIsLoading(true);
    try {
      const response = await CreditService.list({
        page: pageNum || page,
        page_size: pageSize,
        search: searchQuery || search,
        ordering: orderBy || ordering,
      });

      if (Array.isArray(response)) {
        setCredits(response);
        setTotalCount(response.length);
      } else {
        setCredits(response.results || []);
        setTotalCount(response.count || 0);
      }
    } catch (error) {
      console.error("Error loading credits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCredits();
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    loadCredits(value, ordering, 1);
  };

  const handleOrderingChange = (label: string) => {
    const selected = orderingOptions.find((opt) => opt.label === label)?.value;
    if (selected) {
      setOrdering(selected);
      setPage(1);
      loadCredits(search, selected, 1);
    }
  };

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadCredits(search, ordering, nextPage);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      loadCredits(search, ordering, prevPage);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="min-h-screen w-full bg-gray-50">

      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-0">

          <div className="flex items-center justify-between h-16 gap-4">

            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-lg"
                style={{ backgroundColor: "#01D37E" }}
              >
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-widest leading-none">
                  Panel de gestión
                </p>
                <h1 className="text-lg font-bold text-zinc-900 leading-tight">
                  Créditos Registrados
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {totalCount > 0 && (
                <div className="hidden sm:flex items-center gap-1 text-sm text-gray-500 bg-gray-100 rounded-lg px-3 py-1.5">
                  <span>Página</span>
                  <span className="font-semibold text-zinc-800">{page}</span>
                  <span>de</span>
                  <span className="font-semibold text-zinc-800">{totalPages}</span>

                  <div className="flex items-center gap-0.5 ml-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={page === 1}
                      className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={page >= totalPages}
                      className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => router.push("/form")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold shadow-sm transition hover:brightness-105 active:scale-95"
                style={{ backgroundColor: "#01D37E" }}
              >
                <Plus className="w-4 h-4" />
                <span>Crear Registro</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-t border-gray-100 pt-3">

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Total:</span>
                <span className="text-sm font-bold text-zinc-800">{totalCount}</span>
              </div>
              <div className="w-px h-4 bg-gray-200" />
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" style={{ color: "#01D37E" }} />
                <span className="text-sm text-gray-500">Mostrando:</span>
                <span className="text-sm font-bold text-zinc-800">{credits.length}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex-1 sm:w-64">
                <Input
                  label="Buscar"
                  type="text"
                  value={search}
                  onChange={handleSearch}
                >
                  <Search />
                </Input>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div
                className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mb-3"
                style={{ borderColor: "#01D37E", borderTopColor: "transparent" }}
              />
              <p className="text-gray-400 text-sm">Cargando créditos…</p>
            </div>
          ) : credits.length === 0 ? (
            <div className="p-12 text-center">
              <DollarSign className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No se encontraron créditos</p>
            </div>
          ) : (
            <Table data={credits} />
          )}
        </div>

        {totalCount > 0 && (
          <div className="flex items-center justify-between mt-4 px-1">
            <p className="text-sm text-gray-400">
              {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalCount)} de{" "}
              <span className="font-semibold text-zinc-700">{totalCount}</span> registros
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>
              <button
                onClick={handleNextPage}
                disabled={page >= totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}