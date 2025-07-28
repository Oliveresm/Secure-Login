import { useEffect, useState } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import useLogout  from "@hooks/useLogout";
import secureApi from "@services/axios/secure.api";

import PrivateLayout from "@ui/Backgrounds/PrivateLayout";
import Dashboard from "@modules/private/Dashboard/Dashboard";

const PrivateRoutes = () => {
  const location = useLocation();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [allowAccess, setAllowAccess] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        await secureApi.get("/auth/check");
        setAllowAccess(true);
      } catch {
        useLogout();
      } finally {
        setCheckingAuth(false);
      }
    };

    validateToken();
  }, [location.pathname]);

  if (checkingAuth) return null;
  if (!allowAccess) return <Navigate to="/login" />;

  return (
    <AnimatePresence mode="wait">
      <PrivateLayout>
        <Routes location={location} key={location.pathname}>
          <Route index element={<Dashboard />} />
    
        </Routes>
      </PrivateLayout>
    </AnimatePresence>
  );
};

export default PrivateRoutes;
