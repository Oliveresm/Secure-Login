import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import AppLayout from "../ui/Backgrounds/AppLayout";

const AppRouter = () => {
  return (
    <AppLayout>
      <Routes>
        {/* Public routes */}
        <Route path="/*" element={<PublicRoutes />} />

        {/* Private routes */}
        <Route path="/dashboard/*" element={<PrivateRoutes />} />
      </Routes>
    </AppLayout>
  );
};

export default AppRouter;
