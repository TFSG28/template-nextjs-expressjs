'use client'

import React, { Suspense } from 'react';
import PasswdRecovery from '../../components/PasswdRecovery';

const ForgotPasswordPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PasswdRecovery setRecovery={() => {}} />
        </Suspense>
    )
}

export default ForgotPasswordPage;

