import { decode } from "entities";
import { createImageLinks, parseBool } from "../lib/utils";
import { artistMiniPayload } from "./artist.payload";
import {
  PodcastRequest,
  PodcastResponse,
  PodcastEpisodeRequest,
  PodcastEpisodeResponse,
  PodcastCategoryRequest,
  PodcastCategoryResponse
} from "../types/podcast";

export function podcastPayload(p: PodcastRequest): PodcastResponse {
  const {
    id,
    title,
    subtitle,
    type,
    image,
    url,
    explicit_content,
    description,
    season_number,
    episode_count,
    release_date,
    language,
    category,
    artists,
    featured_artists,
    primary_artists
  } = p;

  return {
    id,
    name: decode(title),
    subtitle: decode(subtitle),
    type,
    image: createImageLinks(image),
    url,
    explicit: parseBool(explicit_content),
    description: decode(description),
    season: season_number,
    episodes: episode_count,
    release_date,
    language,
    category,
    artists: artists.map(artistMiniPayload),
    featured_artists: featured_artists.map(artistMiniPayload),
    primary_artists: primary_artists.map(artistMiniPayload)
  };
}

export function podcastEpisodePayload(e: PodcastEpisodeRequest): PodcastEpisodeResponse {
  const {
    id,
    title,
    description,
    duration,
    image,
    url,
    release_date,
    download_url
  } = e;

  return {
    id,
    title: decode(title),
    description: decode(description),
    duration,
    image: createImageLinks(image),
    url,
    release_date,
    download_url
  };
}

export function podcastCategoryPayload(c: PodcastCategoryRequest): PodcastCategoryResponse {
  const { name, description, podcasts } = c;

  return {
    name: decode(name),
    description: decode(description),
    podcasts: podcasts.map(podcastPayload)
  };
} 