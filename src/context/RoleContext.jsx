import { createContext, useContext, useState } from 'react';

const RoleContext = createContext(null);

export const ROLES = {
  VIEWER: 'viewer',
  ADMIN: 'admin',
};

export function RoleProvider({ children }) {
  const [role, setRole] = useState(ROLES.VIEWER);

  const isAdmin = role === ROLES.ADMIN;
  const isViewer = role === ROLES.VIEWER;

  return (
    <RoleContext.Provider value={{ role, setRole, isAdmin, isViewer }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used inside RoleProvider');
  return ctx;
}
