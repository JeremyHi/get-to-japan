'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Mail, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function VerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'no-token'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('no-token');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/verify-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          // Redirect to home after 3 seconds
          setTimeout(() => {
            router.push('/');
          }, 3000);
        } else {
          setStatus('error');
          setErrorMessage(data.error?.message || 'Verification failed');
        }
      } catch (error) {
        setStatus('error');
        setErrorMessage('Network error. Please try again.');
      }
    };

    verifyEmail();
  }, [token, router]);

  if (status === 'loading') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--color-indigo-800)] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[var(--color-sakura-400)] animate-spin" />
        </div>
        <h2 className="text-heading-2 mb-4">Verifying your email...</h2>
        <p className="text-body">
          Please wait while we confirm your email address.
        </p>
      </motion.div>
    );
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--color-success)]/20 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-[var(--color-success)]" />
        </div>
        <h2 className="text-heading-2 mb-4">Email verified!</h2>
        <p className="text-body mb-6">
          Your email has been successfully verified. You now have full access to your account.
        </p>
        <p className="text-sm text-[var(--color-indigo-500)]">
          Redirecting you to the home page...
        </p>
      </motion.div>
    );
  }

  if (status === 'error') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--color-error)]/20 flex items-center justify-center">
          <XCircle className="w-8 h-8 text-[var(--color-error)]" />
        </div>
        <h2 className="text-heading-2 mb-4">Verification failed</h2>
        <p className="text-body mb-6">
          {errorMessage || 'The verification link may have expired or already been used.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" className="btn btn-secondary">
            Go to Login
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  // No token provided
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--color-indigo-800)] flex items-center justify-center">
        <Mail className="w-8 h-8 text-[var(--color-sakura-400)]" />
      </div>
      <h2 className="text-heading-2 mb-4">Check your email</h2>
      <p className="text-body mb-6">
        We've sent you a verification link. Click the link in your email to verify your account.
      </p>
      <div className="space-y-4">
        <p className="text-sm text-[var(--color-indigo-500)]">
          Didn't receive the email? Check your spam folder or request a new link.
        </p>
        <Link href="/" className="btn btn-primary inline-flex">
          Return to Home
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function VerifyEmailPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center py-12 px-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[var(--color-sakura-500)] opacity-5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-[var(--color-ocean-500)] opacity-5 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md relative">
          <div className="card-elevated p-8">
            <Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-[var(--color-sakura-500)]/30 border-t-[var(--color-sakura-500)] rounded-full animate-spin" />
              </div>
            }>
              <VerificationContent />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  );
}
