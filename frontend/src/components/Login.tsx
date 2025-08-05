'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';

type LoginForm = {
    email: string;
    password: string;
}

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
    const { login, user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const onSubmit = handleSubmit(async (data) => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const ans = await response.json();

            if (response.status === 200) {
                login(ans.token, rememberMe);
                router.push('/');
            } else {
                toast.error('Erro de credenciais.');
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
        finally {
            setLoading(false);
        }
    });

    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);
    
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
                <Skeleton width={400} height={500} borderRadius={10}/>
            ) : (
                <div className="relative z-10 max-w-md w-full">
                    <form
                        onSubmit={onSubmit}
                        className="bg-white p-8 rounded-lg shadow-sm w-[400px]"
                    >
                        <div className="flex flex-col gap-6">
                            <div>
                                <h3 className="text-center text-3xl font-bold text-gray-800">Iniciar sessão</h3>
                                <p className="mt-2 text-center text-sm text-gray-600">
                                    Entre com seu email e palavra-passe
                                </p>
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="email" className="text-gray-700 mb-1 font-medium">
                                    <p>Email</p>
                                </label>
                                <input
                                    id="email"
                                    {...register('email', {
                                        required: 'Campo obligatorio',
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
                                            required: 'Campo obligatorio',
                                            minLength: {
                                                value: 6,
                                                message: 'Mínimo 6 caracteres'
                                            }
                                        })}
                                        placeholder='*****'
                                        className="rounded-lg py-2 px-4 text-gray-800 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
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

                            <div className="flex items-center mt-2">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="mr-2 h-4 w-4 text-green-600 rounded"
                                />
                                <label htmlFor="rememberMe" className="text-sm cursor-pointer text-gray-700">
                                    Lembrar a sessão
                                </label>
                            </div>

                            <div className="flex justify-end">
                                <Link href='/forgot-password' className='text-sm text-gray-600 hover:text-green-600'>
                                    Esqueceu a sua palavra-passe?
                                </Link>
                            </div>

                            <div className="flex justify-end">
                                <Link href='/register' className='text-sm text-gray-600 hover:text-green-600'>
                                    Criar conta
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className='bg-[#162F08] hover:bg-green-700 transition-colors w-full font-semibold cursor-pointer text-white py-3 px-4 rounded-lg shadow-sm'
                                disabled={loading}
                            >
                                <p>Entrar</p>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default Login;