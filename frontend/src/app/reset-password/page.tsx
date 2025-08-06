'use client';
import { useAuth } from '@/context/auth-context';
import { UserType } from '@/types/types';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { BsQuestionCircleFill } from 'react-icons/bs';
import { FaEye, FaEyeSlash, FaRegCircleCheck } from 'react-icons/fa6';
import { useRedirectIfAuthenticated } from '@/hooks/useRedirectIfAuthenticated';

const ResetPasswordContent = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [seePass, setSeePass] = useState(false);
    const [changed, setChanged] = useState(false);
    const navigator = useRouter();
    const { user } = useAuth();

    useRedirectIfAuthenticated(user as UserType);
    
    const successed = () => {
        setChanged(true);
        setTimeout(() => {
            setChanged(false);
            navigator.push('/');
        }, 2000);
    }

    const onSubmit = handleSubmit(async (data) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/passwdRecovery`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password: data.password })
        });
        if (response.status === 200) {
            successed();
        }
    });

    return (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="relative z-10 max-w-md w-full">
                <div className="bg-white shadow-sm rounded-lg p-8 space-y-6">
                    <div>
                        <h2 className="text-center text-3xl font-bold text-gray-800">Redefinir Senha</h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Crie uma nova senha para a sua conta
                        </p>
                    </div>
                    
                    <form className="space-y-6" onSubmit={onSubmit}>
                        <div className="flex flex-col">
                            <div className="flex items-center mb-1">
                                <label htmlFor="password" className="text-gray-700 font-medium"><p>Nova Senha</p></label>
                                <div className="relative inline-block group ml-2">
                                    <span className="cursor-pointer text-gray-600 hover:text-green-700">
                                        <BsQuestionCircleFill size={16} />
                                    </span>
                                    <div className="absolute hidden group-hover:block bg-white border border-gray-200 p-3 rounded-lg shadow-lg w-64 mt-2 right-0 z-20">
                                        <div className="text-sm text-gray-600 mt-2">
                                            <p>A senha deve conter:</p>
                                            <ul className="list-disc list-inside">
                                                <li>Pelo menos uma letra maiúscula.</li>
                                                <li>Pelo menos uma letra minúscula.</li>
                                                <li>Pelo menos um número.</li>
                                                <li>Pelo menos um caractere especial (@$!%*?&).</li>
                                                <li>Mínimo de 8 caracteres.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <input 
                                    id="password"
                                    className="rounded-lg p-2 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 w-full text-gray-800"
                                    type={`${seePass ? 'text' : 'password'}`}
                                    {...(register('password', { required: true, pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/ }))}
                                    placeholder='******'
                                />
                                <div 
                                    className="cursor-pointer -ml-8 text-gray-600 hover:text-gray-800 z-10" 
                                    onClick={() => setSeePass(!seePass)}
                                >
                                    {seePass ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
                                </div>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    A senha não atende aos requisitos mínimos
                                </p>
                            )}
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-lg
                                text-white bg-[#162F08] hover:bg-green-700 transition
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                                shadow-sm"
                        >
                            <p>Confirmar</p>
                        </button>
                        
                        {changed && (
                            <div className="flex items-center text-green-600 justify-center">
                                <FaRegCircleCheck size={20} className="mr-2" />
                                <span><p>Senha alterada com sucesso!</p></span>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

const Page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
};

export default Page;