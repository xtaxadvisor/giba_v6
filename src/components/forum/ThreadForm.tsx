import React, { useState } from 'react';
import { ThreadCategory, Thread } from '../../types/discussion';

interface ThreadFormProps {
  onSubmit: (data: {
    title: string;
    content: string;
    category: ThreadCategory;
    tags: string[];
  }) => void;
  initialValues?: Thread;
  }


const ThreadForm = ({ onSubmit, initialValues }: ThreadFormProps) => { 
  // Placeholder form state and handlers for demonstration purposes
  const [title, setTitle] = useState(initialValues?.title || '');
  const [content, setContent] = useState(initialValues?.content || '');
  const [category, setCategory] = useState<ThreadCategory>(initialValues?.category || 'general');
  const [tags, setTags] = useState<string[]>(initialValues?.tags || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, category, tags });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form implementation goes here */}
      <div>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Content:
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Category:
          <select
            value={category}
            onChange={e => setCategory(e.target.value as ThreadCategory)}
          >
            <option value="general">General</option>
            <option value="help">Help</option>
            <option value="discussion">Discussion</option>
            {/* Add more categories as needed */}
          </select>
        </label>
      </div>
      <div>
        <label>
          Tags (comma separated):
          <input
            type="text"
            value={tags.join(',')}
            onChange={e => setTags(e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
          />
        </label>
      </div>
      <button type="submit">Submit</button>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ThreadForm;