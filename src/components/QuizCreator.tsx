import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Save, X } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { FormInput, FormTextarea, FormSelect } from './Form';
import { ImageUpload } from './ImageUpload';
import { Question } from '../types/quiz';

const questionSchema = z.object({
  text: z.string().min(1, 'Question text is required'),
  imageUrl: z.string().min(1, 'Image is required'),
  correctAnswer: z.string().min(1, 'Correct answer is required'),
  hint: z.string().optional(),
  type: z.enum(['text', 'multiple-choice', 'true-false']),
  options: z.array(z.string()).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

type QuestionForm = z.infer<typeof questionSchema>;

interface QuizCreatorProps {
  question?: Question;
  onSave: (question: Question) => void;
  onClose: () => void;
}

export const QuizCreator: React.FC<QuizCreatorProps> = ({
  question,
  onSave,
  onClose,
}) => {
  const methods = useForm<QuestionForm>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: question?.text || '',
      imageUrl: question?.imageUrl || '',
      correctAnswer: question?.correctAnswer || '',
      hint: question?.hint || '',
      type: question?.type || 'text',
      options: question?.options || [],
      difficulty: question?.difficulty || 'medium',
    },
  });

  const onSubmit = (data: QuestionForm) => {
    onSave({
      id: question?.id || Date.now(),
      category: 'custom',
      ...data,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <Card className="max-w-2xl w-full dark:bg-gray-800">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold dark:text-white">
                {question ? 'Edit Question' : 'New Question'}
              </h2>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <FormInput
                  name="text"
                  label="Question Text"
                  placeholder="What sign is shown in the image?"
                />

                <FormSelect
                  name="type"
                  label="Question Type"
                  options={[
                    { value: 'text', label: 'Text Input' },
                    { value: 'multiple-choice', label: 'Multiple Choice' },
                    { value: 'true-false', label: 'True/False' },
                  ]}
                />

                {methods.watch('type') === 'multiple-choice' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium dark:text-gray-300">
                      Options
                    </label>
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
                />

                <FormTextarea
                  name="hint"
                  label="Hint (Optional)"
                  placeholder="Provide a helpful hint"
                />

                <FormSelect
                  name="difficulty"
                  label="Difficulty"
                  options={[
                    { value: 'easy', label: 'Easy' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'hard', label: 'Hard' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  Question Image
                </label>
                <ImageUpload
                  value={methods.watch('imageUrl')}
                  onChange={(value) => methods.setValue('imageUrl', value)}
                  onClear={() => methods.setValue('imageUrl', '')}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit">
                <Save className="w-5 h-5 mr-2" />
                Save Question
              </Button>
            </div>
          </form>
        </FormProvider>
      </Card>
    </motion.div>
  );
};