// import SignInComponent from "@/components/SignIn";

// export default function Page() {
//   return <SignInComponent />;
// }

//

'use client';

import { SignInForm } from '@/components/SignInForm';
import { SocialLoginButtons } from '@/components/SocialLoginButtons';
import { useAuth } from '@/hooks/useAuth'; // 로그인 로직을 처리하는 훅
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const { handleLogin, handleSocialLogin } = useAuth();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (email: string, password: string) => {
    setError('');
    try {
      const res = await handleLogin(email, password);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => {
          router.push('/user/courses');
        }, 500);
      }
    } catch {
      setError('Login failed');
    }
  };

  const socialLogin = (provider: 'google' | 'github') => {
    handleSocialLogin(provider);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white p-6">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-4">Sign In</h2>

        <SignInForm onSubmit={handleSubmit} error={error} successMessage={successMessage} />

        <div className="flex items-center mt-6">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="mx-3 text-sm text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        <SocialLoginButtons onSocialLogin={socialLogin} />
      </div>
    </div>
  );
}
