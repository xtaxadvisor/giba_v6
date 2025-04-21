export interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  instructor: string;
}

export interface VideoListProps {
  videos: Video[];
}
// Define and export the VideoClass type


export interface VideoClass {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  tags: string[];
  category: string; 
  instructor: string;
  thumbnail: string; // Added thumbnail property
}