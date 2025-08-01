// auth-context.tsx
'use client'

import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type UserType = {
    id: string;
    email: string;
    role: number;
    token: string;
}

type AuthContextType = {
    user: UserType | null;
    rememberMe: boolean;
    login: (token: string, remember: boolean) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const router = useRouter();

    // Cargar datos de sesión al iniciar
    useEffect(() => {
        const storedToken = localStorage.getItem('rememberMeToken') || sessionStorage.getItem('token');
        if (storedToken) {
            try {
                const decoded = JSON.parse(atob(storedToken.split('.')[1]));
                setUser({
                    id: decoded.userId,
                    email: decoded.email,
                    role: decoded.role,
                    token: storedToken
                });
            } catch (error) {
                console.error(error);
                // Token inválido, limpiar almacenamiento
                localStorage.removeItem('rememberMeToken');
                sessionStorage.removeItem('token');
            }
        }
    }, []);

    const login = (token: string, remember: boolean) => {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUser({
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            token
        });

        setRememberMe(remember);

        if (remember) {
            localStorage.setItem('rememberMeToken', token);
            sessionStorage.removeItem('token');
        } else {
            sessionStorage.setItem('token', token);
            localStorage.removeItem('rememberMeToken');
        }
    };

    const logout = () => {
        setUser(null);
        setRememberMe(false);
        localStorage.removeItem('rememberMeToken');
        sessionStorage.removeItem('token');
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, rememberMe, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return context;
};