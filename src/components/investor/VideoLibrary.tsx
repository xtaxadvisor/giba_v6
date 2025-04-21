import React from 'react';

// Sample video data for the Investor Portal
export const investorvideos = [
  { id: 1, title: 'Investment Basics', url: 'https://example.com/video1' },
  { id: 2, title: 'Advanced Strategies', url: 'https://example.com/video2' },
];

// Props for the VideoLibrary component
export interface VideoLibraryProps {
  videos: { id: number; title: string; url: string }[];
}

// VideoLibrary renders a simple list of videos
export function VideoLibrary({ videos }: VideoLibraryProps) {
  return (
    <div>
      {videos.map((video) => (
        <div key={video.id} className="mb-4">
          <h3 className="text-lg font-medium">{video.title}</h3>
          <a href={video.url} className="text-blue-600 hover:underline">
            Watch Video
          </a>
        </div>
      ))}
    </div>
  );
}