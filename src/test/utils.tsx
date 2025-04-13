import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';

// Default wrapper with providers needed for most components
interface TestWrapperProps {
  children: React.ReactNode;
}

export const TestWrapper: React.FC<TestWrapperProps> = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

// Wrapper for form components that need react-hook-form context
export const FormWrapper: React.FC<TestWrapperProps> = ({ children }) => {
  const methods = useForm();
  
  return (
    <TestWrapper>
      <FormProvider {...methods}>
        {children}
      </FormProvider>
    </TestWrapper>
  );
};

// Custom render function with app providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  useFormWrapper?: boolean;
}

export function renderWithProviders(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const { useFormWrapper = false, ...renderOptions } = options || {};
  const Wrapper = useFormWrapper ? FormWrapper : TestWrapper;
  
  return {
    user: userEvent.setup(),
    ...render(ui, {
      wrapper: Wrapper,
      ...renderOptions,
    }),
  };
}

// Helper to resolve after any effects
export const waitForEffects = () => new Promise(resolve => setTimeout(resolve, 0));

// Helper to pause test execution (useful for debugging)
export const pause = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms)); 