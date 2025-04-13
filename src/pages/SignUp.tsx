import React from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { UserPlus } from 'lucide-react';
import { Form, FormInput } from '../components/Form';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

const signUpSchema = z.object({
  name: z.string().min(2, 'Navnet må være minst 2 tegn'),
  email: z.string().email('Ugyldig e-postadresse'),
  password: z.string().min(6, 'Passordet må være minst 6 tegn'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passordene må være like",
  path: ["confirmPassword"],
});

type SignUpForm = z.infer<typeof signUpSchema>;

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (data: SignUpForm) => {
    try {
      await signUp(data.email, data.password, data.name);
      addToast('Konto opprettet! Velkommen!', 'success');
      navigate('/', { replace: true });
    } catch (error) {
      addToast('Kunne ikke opprette konto. Prøv igjen.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 dark:bg-gray-800">
        <div className="text-center mb-8">
          <UserPlus className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold dark:text-white">Opprett konto</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bli med i Ask123 og start din læringsreise!
          </p>
        </div>

        <Form<SignUpForm>
          onSubmit={handleSubmit}
          schema={signUpSchema}
          className="space-y-6"
        >
          <FormInput
            name="name"
            label="Navn"
            placeholder="Ditt navn"
            autoComplete="name"
          />

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
            autoComplete="new-password"
          />

          <FormInput
            name="confirmPassword"
            type="password"
            label="Bekreft passord"
            placeholder="••••••••"
            autoComplete="new-password"
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={loading}
          >
            Opprett konto
          </Button>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Har du allerede en konto?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-purple-500 hover:text-purple-600 font-medium"
            >
              Logg inn
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SignUp;