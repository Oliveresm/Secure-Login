import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Landing from "../modules/public/Landing/Landing";
import Login from "../modules/public/Login/Login";
import Register from "../modules/public/Register/Register";
import ForgotPassword from "../modules/public/ForgotPassword/ForgotPassword";
import PublicLayout from "../ui/Backgrounds/PublicLayout";
import VerifyAccount from "@modules/public/VerifyAccount/VerifyAccount";
import ResetPassword from "@modules/public/ResetPassword/ResetPassword";
import CreateDisplayName from "@modules/public/CreateDisplayName/CreateDisplayName";
const PublicRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <PublicLayout>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify" element={<VerifyAccount />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/create-display-name" element={<CreateDisplayName />} />
        </Routes>
      </PublicLayout>
    </AnimatePresence>
  );
};

export default PublicRoutes;
