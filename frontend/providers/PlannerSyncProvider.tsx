import {
  createContext,
  startTransition,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type PlannerSyncContextValue = {
  refreshVersion: number;
  notifyPlannerChanged: () => void;
};

const PlannerSyncContext = createContext<PlannerSyncContextValue | null>(null);

export function PlannerSyncProvider({ children }: { children: ReactNode }) {
  const [refreshVersion, setRefreshVersion] = useState(0);

  const value = useMemo<PlannerSyncContextValue>(
    () => ({
      refreshVersion,
      notifyPlannerChanged: () => {
        startTransition(() => {
          setRefreshVersion((current) => current + 1);
        });
      },
    }),
    [refreshVersion]
  );

  return (
    <PlannerSyncContext.Provider value={value}>
      {children}
    </PlannerSyncContext.Provider>
  );
}

export function usePlannerSync() {
  const context = useContext(PlannerSyncContext);

  if (!context) {
    throw new Error("usePlannerSync must be used inside PlannerSyncProvider");
  }

  return context;
}
