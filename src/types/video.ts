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