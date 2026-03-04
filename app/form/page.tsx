"use client";

import React, { useEffect, useState } from "react";
import { CreditChoices } from "@/types/credit.type";
import Input from "@/components/Input";
import { useCreditForm } from "@/hooks/useCreditForm";
import {
  User,
  CreditCard,
  Hash,
  Percent,
  Calendar,
  DollarSign,
  ChevronLeft,
} from "lucide-react";
import Select from "@/components/Select";
import Button from "@/components/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CreditFormPage() {
  const { formData, isLoading, handleChange, handleSubmit } = useCreditForm();
  const [choices, setChoices] = useState<CreditChoices | null>(null);

  const router = useRouter();

  const createOnChangeAdapter = (fieldName: string) => (value: string) => {
    handleChange({
      target: { name: fieldName, value },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  useEffect(() => {
    const loadChoices = async () => {
      try {
        const data = await (
          await import("@/services/credit.service")
        ).CreditService.getChoices();
        setChoices(data);
      } catch (err) {
        console.error("Error al cargar las opciones", err);
      }
    };
    loadChoices();
  }, []);

  return (
    <div className="min-h-screen w-full grid items-center justify-center bg-gray-50 px-4 py-8 relative">
      <div className="absolute top-4 left-4">
        <Button
          color="#01D37E"
          type="submit"
          label="Regresar"
          onClick={() => {
            router.back();
          }}
          children={<ChevronLeft />}
        ></Button>
      </div>
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-md p-6 md:p-10 flex flex-col md:flex-row gap-8 relativ justify-betweene">
        <div className="flex flex-col justify-between md:items-start md:w-1/3 ">
          <Image
            src="/FYA.webp"
            alt="FYA Capital Logo"
            width={180}
            height={80}
            className="object-contain"
          />

          <p className="text-gray-700 mb-6">DesignBy: Andres Martinez </p>
        </div>

        <div className="w-full md:w-2/3">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-zinc-900">
            Formulario de Crédito
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <Input
              label="Nombre Completo"
              type="text"
              value={formData.full_name}
              onChange={createOnChangeAdapter("full_name")}
            >
              <User />
            </Input>

            <Select
              label="Tipo de Documento"
              value={
                choices?.type_dni?.find(
                  (opt) => opt.value === formData.type_dni,
                )?.label || ""
              }
              onChange={(label) => {
                const selected = choices?.type_dni?.find(
                  (opt) => opt.label === label,
                )?.value;
                if (selected) {
                  handleChange({
                    target: { name: "type_dni", value: selected },
                  } as React.ChangeEvent<HTMLInputElement>);
                }
              }}
              options={choices?.type_dni?.map((opt) => opt.label) ?? []}
            />

            <Input
              label="Número de Documento"
              type="text"
              value={formData.dni}
              onChange={createOnChangeAdapter("dni")}
            >
              <Hash />
            </Input>

            <Input
              label="Valor del Crédito"
              type="text"
              value={formData.credit_value}
              onChange={createOnChangeAdapter("credit_value")}
            >
              <CreditCard />
            </Input>

            <Input
              label="Intereses (%)"
              type="number"
              value={formData.interests}
              onChange={createOnChangeAdapter("interests")}
            >
              <Percent />
            </Input>

            <Input
              label="Número de Meses"
              type="text"
              value={formData.months}
              onChange={createOnChangeAdapter("months")}
            >
              <Calendar />
            </Input>
            <div className="w-full col-span-1 sm:col-span-2 mt-4 flex items-end justify-end">
              <Button
                label={isLoading ? "Enviando..." : "Solicitar Crédito"}
                color="#01D37E"
                type="submit"
                children={<DollarSign />}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
