import { createContext, useContext, useState } from "react";
//Para poder hacer el modal de login.
interface AuthModalContextType {
  isOpen: boolean;
  reason: "expired" | "unauthenticated" | null;
  openModal: (reason: "expired" | "unauthenticated") => void;
  closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState<"expired" | "unauthenticated" | null>(null);

  const openModal = (r: "expired" | "unauthenticated") => {
    setReason(r);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setReason(null);
  };

  return (
    <AuthModalContext.Provider value={{ isOpen, reason, openModal, closeModal }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
};
