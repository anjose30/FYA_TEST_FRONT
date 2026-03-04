"use client";

import React, { useEffect, useState } from "react";
import { CreditListResponse } from "@/types/credit.type";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";
import Table from "@/components/Table";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
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
    <div className="min-h-screen w-full bg-gray-50 px-4 py-8">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-zinc-900">
          Créditos Registrados
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Buscar por nombre, ID o documento"
              type="text"
              value={search}
              onChange={handleSearch}
            >
              <Search />
            </Input>

            <Select
              label="Ordenar por"
              value={
                orderingOptions.find((opt) => opt.value === ordering)?.label ||
                "Más reciente"
              }
              onChange={handleOrderingChange}
              options={orderingOptions.map((opt) => opt.label)}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">
              Cargando créditos...
            </div>
          ) : credits.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No se encontraron créditos
            </div>
          ) : (
            <Table data={credits} />
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Página {page} de {totalPages} ({totalCount} créditos totales)
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={page === 1 || isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
                Anterior
              </button>
              <button
                onClick={handleNextPage}
                disabled={page >= totalPages || isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
        <div className="mt-6">
          <Button color="#01D37E" type="submit" label="CREAR REGISTRO" onClick={() => {router.push("/form")}}></Button>
        </div>
      </div>
    </div>
  );
}
