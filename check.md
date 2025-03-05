// Base URL for the API
const BASE_URL = 'https://strtux-main.vercel.app';

// Utility function for API calls
const apiCall = async (endpoint, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === "Success") {
      return data.data;
    }
    throw new Error(data.message || 'API call failed');
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error);
    throw error;
  }
};

// 1. Search APIs
const searchAPI = {
  // Search for songs
  searchSongs: (query, page = 1, limit = 10) => 
    apiCall('/search/songs', { q: query, page, limit }),

  // Search for albums
  searchAlbums: (query, page = 1, limit = 10) => 
    apiCall('/search/albums', { q: query, page, limit }),

  // Search for artists
  searchArtists: (query, page = 1, limit = 10) => 
    apiCall('/search/artists', { q: query, page, limit }),

  // Search for playlists
  searchPlaylists: (query, page = 1, limit = 10) => 
    apiCall('/search/playlists', { q: query, page, limit }),

  // All-in-one search
  searchAll: (query) => 
    apiCall('/search/all', { q: query })
};

// 2. Songs APIs
const songAPI = {
  // Get song details by ID
  getSongDetails: (id) => 
    apiCall('/song', { id }),

  // Get song details by link
  getSongByLink: (link) => 
    apiCall('/song', { link }),

  // Get song recommendations
  getSongRecommendations: (id, limit = 10) => 
    apiCall('/song/recommend', { id, limit }),

  // Get song lyrics
  getLyrics: (id) => 
    apiCall('/lyrics', { id })
};

// 3. Album APIs
const albumAPI = {
  // Get album details by ID
  getAlbumDetails: (id) => 
    apiCall('/album', { id }),

  // Get album details by link
  getAlbumByLink: (link) => 
    apiCall('/album', { link })
};

// 4. Playlist APIs
const playlistAPI = {
  // Get playlist details by ID
  getPlaylistDetails: (id) => 
    apiCall('/playlist', { id }),

  // Get playlist details by link
  getPlaylistByLink: (link) => 
    apiCall('/playlist', { link })
};

// 5. Artist APIs
const artistAPI = {
  // Get artist details
  getArtistDetails: (id) => 
    apiCall('/artist', { id }),

  // Get artist songs
  getArtistSongs: (id, page = 1, limit = 10) => 
    apiCall('/artist/songs', { id, page, limit }),

  // Get artist albums
  getArtistAlbums: (id, page = 1, limit = 10) => 
    apiCall('/artist/albums', { id, page, limit })
};

// 6. Charts and Trending APIs
const chartsAPI = {
  // Get top charts
  getTopCharts: () => 
    apiCall('/charts'),

  // Get trending content
  getTrending: () => 
    apiCall('/trending'),

  // Get top artists
  getTopArtists: (lang = '', limit = 10) => 
    apiCall('/top-artists', { lang, limit }),

  // Get new releases
  getNewReleases: (lang = '', limit = 10) => 
    apiCall('/new-releases', { lang, limit })
};

// 7. Radio APIs
const radioAPI = {
  // Create featured radio
  createFeaturedRadio: (name) => 
    apiCall('/radio/featured', { name }),

  // Create artist radio
  createArtistRadio: (name, artistid) => 
    apiCall('/radio/artist', { name, artistid }),

  // Create entity radio
  createEntityRadio: (entity_id, entity_type) => 
    apiCall('/radio/entity', { entity_id, entity_type }),

  // Get radio songs
  getRadioSongs: (id) => 
    apiCall('/radio/songs', { id })
};

// Example usage in React components:

// 1. Search Component
function SearchComponent() {
  const [results, setResults] = useState([]);
  
  const handleSearch = async (query) => {
    try {
      const songs = await searchAPI.searchSongs(query);
      setResults(songs);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };
  
  return (/* Your JSX */);
}

// 2. Song Details Component
function SongDetails({ songId }) {
  const [song, setSong] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  
  useEffect(() => {
    const loadSongData = async () => {
      try {
        const [songData, recommendedSongs] = await Promise.all([
          songAPI.getSongDetails(songId),
          songAPI.getSongRecommendations(songId)
        ]);
        setSong(songData);
        setRecommendations(recommendedSongs);
      } catch (error) {
        console.error('Failed to load song data:', error);
      }
    };
    
    loadSongData();
  }, [songId]);
  
  return (/* Your JSX */);
}

// 3. Artist Profile Component
function ArtistProfile({ artistId }) {
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  
  useEffect(() => {
    const loadArtistData = async () => {
      try {
        const [artistData, artistSongs, artistAlbums] = await Promise.all([
          artistAPI.getArtistDetails(artistId),
          artistAPI.getArtistSongs(artistId),
          artistAPI.getArtistAlbums(artistId)
        ]);
        setArtist(artistData);
        setSongs(artistSongs);
        setAlbums(artistAlbums);
      } catch (error) {
        console.error('Failed to load artist data:', error);
      }
    };
    
    loadArtistData();
  }, [artistId]);
  
  return (/* Your JSX */);
}

// 4. Homepage Component with Charts
function Homepage() {
  const [charts, setCharts] = useState([]);
  const [trending, setTrending] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  
  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [chartsData, trendingData, releasesData] = await Promise.all([
          chartsAPI.getTopCharts(),
          chartsAPI.getTrending(),
          chartsAPI.getNewReleases()
        ]);
        setCharts(chartsData);
        setTrending(trendingData);
        setNewReleases(releasesData);
      } catch (error) {
        console.error('Failed to load home data:', error);
      }
    };
    
    loadHomeData();
  }, []);
  
  return (/* Your JSX */);
}

// 5. Radio Component
function RadioStation({ stationId }) {
  const [songs, setSongs] = useState([]);
  
  useEffect(() => {
    const loadRadioSongs = async () => {
      try {
        const radioSongs = await radioAPI.getRadioSongs(stationId);
        setSongs(radioSongs);
      } catch (error) {
        console.error('Failed to load radio songs:', error);
      }
    };
    
    loadRadioSongs();
  }, [stationId]);
  
  return (/* Your JSX */);
}