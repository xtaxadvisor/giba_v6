import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ThreadForm from './ThreadForm';
import { threadService } from '../../services/api/threadService';
import type { Thread, ThreadCategory } from '../../types/discussion';

export default function EditThread() {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<Thread | null>(null);

  useEffect(() => {
    if (threadId) {
      threadService.getById(threadId)
        .then((data) => {
          const mappedData: Thread = {
              id: data.id,
              title: data.title,
              content: data.content,
              author: data.author || 'Unknown', // Provide default values if necessary


              // Removed authorId as it is not part of the Thread type
              // authorId is not part of the Thread type, so it has been removed
              category: (data.category as ThreadCategory) || 'General', // Adjust based on your application's logic
              tags: data.tags || [],
              createdAt: data.createdAt || new Date().toISOString(), // Default to current date
              updatedAt: data.updatedAt || new Date().toISOString(), // Default to current date
              likes: data.likes || 0, // Default to 0 likes
              comments: data.comments || [],
              replies: 0,
              ispinned: false
          };
          setInitialData(mappedData);
        })
        .catch(console.error);
    }
  }, [threadId]);

  const handleSubmit = async (data: {
    title: string;
    content: string;
    category: ThreadCategory;
    tags: string[];
  }) => {
    if (!threadId) return;
    try {
      await threadService.update(threadId, data);
      navigate('/forum');
    } catch (error) {
      console.error('Failed to update thread:', error);
    }
  };

  if (!initialData) {
    return <div className="text-center p-10">Loading thread data...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Edit Thread</h1>
      <ThreadForm onSubmit={handleSubmit} initialValues={initialData} />
    </div>
  );
}
