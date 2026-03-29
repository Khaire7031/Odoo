import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { type CompanyConfig, type ApprovalSequenceStep, type ApprovalRule } from "@/data/types";

const emptyConfig: CompanyConfig = {
  companyName: "",
  country: "",
  baseCurrency: "USD",
  approvalSequence: [],
  approvalRule: { type: "percentage", minPercentage: 67 },
};

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
    return saved ? JSON.parse(saved) : emptyConfig;
  });

  useEffect(() => {
    localStorage.setItem("company_config", JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    const cid = localStorage.getItem("companyId");
    if (cid) {
      fetch(`http://localhost:8081/api/companies/${cid}/config`)
        .then((r) => r.json())
        .then((data) => {
          if (data.approvalRule) {
            setConfig((prev) => ({
              ...prev,
              baseCurrency: data.baseCurrency || prev.baseCurrency,
              approvalRule: data.approvalRule,
              approvalSequence: data.approvalSequence || [],
            }));
          }
        })
        .catch(console.error);
    }
  }, []);

  const saveConfigToBackend = async (newConfig: CompanyConfig) => {
    const cid = localStorage.getItem("companyId");
    if (cid) {
      await fetch(`http://localhost:8081/api/companies/${cid}/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseCurrency: newConfig.baseCurrency,
          approvalRule: newConfig.approvalRule,
          approvalSequence: newConfig.approvalSequence,
        })
      }).catch(console.error);
    }
  };

  const setCompanyInfo = useCallback((companyName: string, country: string, baseCurrency: string) => {
    setConfig((prev) => {
      const nc = { ...prev, companyName, country, baseCurrency };
      saveConfigToBackend(nc);
      return nc;
    });
  }, []);

  const setApprovalSequence = useCallback((seq: ApprovalSequenceStep[]) => {
    setConfig((prev) => {
      const nc = { ...prev, approvalSequence: seq };
      saveConfigToBackend(nc);
      return nc;
    });
  }, []);

  const setApprovalRule = useCallback((rule: ApprovalRule) => {
    setConfig((prev) => {
      const nc = { ...prev, approvalRule: rule };
      saveConfigToBackend(nc);
      return nc;
    });
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
