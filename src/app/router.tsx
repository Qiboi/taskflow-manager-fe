import { createBrowserRouter, Navigate } from "react-router-dom";
import PublicRoute from "../routes/PublicRoute";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "../routes/ProtectedRoute";
import DashboardPage from "../pages/DashboardPage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
    {
        element: <PublicRoute />,
        children: [
            {
                path: "/login",
                element: <LoginPage />,
            },
        ],
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/",
                element: <Navigate to="/dashboard" replace />,
            },
            {
                path: "/dashboard",
                element: <DashboardPage />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
]);