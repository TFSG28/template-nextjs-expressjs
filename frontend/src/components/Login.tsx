// Login.tsx
'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type LoginForm = {
    email: string;
    password: string;
}

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
    const { login, user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

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
                setError('Erro de credenciais.');
                setTimeout(() => setError(''), 2500);
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
    return (
        <div>
            <form
                onSubmit={onSubmit}
                className='flex flex-col justify-center items-center p-10 gap-5 w-fit bg-blue-500 rounded'>
                <h1 className="text-2xl font-bold mb-4">Iniciar sessão</h1>

                <div className='flex flex-col gap-3 w-full'>
                    <label>Email</label>
                    <input
                        {...register('email', {
                            required: 'Campo obligatorio',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Email inválido'
                            }
                        })}
                        placeholder='Email'
                        className='border rounded p-2 w-64'
                        type="email"
                    />
                    {errors.email && <span className='text-red-600 text-sm'>{errors.email.message}</span>}
                </div>

                <div className='flex flex-col gap-3 w-full'>
                    <label>Palavra-passe</label>
                    <input
                        {...register('password', {
                            required: 'Campo obligatorio',
                            minLength: {
                                value: 6,
                                message: 'Mínimo 6 caracteres'
                            }
                        })}
                        placeholder='*****'
                        className='border rounded p-2 w-64'
                        type="password"
                    />
                    {errors.password && <span className='text-red-600 text-sm'>{errors.password.message}</span>}
                </div>

                {/* Checkbox para Remember Me */}
                <div className="flex items-center w-full mt-2">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="mr-2 h-4 w-4 text-purple-600 rounded"
                    />
                    <label htmlFor="rememberMe" className="text-sm cursor-pointer">
                        Lembrar a sessão
                    </label>
                </div>

                <button
                    type="submit"
                    className='bg-purple-500 px-4 py-2 rounded hover:bg-purple-600 cursor-pointer w-full mt-4 transition-colors'
                    disabled={loading}
                >
                    Entrar
                </button>
                {error !== '' && <span className='text-red-600 text-sm'>{error}</span>}
            </form>
        </div>
    )
}

export default Login;