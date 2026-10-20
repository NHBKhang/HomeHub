import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import userService from "../services/userSerivce";

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    const [userError, setUserError] = useState(null);

    const loadUser = useCallback(async () => {
        setUserLoading(true);
        setUserError(null);

        try {
            const data = await userService.getCurrentUser();
            setUser(data);
            return data;
        } catch (error) {
            setUser(null);

            if (error.status !== 401) {
                setUserError(
                    error.message || "Không thể tải thông tin tài khoản."
                );
            }

            throw error;
        } finally {
            setUserLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        userService.logout();
        setUser(null);
        setUserError(null);
    }, []);

    useEffect(() => {
        let active = true;

        async function initializeUser() {
            try {
                const data = await userService.getCurrentUser();

                if (active) {
                    setUser(data);
                    setUserError(null);
                }
            } catch (error) {
                if (active) {
                    setUser(null);

                    if (error.status !== 401) {
                        setUserError(
                            error.message || "Không thể kết nối máy chủ."
                        );
                    }
                }
            } finally {
                if (active) {
                    setUserLoading(false);
                }
            }
        }

        initializeUser();

        return () => {
            active = false;
        };
    }, []);

    const value = {
        user,
        setUser,
        userLoading,
        userError,
        loadUser,
        logout,
        isAuthenticated: Boolean(user),
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error(
            "useUser phải được sử dụng bên trong UserProvider."
        );
    }

    return context;
}