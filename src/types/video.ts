import React from 'react';



// Removed duplicate local declaration of VideoListProps
export interface VideoListProps {
  videos: Video[];
}
export interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  instructor: string;
}
// Removed duplicate declaration of Video