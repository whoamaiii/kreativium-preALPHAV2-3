import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FormInput } from '../Form/FormInput';
import { ImageUpload } from '../ImageUpload';

interface CardPairEditorProps {
  index: number;
  onRemove: () => void;
}

export const CardPairEditor: React.FC<CardPairEditorProps> = ({
  index,
  onRemove,
}) => {
  const { watch, setValue } = useFormContext();
  const imageUrl = watch(`cardPairs.${index}.imageUrl`);

  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <FormInput
            name={`cardPairs.${index}.text`}
            label={`Pair ${index + 1} Text`}
            placeholder="Enter text for this card pair"
            required
          />

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Card Image
            </label>
            <ImageUpload
              value={imageUrl}
              onChange={(url) => setValue(`cardPairs.${index}.imageUrl`, url)}
              onClear={() => setValue(`cardPairs.${index}.imageUrl`, '')}
            />
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onRemove}
          className="hover:text-red-500"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};