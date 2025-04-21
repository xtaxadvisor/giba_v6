import React from 'react';
import { useParams } from 'react-router-dom';

export interface VideoPlayerProps {
  videoUrl?: string;
}

export default function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  const { id } = useParams<{ id: string }>();
  const src = videoUrl || `/api/videos/${id}`; // adjust endpoint as needed

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <video
        src={src}
        controls
        className="max-w-full max-h-full"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}