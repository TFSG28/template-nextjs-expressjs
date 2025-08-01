'use client';

import Header from "./Header";
import Footer from "./Footer";
import { AuthProvider } from "@/context/auth-context";

export default function ClientWrapper({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthProvider>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                {children}
                </main>
                <Footer />
            </div>
        </AuthProvider>
    )
}