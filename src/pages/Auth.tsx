import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { normalizePhoneNumber } from '@/utils/phoneUtils';
import { supabase } from '@/integrations/supabase/client';
import { FcGoogle } from 'react-icons/fc';
import { PhoneNumberInput } from '@/components/PhoneNumberInput';
import { countryCodes } from '@/utils/countryCodes';

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp, verifyOTP, sendOTP, isTestMode, connectionError } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isPhoneSignIn, setIsPhoneSignIn] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('IN'); // Default to India
  const [otp, setOTP] = useState('');
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  // forgot-password flow
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if ((isSignUp || isPhoneSignIn) && phone.length !== 10) {
      setError('Phone number must be 10 digits.');
      return;
    }
    
    setLoading(true);

    try {
      const selectedCountry = countryCodes.find(c => c.code === country);
      if (!selectedCountry) {
        setError('Invalid country selected.');
        setLoading(false);
        return;
      }
      const fullPhoneNumber = selectedCountry.dial_code + phone;

      if (isSignUp) {
        const { data, error } = await signUp(email, password, fullName, fullPhoneNumber, country);
        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }
        
        if (data && !data.session) {
          setAwaitingConfirmation(true); // Show confirmation message
        } else {
          // On successful signup with session, redirect to home
          navigate('/');
        }
      } else if (isPhoneSignIn) {
        if (!showOTPInput) {
          // First send OTP
          const normalizedPhone = normalizePhoneNumber(fullPhoneNumber, country as any);
          const { error } = await sendOTP(normalizedPhone);
          if (error) {
            setError(error.message);
            return;
          }
          setShowOTPInput(true);
        } else {
          // Verify OTP
          const normalizedPhone = normalizePhoneNumber(fullPhoneNumber, country as any);
          const { error } = await verifyOTP(normalizedPhone, otp);
          if (error) {
            setError(error.message);
            return;
          }
          // On successful verification, redirect to home
          navigate('/');
        }
      } else {
        // Regular email sign in
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
          return;
        }
        // On successful sign in, redirect to home
        navigate('/');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/'
        }
      });
    } catch (err: any) {
      setError(err.message || 'Google authentication failed');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setError(null);
    try {
      const { error } = await useAuth().resetPassword(resetEmail);
      if (error) {
        setError(error.message);
      } else {
        setShowForgot(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setResetLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setIsPhoneSignIn(false);
    setShowOTPInput(false);
    setError(null);
    setOTP('');
  };

  const togglePhoneMode = () => {
    setIsPhoneSignIn(!isPhoneSignIn);
    setShowOTPInput(false);
    setError(null);
    setOTP('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
        </div>

        {(error || connectionError) && (
          <Alert variant="destructive" className="mb-4">
            {connectionError || error}
          </Alert>
        )}

        {/* Google sign-in */}
        <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2" onClick={handleGoogleAuth}>
          <FcGoogle className="text-xl" /> Continue with Google
        </Button>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300" />
          <span className="mx-2 text-sm text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>

        {awaitingConfirmation ? (
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Please check your email</h3>
            <p className="mt-2 text-sm text-gray-600">
              A confirmation link has been sent to <strong>{email}</strong>. Please click the link to complete your registration.
            </p>
          </div>
        ) : (
          <>
            {!showForgot && (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {isSignUp && (
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1"
                      placeholder="John Doe"
                    />
                  </div>
                )}

                {(!isPhoneSignIn || isSignUp) && (
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required={!isPhoneSignIn}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                      placeholder="you@example.com"
                    />
                  </div>
                )}

                {(isPhoneSignIn || isSignUp) && (
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <PhoneNumberInput
                      country={country}
                      onCountryChange={setCountry}
                      phoneNumber={phone}
                      onPhoneNumberChange={setPhone}
                      required={isPhoneSignIn || isSignUp}
                      className="mt-1"
                    />
                  </div>
                )}

                {(!isPhoneSignIn || isSignUp) && (
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete={isSignUp ? 'new-password' : 'current-password'}
                      required={!isPhoneSignIn}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1"
                      placeholder="••••••••"
                    />
                  </div>
                )}

                {isPhoneSignIn && showOTPInput && (
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                      One-Time Password
                    </label>
                    <Input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOTP(e.target.value)}
                      className="mt-1"
                      placeholder={isTestMode ? '123456' : '000000'}
                    />
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : isPhoneSignIn ? (showOTPInput ? 'Verify OTP' : 'Send OTP') : 'Sign In'}
                  </Button>

                  {!isSignUp && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={togglePhoneMode}
                      className="w-full"
                    >
                      {isPhoneSignIn ? 'Sign in with Email' : 'Sign in with Phone'}
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={toggleAuthMode}
                    className="w-full"
                  >
                    {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
                  </Button>
                </div>
              </form>
            )}

            {showForgot && (
              <form className="space-y-6" onSubmit={handleResetPassword}>
                <div>
                  <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700">Email address</label>
                  <Input id="resetEmail" type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required className="mt-1" placeholder="you@example.com" />
                </div>
                <div className="flex flex-col gap-4">
                  <Button type="submit" disabled={resetLoading} className="w-full">{resetLoading ? 'Sending...' : 'Send reset link'}</Button>
                  <Button type="button" variant="ghost" className="w-full" onClick={() => setShowForgot(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            <div className="text-sm text-center">
              <button
                type="button"
                onClick={showForgot ? () => setShowForgot(false) : toggleAuthMode}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                {showForgot ? 'Back to Sign In' : isSignUp ? 'Already have an account? Sign In' : 'Don\'t have an account? Sign Up'}
              </button>
              {!isSignUp && !showForgot && (
                <>
                  <span className="mx-2">|</span>
                  <button
                    type="button"
                    onClick={togglePhoneMode}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {isPhoneSignIn ? 'Sign in with Email' : 'Sign in with Phone'}
                  </button>
                </>
              )}
            </div>
            
            {!showForgot && !isPhoneSignIn && (
              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
