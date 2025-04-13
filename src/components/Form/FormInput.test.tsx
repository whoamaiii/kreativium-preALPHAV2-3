import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import { FormInput } from './FormInput';
import { FormWrapper } from './FormWrapper';
import { z } from 'zod';

describe('FormInput', () => {
  it('renders correctly with label', () => {
    renderWithProviders(
      <FormWrapper onSubmit={() => {}}>
        <FormInput name="test" label="Test Label" />
      </FormWrapper>,
      { useFormWrapper: true }
    );
    
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });
  
  it('shows required indicator when required prop is true', () => {
    renderWithProviders(
      <FormWrapper onSubmit={() => {}}>
        <FormInput name="test" label="Test Label" required />
      </FormWrapper>,
      { useFormWrapper: true }
    );
    
    expect(screen.getByText('*')).toBeInTheDocument();
  });
  
  it('displays error message when error prop is provided', () => {
    renderWithProviders(
      <FormWrapper onSubmit={() => {}}>
        <FormInput name="test" label="Test Label" error="This field has an error" />
      </FormWrapper>,
      { useFormWrapper: true }
    );
    
    expect(screen.getByText('This field has an error')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });
  
  it('applies form validation and shows error message', async () => {
    const schema = z.object({
      email: z.string().email('Invalid email address'),
    });
    
    const handleSubmit = vi.fn();
    
    const { user } = renderWithProviders(
      <FormWrapper onSubmit={handleSubmit} schema={schema}>
        <FormInput name="email" label="Email" />
        <button type="submit">Submit</button>
      </FormWrapper>,
      { useFormWrapper: true }
    );
    
    // Type invalid email and submit
    await user.type(screen.getByLabelText('Email'), 'not-valid-email');
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    
    // Wait for validation
    await screen.findByText('Invalid email address');
    
    // Form should not be submitted with invalid data
    expect(handleSubmit).not.toHaveBeenCalled();
    
    // Clear input and type valid email
    await user.clear(screen.getByLabelText('Email'));
    await user.type(screen.getByLabelText('Email'), 'valid@example.com');
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    
    // Form should be submitted with valid data
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
}); 