import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../ui/Button';

interface WorkflowBuilderProps {
  workflows?: string[];
}

export function WorkflowBuilder({ workflows = [] }: WorkflowBuilderProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Workflow Builder</h2>
        <Button variant="primary" icon={Plus}>
          Create Workflow
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {workflows.length === 0 ? (
          <p className="text-gray-500">No workflows available.</p>
        ) : (
          <ul className="space-y-2">
            {workflows.map((name) => (
              <li key={name} className="p-2 border rounded">
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}