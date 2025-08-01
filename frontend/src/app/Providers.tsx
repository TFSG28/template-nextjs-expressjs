'use client';
import React from 'react';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClientWrapper from '@/components/ClientWrapper';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
            <ClientWrapper>
                {children}
            </ClientWrapper>
        </>
    )
}
