import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { LogIn } from 'lucide-react';
import { Form } from './Form';
import { FormInput } from './Form/FormInput';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, loading } = useAuth();
  const { addToast } = useToast();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (data: LoginForm) => {
    try {
      await signIn(data.email, data.password);
      addToast('Welcome back!', 'success');
      navigate(from, { replace: true });
    } catch (error) {
      addToast('Could not sign in. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 dark:bg-gray-800">
        <div className="text-center mb-8">
          <LogIn className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold dark:text-white">Sign In</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Sign in to continue.
          </p>
        </div>

        <Form<LoginForm>
          onSubmit={handleSubmit}
          schema={loginSchema}
          className="space-y-6"
        >
          <FormInput
            name="email"
            type="email"
            label="Email"
            placeholder="your@email.com"
            autoComplete="email"
            required
          />

          <FormInput
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={loading}
          >
            Sign In
          </Button>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-purple-500 hover:text-purple-600 font-medium"
            >
              Sign Up
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};