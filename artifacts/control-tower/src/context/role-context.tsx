import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_ROLE, ROLE_VIEWS, type RoleKey, type RoleView } from "@/lib/roles";

type RoleContextValue = {
  roleKey: RoleKey;
  role: RoleView;
  setRoleKey: (next: RoleKey) => void;
};

const ROLE_STORAGE_KEY = "northside.role";

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [roleKey, setRoleKey] = useState<RoleKey>(DEFAULT_ROLE);

  useEffect(() => {
    const saved = localStorage.getItem(ROLE_STORAGE_KEY) as RoleKey | null;
    if (saved && ROLE_VIEWS.some((r) => r.key === saved)) {
      setRoleKey(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(ROLE_STORAGE_KEY, roleKey);
  }, [roleKey]);

  const role = useMemo(
    () => ROLE_VIEWS.find((r) => r.key === roleKey) ?? ROLE_VIEWS[0],
    [roleKey],
  );

  return (
    <RoleContext.Provider value={{ roleKey, role, setRoleKey }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRoleView() {
  const ctx = useContext(RoleContext);
  if (!ctx) {
    throw new Error("useRoleView must be used within RoleProvider");
  }
  return ctx;
}
