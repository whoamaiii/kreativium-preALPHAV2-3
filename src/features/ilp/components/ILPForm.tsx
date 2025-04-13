import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ILPSchema, ILPFormData, ILP } from '../types';
import { cn } from '../../../utils/cn';

interface ILPFormProps {
  onSubmit: (data: ILPFormData) => void;
  initialData?: Partial<ILP>;
  isSubmitting?: boolean;
}

export const ILPForm: React.FC<ILPFormProps> = ({
  onSubmit,
  initialData,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILPFormData>({
    resolver: zodResolver(ILPSchema),
    defaultValues: {
      title: initialData?.title || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium mb-1"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className={cn(
            'w-full px-3 py-2 border rounded-md',
            errors.title ? 'border-red-500' : 'border-gray-300'
          )}
          aria-invalid={errors.title ? 'true' : 'false'}
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'px-4 py-2 bg-blue-600 text-white rounded-md',
            'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            isSubmitting && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isSubmitting ? 'Submitting...' : initialData?.id ? 'Update ILP' : 'Create ILP'}
        </button>
      </div>
    </form>
  );
};

export default ILPForm; 