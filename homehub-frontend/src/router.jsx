import { createBrowserRouter } from "react-router-dom";
import RequireAuth from "./pages/Auth/RequireAuth";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Devices from "./pages/Devices/Devices";
import Tasks from "./pages/Tasks/Tasks";
import Expenses from "./pages/Expenses/Expenses";
import NotFound from "./pages/NotFound/NotFound";
import Settings from "./pages/System/Settings/Settings";
import Profile from "./pages/System/Profile/Profile";
import Users from "./pages/Admin/Users/Users";

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
                path: "profile",
                element: <Profile />,
            },
            {
                path: "settings",
                element: <Settings />,
            }
        ],
    },
    {
        path: "/",
        element: <RequireAuth requiredRole="admin" />,
        children: [
            {
                path: "users",
                element: <Users />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    }
]);

export default router;