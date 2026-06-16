import { Navigate, createBrowserRouter } from "react-router";
import App from "../layout/App";
import LoginPage from "../../features/auth/LoginPage";
import DashboardPage from "../../features/dashboard/DashboardPage";
import RegisterPage from "../../features/auth/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import VerifyEmailPage from "../../features/auth/VerifyEmailPage";
import ResetPasswordPage from "../../features/auth/ResetPasswordPage";
import ForgotPasswordPage from "../../features/auth/ForgotPasswordPage";


export const router = createBrowserRouter([{
    path : "/",
    element : <App/>,
    children : [
        {path: "", element: <Navigate replace to="/login"/>},
        {path:"login", element:<LoginPage/>},
        {path:"*", element:<Navigate replace to="/login"/>},
        { path: "dashboard", element: <ProtectedRoute>
            <DashboardPage />
        </ProtectedRoute> },
        { path: "register", element: <RegisterPage /> },
        {path: "verify-email", element: <VerifyEmailPage/>},
        {path:"reset-password", element : <ResetPasswordPage/>},
        {path:"forgot-password", element : <ForgotPasswordPage/>}
    ]
    }
])