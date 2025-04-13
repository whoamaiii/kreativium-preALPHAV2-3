import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FormInput } from '../Form/FormInput';
import { FormSelect } from '../Form/FormSelect';
import { FormTextarea } from '../Form/FormTextarea';
import { ImageUpload } from '../ImageUpload';
import { Question } from '../../types';

const questionSchema = z.object({
  text: z.string().min(1, 'Question text is required'),
  type: z.enum(['text', 'multiple-choice', 'true-false']),
  imageUrl: z.string().min(1, 'Image is required'),
  correctAnswer: z.string().min(1, 'Correct answer is required'),
  options: z.array(z.string()).optional(),
  hint: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

type QuizForm = z.infer<typeof questionSchema>;

interface QuizEditorProps {
  quiz?: Question | null;
  onSave: (quiz: Question) => void;
  onCancel: () => void;
}

export const QuizEditor: React.FC<QuizEditorProps> = ({
  quiz,
  onSave,
  onCancel,
}) => {
  const methods = useForm<QuizForm>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: quiz?.text || '',
      type: quiz?.type || 'text',
      imageUrl: quiz?.imageUrl || '',
      correctAnswer: quiz?.correctAnswer || '',
      options: quiz?.options || [],
      hint: quiz?.hint || '',
      category: quiz?.category || '',
      difficulty: quiz?.difficulty || 'medium',
    },
  });

  const questionType = methods.watch('type');

  return (
    <Card className="p-6">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSave)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <FormInput
                name="text"
                label="Question Text"
                placeholder="What sign is shown in the image?"
                required
              />

              <FormSelect
                name="type"
                label="Question Type"
                options={[
                  { value: 'text', label: 'Text Input' },
                  { value: 'multiple-choice', label: 'Multiple Choice' },
                  { value: 'true-false', label: 'True/False' },
                ]}
                required
              />

              {questionType === 'multiple-choice' && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">
                    Answer Options
                  </h3>
                  {[0, 1, 2, 3].map((index) => (
                    <FormInput
                      key={index}
                      name={`options.${index}`}
                      placeholder={`Option ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              <FormInput
                name="correctAnswer"
                label="Correct Answer"
                placeholder="Enter the correct answer"
                required
              />

              <FormTextarea
                name="hint"
                label="Hint (Optional)"
                placeholder="Provide a helpful hint for the user"
              />

              <FormSelect
                name="category"
                label="Category"
                options={[
                  { value: 'colors', label: 'Colors' },
                  { value: 'animals', label: 'Animals' },
                  { value: 'numbers', label: 'Numbers' },
                  { value: 'daily', label: 'Daily Expressions' },
                ]}
                required
              />

              <FormSelect
                name="difficulty"
                label="Difficulty"
                options={[
                  { value: 'easy', label: 'Easy' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'hard', label: 'Hard' },
                ]}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Question Image
              </label>
              <ImageUpload
                value={methods.watch('imageUrl')}
                onChange={(url) => methods.setValue('imageUrl', url)}
                onClear={() => methods.setValue('imageUrl', '')}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {quiz ? 'Update Quiz' : 'Create Quiz'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Card>
  );
};