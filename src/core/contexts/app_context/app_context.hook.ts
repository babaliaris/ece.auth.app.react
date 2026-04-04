import { useContext } from "react";
import { EceAppContext } from "@/core/contexts/app_context/app_context.type";

export const useEceAppCtx = () =>
{
  const context = useContext(EceAppContext);

  if (!context)
  {
    throw new Error('useEceAppCtx must be used within an EceAppProvider');
  }
  return context;
};

