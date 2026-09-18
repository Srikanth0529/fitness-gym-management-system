import {
    createContext,
    useEffect,
    useState,
} from "react";

import {
    ACCESS_TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    USER_KEY,
} from "../constants/authConstants";

import {
    getStorageItem,
    getStorageObject,
    removeStorageItem,
    setStorageItem,
    setStorageObject,
} from "../utils/storage";

import {
    loginUser,
} from "../services/auth/authService";

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
    const [user, setUser] = useState(() =>
        getStorageObject(USER_KEY)
    );

    const [accessToken, setAccessToken] = useState(() =>
        getStorageItem(ACCESS_TOKEN_KEY)
    );

    const [loading, setLoading] = useState(true);

    const isAuthenticated = Boolean(accessToken);

    useEffect(() => {
        setLoading(false);
    }, []);

    const login = async (loginData) => {
        const response = await loginUser(loginData);

        const loginResponse = response.data;

        setStorageItem(
            ACCESS_TOKEN_KEY,
            loginResponse.accessToken
        );

        setStorageItem(
            REFRESH_TOKEN_KEY,
            loginResponse.refreshToken
        );

        const authenticatedUser = {
            userId: loginResponse.userId,
            memberId: loginResponse.memberId,
            email: loginResponse.email,
            role: loginResponse.role,
            tokenType: loginResponse.tokenType,
        };

        setStorageObject(
            USER_KEY,
            authenticatedUser
        );

        setAccessToken(
            loginResponse.accessToken
        );

        setUser(authenticatedUser);

        return response;
    };

    const logout = () => {
        removeStorageItem(ACCESS_TOKEN_KEY);
        removeStorageItem(REFRESH_TOKEN_KEY);
        removeStorageItem(USER_KEY);

        setAccessToken(null);
        setUser(null);
    };

    const value = {
        user,
        accessToken,
        isAuthenticated,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;