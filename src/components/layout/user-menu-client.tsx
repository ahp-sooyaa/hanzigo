"use client";

import { Bell, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SignOutButton } from "@/features/auth/components/sign-out-button";

interface UserMenuClientProps {
  name: string;
  role: string;
  initials: string;
}

export function UserMenuClient({ name, role, initials }: UserMenuClientProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDocumentClick);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        className="relative rounded-full p-2 text-[var(--admin-text-muted)] transition-colors hover:text-[var(--admin-primary)]"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
      </button>

      <div className="hidden h-8 w-px bg-[var(--admin-border)] md:block" />

      <div className="relative hidden md:block" ref={menuRef}>
        <button
          type="button"
          className="flex items-center gap-3 rounded-xl px-2 py-1 transition hover:bg-black/5"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <div className="hidden text-right lg:block">
            <p className="text-sm font-semibold text-[var(--admin-text-main)]">{name}</p>
            <p className="text-xs text-[var(--admin-text-muted)]">{role}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--admin-primary)] text-xs font-bold text-white">
            {initials}
          </div>
          <ChevronDown className="h-4 w-4 text-[var(--admin-text-muted)]" />
        </button>

        {open ? (
          <div
            className="absolute top-full right-0 z-30 mt-2 w-56 rounded-xl border border-[var(--admin-border)] bg-white p-2 shadow-lg"
            role="menu"
            aria-label="User menu"
          >
            <SignOutButton
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
