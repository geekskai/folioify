import React, { createContext, useContext, useState } from "react";

// 更新为使用数字类型
// 0 = AI工具
// 1 = MCP服务器
// 2 = 其他
export type SubmissionType = 0 | 1 | 2 | null;

type SubmitContextType = {
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  selectedType: SubmissionType;
  setSelectedType: (type: SubmissionType) => void;
  resetForm: () => void;
};

const SubmitContext = createContext<SubmitContextType | undefined>(undefined);

export function SubmitProvider({ children }: { children: React.ReactNode }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<SubmissionType>(null);

  const resetForm = () => {
    setIsSubmitting(false);
    setSelectedType(null);
  };

  return (
    <SubmitContext.Provider
      value={{
        isSubmitting,
        setIsSubmitting,
        selectedType,
        setSelectedType,
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
