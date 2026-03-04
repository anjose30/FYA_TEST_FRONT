"use client";

import { useState } from "react";
import { CreditService } from "@/services/credit.service";
import { sileo } from "sileo";

export const useCreditForm = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    type_dni: "cc" as const,
    dni: "",
    credit_value: "",
    interests: "",
    months: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "credit_value" || name === "interests" || name === "months"
          ? parseFloat(value) || ""
          : value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.full_name ||
      !formData.dni ||
      !formData.credit_value ||
      !formData.interests ||
      !formData.months
    ) {
      sileo.error({ title: "Por favor, completa todos los campos", fill:"" });
      return;
    }

    setIsLoading(true);

    try {
      await CreditService.create({
        full_name: formData.full_name,
        type_dni: formData.type_dni,
        dni: formData.dni,
        credit_value: Number(formData.credit_value),
        interests: Number(formData.interests),
        months: Number(formData.months),
      });

      sileo.show({ title: "Crédito creado exitosamente", fill:""});

      setFormData({
        full_name: "",
        type_dni: "cc",
        dni: "",
        credit_value: "",
        interests: "",
        months: "",
      });
    } catch (err) {
      console.error(err);
      sileo.error({ title: "Error al crear el crédito", fill:"" });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    isLoading,
    handleChange,
    handleSubmit,
  };
};
