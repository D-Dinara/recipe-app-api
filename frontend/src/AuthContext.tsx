import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { registerUser, loginUser, fetchUserProfile } from './api';

interface User {
    name: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    register: (userData: RegisterData) => Promise<void>;
    login: (credentials: RegisterData) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface RegisterData extends User {
    email: string;
    password: string;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));

    useEffect(() => {
        if (token) {
          fetchUserProfile(token).then(setUser);
        }
    }, [token]);

    const register = async (userData: RegisterData) => {
        const data = await registerUser(userData);
        if (data.token) {
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('authToken', data.token);
        }
    };

    const login = async (credentials: RegisterData) => {
        const data = await loginUser(credentials);
        if (data.token) {
            setToken(data.token);
            const user = await fetchUserProfile(data.token);
            setUser(user);
            localStorage.setItem('authToken', data.token);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('authToken');
    };

    return (
        <AuthContext.Provider value={{ user, token, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
