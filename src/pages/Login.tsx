import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { LogIn } from 'lucide-react';
import { Form, FormInput } from '../components/Form';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

const loginSchema = z.object({
  email: z.string().email('Ugyldig e-postadresse'),
  password: z.string().min(6, 'Passordet må være minst 6 tegn'),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, loading } = useAuth();
  const { addToast } = useToast();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (data: LoginForm) => {
    try {
      await signIn(data.email, data.password);
      addToast('Velkommen tilbake!', 'success');
      navigate(from, { replace: true });
    } catch (error) {
      addToast('Kunne ikke logge inn. Prøv igjen.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 dark:bg-gray-800">
        <div className="text-center mb-8">
          <LogIn className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold dark:text-white">Logg inn</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Velkommen tilbake! Logg inn for å fortsette.
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
            label="E-post"
            placeholder="din@epost.no"
            autoComplete="email"
          />

          <FormInput
            name="password"
            type="password"
            label="Passord"
            placeholder="••••••••"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={loading}
          >
            Logg inn
          </Button>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Har du ikke en konto?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-purple-500 hover:text-purple-600 font-medium"
            >
              Registrer deg
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;