import { useState } from 'react';
import { VideoCard } from '../../components/video/VideoCard';
import { VideoFilters } from '../../components/video/VideoFilters';
import { Button } from '../../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

const fetchVideos = async () => {
  const { data, error } = await supabase.from('videos').select('*');
  if (error) throw error;
  return data;
};

export default function VideoLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const {
    data: videos = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['videos'],
    queryFn: fetchVideos,
  });

  if (isError) {
    console.error('❌ Failed to load videos:', error);
  }

  console.log('✅ Supabase videos:', videos);

  if (isLoading) return <div className="p-4 text-center text-gray-500">Loading videos...</div>;
  if (videos.length === 0) return <div className="p-4 text-center text-gray-500">No videos available yet.</div>;

  const filteredVideos = videos.filter(video => {
    const matchesSearch = 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            icon={ArrowLeft}
            className="mb-4"
          >
            Back to Home
          </Button>
          
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Video Library</h1>
          </div>
        </div>

        <VideoFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
}