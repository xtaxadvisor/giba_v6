import React from 'react';
import type { Video, VideoListProps } from '../../types/video';

export default function VideoList({ videos }: VideoListProps) {
  if (videos.length === 0) {
    return (<p>No videos available.</p>);
  }

  return (
    <ul>
      {videos.map((v) => (
        <li key={v.id} className="mb-4">
          <h2 className="text-lg font-semibold">{v.title}</h2>
          <p>{v.description}</p>
          <p className="text-gray-500">{v.duration} - {v.instructor}</p>
        </li>
      ))}
    </ul>
  );
}