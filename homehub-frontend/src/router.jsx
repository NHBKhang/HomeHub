import { createBrowserRouter } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Devices from "./pages/Devices/Devices";
import Tasks from "./pages/Tasks/Tasks";
import Expenses from "./pages/Expenses/Expenses";
import Settings from "./pages/Settings/Settings";
import NotFound from "./pages/NotFound/NotFound";
import RequireAuth from "./pages/Auth/RequireAuth";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/",
        element: <RequireAuth />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "devices",
                element: <Devices />,
            },
            {
                path: "tasks",
                element: <Tasks />,
            },
            {
                path: "expenses",
                element: <Expenses />,
            },
            {
                path: "settings",
                element: <Settings />,
            }
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    }
]);

export default router;