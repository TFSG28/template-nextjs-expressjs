'use client';
import { useAuth } from '@/context/auth-context';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaRegCircleCheck, FaRegCircleXmark } from 'react-icons/fa6';
import Skeleton from 'react-loading-skeleton';
import { useRouter } from 'next/navigation';

const PasswdRecovery = ({ setRecovery }: { setRecovery: (boolean: boolean) => void }) => {
    const { register, handleSubmit } = useForm();
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);
    const onSubmit = handleSubmit(async (data) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/passwdRecovery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                setSent(true);
                setTimeout(() => setSent(false), 2000);
                setTimeout(() => setRecovery(false), 2500);
            } else {
                setError('Utilizador não encontrado');
                setTimeout(() => setError(''), 2000);
            }
        } catch (error) {
            setError('Erro ao enviar email de recuperação' + error);
            setTimeout(() => setError(''), 2000);
        }
    });

    useEffect(() => {
        // Simulate loading delay
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        
        return () => clearTimeout(timer);
    }, []);
    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            {loading ? (
                <Skeleton width={500} height={300} />
            ) : (
                <div className="relative z-10 max-w-md w-full">
                    <form onSubmit={onSubmit} className="bg-white p-8 rounded-lg shadow-sm">
                <div className='flex flex-col gap-6'>
                    <div>
                    <h3 className="text-center text-3xl font-bold text-gray-800">Recuperação de Palavra-Passe</h3>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Introduza o seu email para redefinir a sua palavra-passe
                    </p>
                </div>
                
                <div className="flex flex-col">
                    <label htmlFor="email" className="text-gray-700 mb-1 font-medium"><p>Endereço de email</p></label>
                    <input
                        id="email"
                        className="rounded-lg py-2 px-4 text-gray-800 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        type="email"
                        {...register('email', { required: true })}
                        autoComplete="email"
                    />
                </div>
                
                <button 
                    className='bg-[#162F08] hover:bg-green-700 transition-colors w-full font-semibold cursor-pointer text-white py-3 px-4 rounded-lg shadow-sm'
                    type="submit"
                >
                    <p>Redefinir Palavra-Passe</p>
                </button>
            </div>
            
            {sent && (
                <div className='bg-green-50 border-l-4 border-green-500 p-4 mt-4 flex items-center rounded'>
                    <div className="flex-shrink-0">
                        <FaRegCircleCheck className='h-5 w-5 text-green-500' />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-green-700">O email de recuperação foi enviado</p>
                    </div>
                </div>
            )}
            {error !== '' && (
                <div className='bg-red-50 border-l-4 border-red-500 p-4 mt-4 flex items-center rounded'>
                    <div className="flex-shrink-0">
                        <FaRegCircleXmark className='h-5 w-5 text-red-500' />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            )}
            </form>
                </div>
            )}
        </div>
    )
}

export default PasswdRecovery
