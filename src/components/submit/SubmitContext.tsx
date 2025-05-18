import React, { createContext, useContext, useState } from "react";

// 支持的分类类型，方便未来扩展
export type CategoryType = "ai_tools" | "mcp_servers" | string;

type SubmitContextType = {
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  currentStep: "category" | "form";
  setCurrentStep: (step: "category" | "form") => void;
  selectedCategory: CategoryType | null;
  setSelectedCategory: (category: CategoryType | null) => void;
  resetForm: () => void;
};

const SubmitContext = createContext<SubmitContextType | undefined>(undefined);

export function SubmitProvider({ children }: { children: React.ReactNode }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<"category" | "form">(
    "category"
  );
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  );

  const resetForm = () => {
    setIsSubmitting(false);
    setCurrentStep("category");
    setSelectedCategory(null);
  };

  return (
    <SubmitContext.Provider
      value={{
        isSubmitting,
        setIsSubmitting,
        currentStep,
        setCurrentStep,
        selectedCategory,
        setSelectedCategory,
        resetForm,
      }}
    >
      {children}
    </SubmitContext.Provider>
  );
}

export const useSubmitContext = () => {
  const context = useContext(SubmitContext);
  if (context === undefined) {
    throw new Error("useSubmitContext must be used within a SubmitProvider");
  }
  return context;
};
