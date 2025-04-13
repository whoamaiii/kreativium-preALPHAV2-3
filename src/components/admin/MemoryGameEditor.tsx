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
import { MemoryGame } from '../../types';

const memoryGameSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  cardPairs: z.array(z.object({
    id: z.string(),
    imageUrl: z.string().min(1, 'Image is required'),
    text: z.string().min(1, 'Text is required'),
  })).min(2, 'At least 2 card pairs are required'),
});

type MemoryGameForm = z.infer<typeof memoryGameSchema>;

interface MemoryGameEditorProps {
  game?: MemoryGame | null;
  onSave: (game: MemoryGame) => void;
  onCancel: () => void;
}

export const MemoryGameEditor: React.FC<MemoryGameEditorProps> = ({
  game,
  onSave,
  onCancel,
}) => {
  const methods = useForm<MemoryGameForm>({
    resolver: zodResolver(memoryGameSchema),
    defaultValues: {
      title: game?.title || '',
      description: game?.description || '',
      category: game?.category || '',
      difficulty: game?.difficulty || 'medium',
      cardPairs: game?.cardPairs || [],
    },
  });

  const handleSubmit = async (data: MemoryGameForm) => {
    const gameData: MemoryGame = {
      id: game?.id || Date.now().toString(),
      ...data,
      createdAt: game?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSave(gameData);
  };

  const cardPairs = methods.watch('cardPairs');

  const handleAddPair = () => {
    const newPair = {
      id: Date.now().toString(),
      imageUrl: '',
      text: '',
    };
    methods.setValue('cardPairs', [...cardPairs, newPair]);
  };

  const handleRemovePair = (id: string) => {
    methods.setValue(
      'cardPairs',
      cardPairs.filter((pair) => pair.id !== id)
    );
  };

  return (
    <Card className="p-6">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <FormInput
                name="title"
                label="Game Title"
                placeholder="e.g., Animal Pairs"
                required
              />

              <FormTextarea
                name="description"
                label="Description"
                placeholder="Describe what this memory game contains..."
                required
              />

              <FormSelect
                name="category"
                label="Category"
                options={[
                  { value: 'animals', label: 'Animals' },
                  { value: 'colors', label: 'Colors' },
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

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold dark:text-white">Card Pairs</h3>
                <Button type="button" onClick={handleAddPair}>
                  Add Pair
                </Button>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {cardPairs.map((pair, index) => (
                  <Card key={pair.id} className="p-4">
                    <div className="space-y-4">
                      <FormInput
                        name={`cardPairs.${index}.text`}
                        label={`Pair ${index + 1} Text`}
                        required
                      />

                      <div>
                        <label className="block text-sm font-medium dark:text-gray-300 mb-2">
                          Card Image
                        </label>
                        <ImageUpload
                          value={methods.watch(`cardPairs.${index}.imageUrl`)}
                          onChange={(url) => methods.setValue(`cardPairs.${index}.imageUrl`, url)}
                          onClear={() => methods.setValue(`cardPairs.${index}.imageUrl`, '')}
                        />
                      </div>

                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => handleRemovePair(pair.id)}
                        className="w-full hover:text-red-500"
                      >
                        Remove Pair
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {game ? 'Update Game' : 'Create Game'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Card>
  );
};