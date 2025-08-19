import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const AuthDebug = () => {
  const { user, session, loading, isTestMode, toggleTestMode, signIn, signUp, signOut } = useAuth();
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('password123');
  const [testName, setTestName] = useState('Test User');
  const [testPhone, setTestPhone] = useState('+1234567890');

  const handleTestSignUp = async () => {
    console.log('Testing sign up...');
    const result = await signUp(testEmail, testPassword, testName, testPhone, 'US');
    console.log('Sign up result:', result);
  };

  const handleTestSignIn = async () => {
    console.log('Testing sign in...');
    const result = await signIn(testEmail, testPassword);
    console.log('Sign in result:', result);
  };

  const handleTestSignOut = async () => {
    console.log('Testing sign out...');
    await signOut();
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Auth Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Current State:</Label>
          <div className="text-sm space-y-1">
            <div>Loading: {loading ? 'Yes' : 'No'}</div>
            <div>Test Mode: {isTestMode ? 'Yes' : 'No'}</div>
            <div>User: {user ? user.email : 'None'}</div>
            <div>Session: {session ? 'Active' : 'None'}</div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Test Email:</Label>
          <Input
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="test@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label>Test Password:</Label>
          <Input
            type="password"
            value={testPassword}
            onChange={(e) => setTestPassword(e.target.value)}
            placeholder="password123"
          />
        </div>

        <div className="space-y-2">
          <Label>Test Name:</Label>
          <Input
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            placeholder="Test User"
          />
        </div>

        <div className="space-y-2">
          <Label>Test Phone:</Label>
          <Input
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
            placeholder="+1234567890"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Button onClick={handleTestSignUp} variant="outline">
            Test Sign Up
          </Button>
          <Button onClick={handleTestSignIn} variant="outline">
            Test Sign In
          </Button>
          <Button onClick={handleTestSignOut} variant="outline">
            Test Sign Out
          </Button>
          <Button onClick={toggleTestMode} variant="outline">
            Toggle Test Mode
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 