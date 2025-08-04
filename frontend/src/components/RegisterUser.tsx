'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa';
import { FaRegCircleXmark } from 'react-icons/fa6';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/auth-context';

type RegisterForm = {
    name: string;
    lastname: string;
    email: string;
    password: string;
}

export default function RegisterUser() {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const ans = await response.json();

            if (response.status === 201) {
                toast.success('Account created successfully');
                router.push('/login');
            } else {
                setError(ans.message || 'Erro ao criar conta.');
                setTimeout(() => setError(''), 2500);
            }
        } catch (error) {
            console.log(error);
            setError('Ocorreu um erro. Tente novamente.');
            setTimeout(() => setError(''), 2500);
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
                <Skeleton width={400} height={500} />
            ) : (
                <div className="relative z-10 max-w-md w-full">
                    <form
                        onSubmit={onSubmit}
                        className="bg-white p-8 rounded-lg shadow-sm"
                    >
                        <div className="flex flex-col gap-6">
                            <div>
                                <h3 className="text-center text-3xl font-bold text-gray-800">Criar conta</h3>
                                <p className="mt-2 text-center text-sm text-gray-600">
                                    Preencha os dados para criar a sua conta
                                </p>
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="name" className="text-gray-700 mb-1 font-medium">
                                    <p>Nome</p>
                                </label>
                                <input
                                    id="name"
                                    {...register('name', {
                                        required: 'Campo obrigatório',
                                        minLength: {
                                            value: 2,
                                            message: 'Mínimo 2 caracteres'
                                        }
                                    })}
                                    placeholder='Nome'
                                    className="rounded-lg py-2 px-4 text-gray-800 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    type="text"
                                />
                                {errors.name && <span className='text-red-600 text-sm mt-1'>{errors.name.message}</span>}
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="lastname" className="text-gray-700 mb-1 font-medium">
                                    <p>Apelido</p>
                                </label>
                                <input
                                    id="lastname"
                                    {...register('lastname', {
                                        required: 'Campo obrigatório',
                                        minLength: {
                                            value: 2,
                                            message: 'Mínimo 2 caracteres'
                                        }
                                    })}
                                    placeholder='Apelido'
                                    className="rounded-lg py-2 px-4 text-gray-800 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    type="text"
                                />
                                {errors.lastname && <span className='text-red-600 text-sm mt-1'>{errors.lastname.message}</span>}
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="email" className="text-gray-700 mb-1 font-medium">
                                    <p>Email</p>
                                </label>
                                <input
                                    id="email"
                                    {...register('email', {
                                        required: 'Campo obrigatório',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Email inválido'
                                        }
                                    })}
                                    placeholder='Email'
                                    className="rounded-lg py-2 px-4 text-gray-800 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    type="email"
                                    autoComplete="email"
                                />
                                {errors.email && <span className='text-red-600 text-sm mt-1'>{errors.email.message}</span>}
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="password" className="text-gray-700 mb-1 font-medium">
                                    <p>Palavra-passe</p>
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        {...register('password', {
                                            required: 'Campo obrigatório',
                                            minLength: {
                                                value: 6,
                                                message: 'Mínimo 6 caracteres'
                                            }
                                        })}
                                        placeholder='*****'
                                        className="rounded-lg py-2 px-4 text-gray-800 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                    />
                                    <button 
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.password && <span className='text-red-600 text-sm mt-1'>{errors.password.message}</span>}
                            </div>

                            <div className="flex justify-end">
                                <Link href='/login' className='text-sm text-gray-600 hover:text-green-600'>
                                    Já tem conta? Entrar
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className='bg-[#162F08] hover:bg-green-700 transition-colors w-full font-semibold cursor-pointer text-white py-3 px-4 rounded-lg shadow-sm'
                                disabled={loading}
                            >
                                <p>Registar</p>
                            </button>
                        </div>

                        {error !== '' && (
                            <div className='bg-red-50 border-l-4 border-red-500 p-4 mt-6 flex items-center rounded'>
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
    );
}

