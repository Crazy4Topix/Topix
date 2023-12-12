export interface PodcastInfo {
  timestamp: number;
  news: string;
  source: string;
  thumbnail: string;
}

export interface DailyPodcast {
  podcastLink: string;
  podcastInfo: PodcastInfo[];
}
