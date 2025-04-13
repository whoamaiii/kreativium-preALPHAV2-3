import React from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { UserPlus } from 'lucide-react';
import { Form } from './Form';
import { FormInput } from './Form/FormInput';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpForm = z.infer<typeof signUpSchema>;

export const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (data: SignUpForm) => {
    try {
      await signUp(data.email, data.password, data.name);
      addToast('Account created! Welcome!', 'success');
      navigate('/', { replace: true });
    } catch (error) {
      addToast('Could not create account. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 dark:bg-gray-800">
        <div className="text-center mb-8">
          <UserPlus className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold dark:text-white">Create Account</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Join Ask123 and start your learning journey!
          </p>
        </div>

        <Form<SignUpForm>
          onSubmit={handleSubmit}
          schema={signUpSchema}
          className="space-y-6"
        >
          <FormInput
            name="name"
            label="Name"
            placeholder="Your name"
            autoComplete="name"
            required
          />

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
            autoComplete="new-password"
            required
          />

          <FormInput
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="••••••••"
            autoComplete="new-password"
            required
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={loading}
          >
            Create Account
          </Button>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-purple-500 hover:text-purple-600 font-medium"
            >
              Sign In
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};