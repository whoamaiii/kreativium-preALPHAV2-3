import React from 'react';
import { Calendar } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { format } from 'date-fns';

interface DateRangePickerProps {
  from: Date;
  to: Date;
  onSelect: (range: { from: Date; to: Date } | null) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  from,
  to,
  onSelect,
}) => {
  return (
    <Card className="p-2">
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onSelect({
            from: new Date(new Date().setDate(new Date().getDate() - 7)),
            to: new Date(),
          })}
        >
          Last 7 days
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onSelect({
            from: new Date(new Date().setDate(new Date().getDate() - 30)),
            to: new Date(),
          })}
        >
          Last 30 days
        </Button>
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-lg">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">
            {format(from, 'MMM d, yyyy')} - {format(to, 'MMM d, yyyy')}
          </span>
        </div>
      </div>
    </Card>
  );
};