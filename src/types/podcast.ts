import { ArtistMiniRequest, ArtistMiniResponse } from "./artist";
import { Quality } from "./misc";

export interface PodcastRequest {
  id: string;
  title: string;
  subtitle: string;
  type: "podcast";
  image: string;
  url: string;
  explicit_content: string;
  description: string;
  season_number: number;
  episode_count: number;
  release_date: string;
  language: string;
  category: string;
  artists: ArtistMiniRequest[];
  featured_artists: ArtistMiniRequest[];
  primary_artists: ArtistMiniRequest[];
}

export interface PodcastResponse {
  id: string;
  name: string;
  subtitle: string;
  type: "podcast";
  image: Quality;
  url: string;
  explicit: boolean;
  description: string;
  season: number;
  episodes: number;
  release_date: string;
  language: string;
  category: string;
  artists: ArtistMiniResponse[];
  featured_artists: ArtistMiniResponse[];
  primary_artists: ArtistMiniResponse[];
}

export interface PodcastEpisodeRequest {
  id: string;
  title: string;
  description: string;
  duration: string;
  image: string;
  url: string;
  release_date: string;
  download_url: {
    quality: string;
    link: string;
  }[];
}

export interface PodcastEpisodeResponse {
  id: string;
  title: string;
  description: string;
  duration: string;
  image: Quality;
  url: string;
  release_date: string;
  download_url: {
    quality: string;
    link: string;
  }[];
}

export interface PodcastCategoryRequest {
  name: string;
  description: string;
  podcasts: PodcastRequest[];
}

export interface PodcastCategoryResponse {
  name: string;
  description: string;
  podcasts: PodcastResponse[];
} 