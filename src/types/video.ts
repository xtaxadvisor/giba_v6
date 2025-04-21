import React from 'react';

interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  instructor: string;
}

interface VideoListProps {
  videos: Video[];
}

export default function VideoList({ videos }: VideoListProps) {
 return (   
  <div className="video-list">  
    {videos.map((video: Video) => (
      <div key={video.id} className="video-item">
        <h3>{video.title}</h3>
        <p>{video.description}</p>
        <p>Duration: {video.duration}</p>
        <p>Instructor: {video.instructor}</p>
      </div>
    ))}
  </div>
 );
}
// This component can be used to display a list of videos in a video library or similar context.