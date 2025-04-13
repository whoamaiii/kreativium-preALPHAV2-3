import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Settings } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CategoryList } from '../../components/admin/CategoryList';
import { CategoryEditor } from '../../components/admin/CategoryEditor';
import { useCategoryManager } from '../../hooks/useCategoryManager';
import { useToast } from '../../hooks/useToast';
import { Category } from '../../types';

export const CategoryManager: React.FC = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoryManager();
  const { addToast } = useToast();

  const handleSave = async (category: Category) => {
    try {
      if (editingCategory) {
        await updateCategory(category);
        addToast('Category updated successfully!', 'success');
      } else {
        await addCategory(category);
        addToast('Category created successfully!', 'success');
      }
      setShowEditor(false);
      setEditingCategory(null);
    } catch (error) {
      addToast('Failed to save category', 'error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Category Manager</h1>
          <p className="text-gray-400">Organize and manage content categories</p>
        </div>

        <Button onClick={() => setShowEditor(true)}>
          <Plus className="w-5 h-5 mr-2" />
          New Category
        </Button>
      </div>

      {showEditor ? (
        <CategoryEditor
          category={editingCategory}
          onSave={handleSave}
          onCancel={() => {
            setShowEditor(false);
            setEditingCategory(null);
          }}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {categories.length === 0 ? (
            <Card className="p-8 text-center">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">No Categories Yet</h2>
              <p className="text-gray-400 mb-4">
                Get started by creating your first category!
              </p>
              <Button onClick={() => setShowEditor(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Create Category
              </Button>
            </Card>
          ) : (
            <CategoryList
              categories={categories}
              onEdit={(category) => {
                setEditingCategory(category);
                setShowEditor(true);
              }}
              onDelete={deleteCategory}
            />
          )}
        </motion.div>
      )}
    </div>
  );
};