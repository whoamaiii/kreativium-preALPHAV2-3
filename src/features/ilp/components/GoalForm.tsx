import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GoalSchema, GoalFormData, ILPGoal, SkillValues, GoalStatusValues } from '../types';
import { cn } from '../../../utils/cn';

interface GoalFormProps {
  onSubmit: (data: GoalFormData) => void;
  initialData?: Partial<ILPGoal>;
  isSubmitting?: boolean;
}

export const GoalForm: React.FC<GoalFormProps> = ({
  onSubmit,
  initialData,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GoalFormData>({
    resolver: zodResolver(GoalSchema),
    defaultValues: {
      skill: initialData?.skill || 'reading',
      description: initialData?.description || '',
      targetDate: initialData?.targetDate || '',
      status: initialData?.status || 'pending',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="skill"
          className="block text-sm font-medium mb-1"
        >
          Skill
        </label>
        <select
          id="skill"
          {...register('skill')}
          className={cn(
            'w-full px-3 py-2 border rounded-md',
            errors.skill ? 'border-red-500' : 'border-gray-300'
          )}
          aria-invalid={errors.skill ? 'true' : 'false'}
          disabled={isSubmitting}
        >
          {SkillValues.map((skill) => (
            <option key={skill} value={skill}>
              {/* Capitalize first letter */}
              {skill.charAt(0).toUpperCase() + skill.slice(1)}
            </option>
          ))}
        </select>
        {errors.skill && (
          <p className="mt-1 text-sm text-red-500">{errors.skill.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className={cn(
            'w-full px-3 py-2 border rounded-md',
            errors.description ? 'border-red-500' : 'border-gray-300'
          )}
          aria-invalid={errors.description ? 'true' : 'false'}
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="targetDate"
          className="block text-sm font-medium mb-1"
        >
          Target Date (Optional)
        </label>
        <input
          id="targetDate"
          type="date"
          {...register('targetDate')}
          className={cn(
            'w-full px-3 py-2 border rounded-md',
            errors.targetDate ? 'border-red-500' : 'border-gray-300'
          )}
          aria-invalid={errors.targetDate ? 'true' : 'false'}
          disabled={isSubmitting}
        />
        {errors.targetDate && (
          <p className="mt-1 text-sm text-red-500">{errors.targetDate.message}</p>
        )}
      </div>

      {initialData?.id && (
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium mb-1"
          >
            Status
          </label>
          <select
            id="status"
            {...register('status')}
            className={cn(
              'w-full px-3 py-2 border rounded-md',
              errors.status ? 'border-red-500' : 'border-gray-300'
            )}
            aria-invalid={errors.status ? 'true' : 'false'}
            disabled={isSubmitting}
          >
            {GoalStatusValues.map((status) => (
              <option key={status} value={status}>
                {/* Convert "in-progress" to "In Progress" */}
                {status
                  .split('-')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
          )}
        </div>
      )}

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
          {isSubmitting
            ? 'Submitting...'
            : initialData?.id
            ? 'Update Goal'
            : 'Add Goal'}
        </button>
      </div>
    </form>
  );
};

export default GoalForm; 