import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FormInput } from '../Form/FormInput';
import { FormSelect } from '../Form/FormSelect';
import { AdminUser } from '../../types/admin';

const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  role: z.enum(['admin', 'editor', 'viewer']),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

type UserForm = z.infer<typeof userSchema>;

interface UserEditorProps {
  user?: AdminUser | null;
  onSave: (user: AdminUser) => void;
  onCancel: () => void;
}

export const UserEditor: React.FC<UserEditorProps> = ({
  user,
  onSave,
  onCancel,
}) => {
  const methods = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: user?.email || '',
      displayName: user?.displayName || '',
      role: user?.role || 'viewer',
    },
  });

  return (
    <Card className="p-6">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSave)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormInput
              name="email"
              label="Email"
              type="email"
              required
            />

            <FormInput
              name="displayName"
              label="Display Name"
              required
            />

            <FormSelect
              name="role"
              label="Role"
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'editor', label: 'Editor' },
                { value: 'viewer', label: 'Viewer' },
              ]}
              required
            />

            {!user && (
              <FormInput
                name="password"
                label="Password"
                type="password"
                required
              />
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {user ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Card>
  );
};