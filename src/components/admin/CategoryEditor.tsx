import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FormInput } from '../Form/FormInput';
import { FormTextarea } from '../Form/FormTextarea';
import { ImageUpload } from '../ImageUpload';
import { Category } from '../../types';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().min(1, 'Icon is required'),
  slug: z.string().min(1, 'Slug is required'),
  order: z.number().optional(),
});

type CategoryForm = z.infer<typeof categorySchema>;

interface CategoryEditorProps {
  category?: Category | null;
  onSave: (category: Category) => void;
  onCancel: () => void;
}

export const CategoryEditor: React.FC<CategoryEditorProps> = ({
  category,
  onSave,
  onCancel,
}) => {
  const methods = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      icon: category?.icon || '',
      slug: category?.slug || '',
      order: category?.order || 0,
    },
  });

  return (
    <Card className="p-6">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSave)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <FormInput
                name="name"
                label="Category Name"
                placeholder="e.g., Colors, Animals, Numbers"
                required
              />

              <FormTextarea
                name="description"
                label="Description"
                placeholder="Describe what this category contains..."
                required
              />

              <FormInput
                name="slug"
                label="URL Slug"
                placeholder="e.g., colors, animals, numbers"
                required
                helperText="This will be used in the URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category Icon
              </label>
              <ImageUpload
                value={methods.watch('icon')}
                onChange={(url) => methods.setValue('icon', url)}
                onClear={() => methods.setValue('icon', '')}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {category ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Card>
  );
};