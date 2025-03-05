import { ArtistMapRequest } from "./artist";
import { MiniResponse, Type, Quality, Rights } from "./misc";
import { CustomResponse } from "./response";
import { ArtistMapResponse } from "./artist";

/* -----------------------------------------------------------------------------------------------
 * Request
 * -----------------------------------------------------------------------------------------------*/

export type SongObjRequest = {
  songs: SongRequest[];
  modules?: SongModulesRequest;
};

export type SongRequest = {
  id: string;
  title: string;
  subtitle: string;
  header_desc: string;
  type: "song";
  perma_url: string;
  image: string;
  language: string;
  year: string;
  play_count: string | number;
  explicit_content: string;
  list_count: string;
  list_type: string;
  list: string;
  more_info: {
    music: string;
    song?: string;
    album_id: string;
    album: string;
    label: string;
    origin: string;
    is_dolby_content: boolean;
    "320kbps": string;
    encrypted_media_url: string;
    encrypted_cache_url: string;
    album_url: string;
    duration: string;
    rights: Rights;
    cache_state: string;
    has_lyrics: string;
    lyrics_snippet: string;
    starred: string;
    copyright_text: string;
    artistMap: ArtistMapRequest;
    release_date?: string;
    label_url: string;
    vcode: string;
    vlink: string;
    triller_available: boolean;
    request_jiotune_flag: boolean;
    webp: string;
    lyrics_id: string;
  };
};

export type SongModulesRequest = {
  reco: {
    title: string;
    subtitle: string;
    source: string;
    position: number;
    source_params: {
      pid: string;
      language: string;
    };
  };
  currentlyTrending: {
    title: string;
    subtitle: string;
    source: string;
    position: number;
    source_params: {
      entity_type: string;
      entity_language: string;
    };
  };
  songsBysameArtists: {
    title: string;
    subtitle: string;
    source: string;
    position: number;
    source_params: {
      artist_ids: string;
      song_id: string;
      language: string;
    };
  };
  songsBysameActors: {
    title: string;
    subtitle: string;
    source: string;
    position: number;
    source_params: {
      actor_ids: string;
      song_id: string;
      language: string;
    };
  };
  artists: {
    title: string;
    subtitle: string;
    source: string;
    position: number;
  };
};

/* -----------------------------------------------------------------------------------------------
 * Response
 * -----------------------------------------------------------------------------------------------*/

export type SongObjResponse = {
  songs: (SongResponse | MiniResponse)[];
  modules?: SongModulesResponse;
};

export interface SongDetails {
  id: string;
  name: string;
  album?: {
    id: string;
    name: string;
    url: string;
  };
  year?: string;
  releaseDate?: string;
  duration?: string;
  language?: string;
  downloadUrl?: string[];
  streamingUrl?: string;
  image?: string[];
  primaryArtists?: string;
  singers?: string[];
  artists?: Array<{
    id?: string;
    name: string;
    url?: string;
  }>;
  lyrics?: string;
  hasLyrics?: boolean;
  copyright?: string;
  label?: string;
}

export interface SongResponse {
  id: string;
  name: string;
  subtitle: string;
  type: Type;
  url: string;
  image: Quality;
  language?: string;
  year?: string | number;
  header_desc?: string;
  play_count?: string | number;
  explicit?: boolean;
  list?: string;
  list_type?: string;
  list_count?: number;
  music?: string;
  artist_map?: ArtistMapResponse;
  song?: string;
  album?: {
    id: string;
    name: string;
    url: string;
  };
  album_id?: string;
  album_url?: string;
  label?: string;
  label_url?: string;
  origin?: string;
  is_dolby_content?: boolean;
  "320kbps"?: boolean;
  download_url?: Quality;
  duration?: number;
  rights?: Rights;
  has_lyrics?: boolean;
  lyrics_id?: string;
  lyrics_snippet?: string;
  starred?: boolean;
  release_date?: string;
  triller_available?: boolean;
  copyright_text?: string;
  vcode?: string;
  vlink?: string;
  primary_artists?: string;
  singers?: string[];
  artists?: Array<{
    id?: string;
    name: string;
    url?: string;
  }>;
}

export type SongModulesResponse = {
  recommend: {
    title: string;
    subtitle: string;
    source: string;
    position: number;
    params: {
      id: string;
      lang: string;
    };
  };
  currently_trending: {
    title: string;
    subtitle: string;
    source: string;
    position: number;
    params: {
      type: string;
      lang: string;
    };
  };
  songs_by_same_artists: {
    title: string;
    subtitle: string;
    source: string;
    position: number;
    params: {
      artist_id: string;
      song_id: string;
      lang: string;
    };
  };
  songs_by_same_actors: {
    title: string;
    subtitle: string;
    source: string;
    position: number;
    params: {
      actor_id: string;
      song_id: string;
      lang: string;
    };
  };
  artists: {
    title: string;
    subtitle: string;
    source: string;
    position: number;
  };
};

/* -----------------------------------------------------------------------------------------------
 * Song Custom Response(s)
 * -----------------------------------------------------------------------------------------------*/

export type CSongResponse = CustomResponse<SongObjResponse>;

export type CSongsResponse = CustomResponse<(SongResponse | MiniResponse)[]>;
