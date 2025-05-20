import { Routes, Route } from 'react-router-dom';
import { ForumLayout } from '../../components/forum/ForumLayout';
import { ThreadList } from '../../components/forum/ThreadList';
import { ThreadDetail } from '../../components/forum/ThreadDetail';
import CreateThread from '../../components/forum/ThreadForm';

export default function ForumPage() {
  return (
    <ForumLayout>
      <Routes>
        <Route path="/" element={<ThreadList />} />
        <Route path="/thread/:threadId" element={<ThreadDetail />} />
        <Route
          path="/create"
          element={
            <CreateThread
              onSubmit={(data) => {
                console.log('Thread submitted:', data);
                // Add your submission logic here
              }}
            />
          }
        />
      </Routes>
    </ForumLayout>
  );
}