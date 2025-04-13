import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { z } from 'zod';
import { Form } from '../Form';
import { FormInput } from '../FormInput';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

describe('Form', () => {
  it('renders form fields correctly', () => {
    render(
      <Form schema={schema} onSubmit={() => {}}>
        <FormInput name="email" label="Email" />
        <FormInput name="password" label="Password" type="password" />
      </Form>
    );

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('validates form fields', async () => {
    const handleSubmit = vi.fn();

    render(
      <Form schema={schema} onSubmit={handleSubmit}>
        <FormInput name="email" label="Email" />
        <FormInput name="password" label="Password" type="password" />
        <button type="submit">Submit</button>
      </Form>
    );

    await userEvent.click(screen.getByText('Submit'));

    expect(handleSubmit).not.toHaveBeenCalled();
    expect(await screen.findByText('Invalid email address')).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const handleSubmit = vi.fn();

    render(
      <Form schema={schema} onSubmit={handleSubmit}>
        <FormInput name="email" label="Email" />
        <FormInput name="password" label="Password" type="password" />
        <button type="submit">Submit</button>
      </Form>
    );

    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByText('Submit'));

    expect(handleSubmit).toHaveBeenCalledWith(
      {
        email: 'test@example.com',
        password: 'password123',
      },
      expect.anything()
    );
  });
});