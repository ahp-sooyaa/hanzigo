import { ReactNode } from "react";
import { hasPermission } from "@/features/auth/server/utils";

interface IfPermittedProps {
  resource: string;
  action: string;
  children: ReactNode;
}

export async function IfPermitted({ resource, action, children }: IfPermittedProps) {
  const permitted = await hasPermission(resource, action);

  if (!permitted) {
    return null;
  }

  return <>{children}</>;
}
