import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles for Toastify
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import RecoverPage from "./pages/RecoverPage";
import VerifyPage from "./pages/VerifyPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import CalendarPage from "./pages/CalendarPage";
import PatientListPage from "./pages/PatientListPage";
import PatientPage from "./pages/PatientPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ProtectedRoute from "./layouts/ProtectedRoute";
import ProtectedRouteAdmin from "./layouts/ProtectedRouteAdmin";
import "./global.css";
import "./color.css";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        {/* Login Page */}
        <Route index element={<LoginPage />} />

        {/* Signup Page */}
        <Route path="/signup" element={<SignUpPage />} />

        {/* Recover Page */}
        <Route path="/recover" element={<RecoverPage />} />

        {/* Verify Page */}
        <Route path="/verify" element={<VerifyPage />}/>
        
        {/* Forgot Password Page*/}
        <Route path="/forgot/:userToken" element={<ForgotPasswordPage />} />

        {/* Home Route with MainLayout */}
        <Route path="/home" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="patient" element={<PatientListPage />} />
          <Route path="patient/:patientId" element={<PatientPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
        </Route>
      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
      {/* Add ToastContainer globally */}
      <ToastContainer />
    </>
  );
}
