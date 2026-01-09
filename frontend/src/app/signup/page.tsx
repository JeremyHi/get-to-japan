'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Check, Plane } from 'lucide-react';
import Header from '@/components/Header';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { cn } from '@/lib/utils';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');
  const { register, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/');
    return null;
  }

  const validatePassword = (pwd: string) => {
    const checks = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
    };
    return checks;
  };

  const passwordChecks = validatePassword(password);
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!isPasswordValid) {
      setError('Please meet all password requirements');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    const result = await register(email, password);

    if (result.success) {
      setSuccess(true);
      // Redirect after a short delay to show success
      setTimeout(() => {
        if (plan) {
          router.push(`/pricing?selected=${plan}`);
        } else {
          router.push('/');
        }
      }, 2000);
    } else {
      setError(result.error || 'Registration failed');
    }

    setIsLoading(false);
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--color-success)]/20 flex items-center justify-center">
          <Check className="w-8 h-8 text-[var(--color-success)]" />
        </div>
        <h2 className="text-heading-2 mb-4">Welcome aboard!</h2>
        <p className="text-body mb-4">
          Your account has been created successfully.
        </p>
        <p className="text-sm text-[var(--color-indigo-500)]">
          Check your email to verify your account. Redirecting...
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[var(--color-indigo-300)] mb-2">
          Email address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-indigo-500)]" />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input pl-12 w-full"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[var(--color-indigo-300)] mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-indigo-500)]" />
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input pl-12 pr-12 w-full"
            placeholder="Create a strong password"
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-indigo-500)] hover:text-[var(--color-indigo-300)]"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Password requirements */}
        {password.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className={cn(
              "flex items-center gap-2",
              passwordChecks.length ? "text-[var(--color-success)]" : "text-[var(--color-indigo-500)]"
            )}>
              {passwordChecks.length ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-current" />}
              8+ characters
            </div>
            <div className={cn(
              "flex items-center gap-2",
              passwordChecks.uppercase ? "text-[var(--color-success)]" : "text-[var(--color-indigo-500)]"
            )}>
              {passwordChecks.uppercase ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-current" />}
              Uppercase letter
            </div>
            <div className={cn(
              "flex items-center gap-2",
              passwordChecks.lowercase ? "text-[var(--color-success)]" : "text-[var(--color-indigo-500)]"
            )}>
              {passwordChecks.lowercase ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-current" />}
              Lowercase letter
            </div>
            <div className={cn(
              "flex items-center gap-2",
              passwordChecks.number ? "text-[var(--color-success)]" : "text-[var(--color-indigo-500)]"
            )}>
              {passwordChecks.number ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-current" />}
              Number
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--color-indigo-300)] mb-2">
          Confirm password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-indigo-500)]" />
          <input
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={cn(
              "input pl-12 w-full",
              confirmPassword.length > 0 && (passwordsMatch ? "border-[var(--color-success)]" : "border-[var(--color-error)]")
            )}
            placeholder="Confirm your password"
            autoComplete="new-password"
            required
          />
        </div>
        {confirmPassword.length > 0 && !passwordsMatch && (
          <p className="mt-2 text-xs text-[var(--color-error)]">Passwords do not match</p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-lg bg-[var(--color-error)]/10 border border-[var(--color-error)]/30 text-[var(--color-error)] text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || !isPasswordValid || !passwordsMatch}
        className={cn(
          "btn btn-primary w-full justify-center",
          (isLoading || !isPasswordValid || !passwordsMatch) && "opacity-50 cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Creating account...
          </span>
        ) : (
          <>
            Create Account
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      {/* Login link */}
      <p className="text-center text-sm text-[var(--color-indigo-400)]">
        Already have an account?{' '}
        <Link href="/login" className="text-[var(--color-sakura-400)] hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default function SignupPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center py-12 px-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/3 w-[500px] h-[500px] bg-[var(--color-sakura-500)] opacity-5 rounded-full blur-3xl" />
          <div className="absolute bottom-40 right-1/4 w-[400px] h-[400px] bg-[var(--color-ocean-500)] opacity-5 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative"
        >
          <div className="card-elevated p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[var(--color-sakura-500)] to-[var(--color-sakura-400)] flex items-center justify-center">
                <Plane className="w-6 h-6 text-[var(--color-indigo-950)]" />
              </div>
              <h1 className="text-heading-2 mb-2">Create your account</h1>
              <p className="text-body text-sm">
                Start finding the best flights to Japan with your points
              </p>
            </div>

            <Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-[var(--color-sakura-500)]/30 border-t-[var(--color-sakura-500)] rounded-full animate-spin" />
              </div>
            }>
              <SignupForm />
            </Suspense>
          </div>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center text-xs text-[var(--color-indigo-500)]">
            <div>
              <div className="font-medium text-[var(--color-indigo-300)] mb-1">Free to start</div>
              <div>5 searches/day</div>
            </div>
            <div>
              <div className="font-medium text-[var(--color-indigo-300)] mb-1">No card required</div>
              <div>Upgrade anytime</div>
            </div>
            <div>
              <div className="font-medium text-[var(--color-indigo-300)] mb-1">Instant access</div>
              <div>Start searching now</div>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
}
