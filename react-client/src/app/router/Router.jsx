import { Navigate, createBrowserRouter } from "react-router";
import App from "../layout/App";
import LoginPage from "../../features/auth/LoginPage";
import DashboardPage from "../../features/dashboard/DashboardPage";
import RegisterPage from "../../features/auth/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import VerifyEmailPage from "../../features/auth/VerifyEmailPage";
import ResetPasswordPage from "../../features/auth/ResetPasswordPage";
import ForgotPasswordPage from "../../features/auth/ForgotPasswordPage";

export const router = createBrowserRouter([{
    path: "/",
    element: <App />,
    children: [
        { path: "", element: <Navigate replace to="/login" /> },
        { path: "login", element: <GuestRoute><LoginPage /></GuestRoute> },
        { path: "register", element: <GuestRoute><RegisterPage /></GuestRoute> },
        { path: "forgot-password", element: <GuestRoute><ForgotPasswordPage /></GuestRoute> },
        { path: "dashboard", element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
        { path: "verify-email", element: <VerifyEmailPage /> },
        { path: "reset-password", element: <ResetPasswordPage /> },
        { path: "*", element: <Navigate replace to="/login" /> },
    ]
}])