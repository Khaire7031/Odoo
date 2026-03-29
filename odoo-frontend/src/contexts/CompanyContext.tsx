import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { defaultCompanyConfig, type CompanyConfig, type ApprovalSequenceStep, type ApprovalRule } from "@/data/mockData";

interface CompanyContextType {
  config: CompanyConfig;
  setCompanyInfo: (companyName: string, country: string, baseCurrency: string) => void;
  setApprovalSequence: (seq: ApprovalSequenceStep[]) => void;
  setApprovalRule: (rule: ApprovalRule) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<CompanyConfig>(() => {
    const saved = localStorage.getItem("company_config");
    return saved ? JSON.parse(saved) : defaultCompanyConfig;
  });

  useEffect(() => {
    localStorage.setItem("company_config", JSON.stringify(config));
  }, [config]);

  const setCompanyInfo = useCallback((companyName: string, country: string, baseCurrency: string) => {
    setConfig((prev) => ({ ...prev, companyName, country, baseCurrency }));
  }, []);

  const setApprovalSequence = useCallback((seq: ApprovalSequenceStep[]) => {
    setConfig((prev) => ({ ...prev, approvalSequence: seq }));
  }, []);

  const setApprovalRule = useCallback((rule: ApprovalRule) => {
    setConfig((prev) => ({ ...prev, approvalRule: rule }));
  }, []);

  return (
    <CompanyContext.Provider value={{ config, setCompanyInfo, setApprovalSequence, setApprovalRule }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
  return ctx;
};
