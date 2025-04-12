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
    apiCall('/get/trending'),

  // Get top artists
  getTopArtists: (lang = '', limit = 10) => 
    apiCall('/get/top-artists', { lang, limit }),

  // Get new releases
  getNewReleases: (lang = '', limit = 10) => 
    apiCall('/get/new-releases', { lang, limit })
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

// ===================================================================
// DOWNLOAD URL IMPLEMENTATION GUIDE
// ===================================================================
/*
  PROBLEM:
  When using the API, sometimes the song download URLs aren't available directly 
  from endpoints like /album or when listing albums. This is because:
  
  1. Album endpoints only return metadata, not song streaming details
  2. The /song/:id endpoint doesn't always return high-quality download URLs
  3. For proper playback, we need the full download_url array with all quality options

  SOLUTION:
  Implement a robust solution with multiple fallback methods to reliably 
  get high-quality download URLs for any song.
*/

// 8. Download URL APIs - Special implementation to reliably get download URLs
const downloadAPI = {
  // Method 1: Using song name + artist name (Most reliable method)
  getURLsBySongAndArtist: async (songName, artistName) => {
    try {
      const query = `${songName} ${artistName}`.trim();
      const results = await apiCall('/search/songs', { q: query, limit: 1 });
      if (results?.results?.length > 0 && results.results[0].download_url) {
        return {
          source: 'song_artist_search',
          downloadUrls: results.results[0].download_url,
          songDetails: results.results[0]
        };
      }
      throw new Error('No results found');
    } catch (error) {
      console.warn('Method 1 failed:', error.message);
      return null;
    }
  },

  // Method 2: Using song name only
  getURLsBySongName: async (songName) => {
    try {
      const results = await apiCall('/search/songs', { q: songName, limit: 1 });
      if (results?.results?.length > 0 && results.results[0].download_url) {
        return {
          source: 'song_search',
          downloadUrls: results.results[0].download_url,
          songDetails: results.results[0]
        };
      }
      throw new Error('No results found');
    } catch (error) {
      console.warn('Method 2 failed:', error.message);
      return null;
    }
  },

  // Method 3: Using artist's top songs
  getURLsFromArtistTopSongs: async (artistId, songName) => {
    try {
      // Use artist/top-songs instead of artist/songs as it's more reliable for download URLs
      const songs = await apiCall('/artist/top-songs', { artist_id: artistId });
      
      // Find matching song
      const matchingSong = songs.find(song => 
        song.name.toLowerCase().includes(songName.toLowerCase())
      );
      
      if (matchingSong?.download_url) {
        return {
          source: 'artist_top_songs',
          downloadUrls: matchingSong.download_url,
          songDetails: matchingSong
        };
      }
      throw new Error('Song not found in artist top songs');
    } catch (error) {
      console.warn('Method 3 failed:', error.message);
      return null;
    }
  },

  // Method 4: Use trending songs endpoint (rarely needed fallback)
  getURLsFromTrending: async (songName) => {
    try {
      const trending = await apiCall('/get/trending');
      
      // Filter only songs, not albums
      const trendingSongs = trending.filter(item => item.type === 'song');
      
      // Find matching song
      const matchingSong = trendingSongs.find(song => 
        song.name.toLowerCase().includes(songName.toLowerCase())
      );
      
      if (matchingSong?.download_url) {
        return {
          source: 'trending',
          downloadUrls: matchingSong.download_url,
          songDetails: matchingSong
        };
      }
      throw new Error('Song not found in trending');
    } catch (error) {
      console.warn('Method 4 failed:', error.message);
      return null;
    }
  },

  // Main function that tries all methods with fallbacks
  getSongDownloadURLs: async (song, artist) => {
    try {
      // Extract necessary information
      const songName = song.name || '';
      const artistName = artist?.name || '';
      const artistId = artist?.id || '';
      
      console.log(`Fetching download URLs for "${songName}" by "${artistName}"`);
      
      // Try all methods in sequence until one succeeds
      const method1 = artistName ? await downloadAPI.getURLsBySongAndArtist(songName, artistName) : null;
      if (method1) return method1;
      
      const method2 = await downloadAPI.getURLsBySongName(songName);
      if (method2) return method2;
      
      const method3 = artistId ? await downloadAPI.getURLsFromArtistTopSongs(artistId, songName) : null;
      if (method3) return method3;
      
      const method4 = await downloadAPI.getURLsFromTrending(songName);
      if (method4) return method4;
      
      // If all methods fail
      console.error(`Failed to get download URLs for "${songName}"`);
      return null;
    } catch (error) {
      console.error('Error getting download URLs:', error);
      return null;
    }
  },

  // Get the best quality download URL from download_url array
  getBestQualityURL: (downloadUrls, preferredQuality = '320kbps') => {
    if (!Array.isArray(downloadUrls) || downloadUrls.length === 0) {
      return null;
    }
    
    // Try to find preferred quality
    const preferred = downloadUrls.find(url => url.quality === preferredQuality);
    if (preferred) {
      return preferred.link;
    }
    
    // Sort by quality (assuming format like "320kbps")
    const sortedUrls = [...downloadUrls].sort((a, b) => {
      const qualityA = parseInt(a.quality);
      const qualityB = parseInt(b.quality);
      return qualityB - qualityA; // Descending order
    });
    
    // Return highest available quality
    return sortedUrls[0].link;
  }
};

// 9. Music Player Implementation with reliable download URLs
class MusicPlayer {
  constructor() {
    this.audio = new Audio();
    this.currentSong = null;
    this.downloadUrls = null;
    this.queue = [];
    this.isPlaying = false;
    
    // Setup event listeners
    this.audio.addEventListener('ended', this.playNext.bind(this));
    this.audio.addEventListener('error', this.handleError.bind(this));
  }
  
  // Load and play a song
  async playSong(song, artist) {
    try {
      // Show loading state
      this.setLoadingState(true);
      
      // Get download URLs with fallback strategy
      const result = await downloadAPI.getSongDownloadURLs(song, artist);
      
      if (!result) {
        throw new Error(`Could not find playable version of "${song.name}"`);
      }
      
      // Store the download URLs and song details
      this.downloadUrls = result.downloadUrls;
      this.currentSong = result.songDetails;
      
      // Get the best quality URL
      const playUrl = downloadAPI.getBestQualityURL(this.downloadUrls);
      
      if (!playUrl) {
        throw new Error('No playable URL found');
      }
      
      // Set the source and play
      this.audio.src = playUrl;
      this.audio.play();
      this.isPlaying = true;
      
      // Update UI and store history
      this.updatePlayerUI();
      this.addToHistory(this.currentSong);
      
      console.log(`Now playing: "${this.currentSong.name}" - Quality: ${this.getPlayingQuality()}`);
      
      return true;
    } catch (error) {
      console.error('Error playing song:', error);
      this.handleError(error);
      return false;
    } finally {
      this.setLoadingState(false);
    }
  }
  
  // Get the quality of the currently playing song
  getPlayingQuality() {
    if (!this.audio.src || !this.downloadUrls) return 'unknown';
    
    const currentUrl = this.audio.src;
    const matchingQuality = this.downloadUrls.find(item => item.link === currentUrl);
    
    return matchingQuality ? matchingQuality.quality : 'unknown';
  }
  
  // Change the quality of the currently playing song
  changeQuality(quality) {
    if (!this.downloadUrls || !this.currentSong) return false;
    
    const qualityUrl = this.downloadUrls.find(item => item.quality === quality);
    if (!qualityUrl) return false;
    
    // Store current position
    const currentTime = this.audio.currentTime;
    const wasPlaying = !this.audio.paused;
    
    // Change source
    this.audio.src = qualityUrl.link;
    this.audio.currentTime = currentTime;
    
    // Resume if it was playing
    if (wasPlaying) {
      this.audio.play();
    }
    
    console.log(`Quality changed to: ${quality}`);
    return true;
  }
  
  // Add a song to the queue
  addToQueue(song, artist) {
    this.queue.push({ song, artist });
    return this.queue.length;
  }
  
  // Play the next song in the queue
  async playNext() {
    if (this.queue.length === 0) {
      this.isPlaying = false;
      return false;
    }
    
    const { song, artist } = this.queue.shift();
    return await this.playSong(song, artist);
  }
  
  // Pause playback
  pause() {
    this.audio.pause();
    this.isPlaying = false;
  }
  
  // Resume playback
  resume() {
    if (this.audio.src) {
      this.audio.play();
      this.isPlaying = true;
      return true;
    }
    return false;
  }
  
  // Toggle play/pause
  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.resume();
    }
    return this.isPlaying;
  }
  
  // Seek to a specific position (0-1)
  seek(position) {
    if (this.audio.duration) {
      this.audio.currentTime = this.audio.duration * position;
      return true;
    }
    return false;
  }
  
  // Set volume (0-1)
  setVolume(volume) {
    this.audio.volume = Math.max(0, Math.min(1, volume));
    return this.audio.volume;
  }
  
  // History management (simplified)
  addToHistory(song) {
    // Implementation depends on your storage preference
    console.log(`Added to history: "${song.name}"`);
  }
  
  // Set loading state - implement according to your UI
  setLoadingState(isLoading) {
    console.log(`Loading state: ${isLoading}`);
    // Update your UI loading indicators here
  }
  
  // Update player UI - implement according to your UI
  updatePlayerUI() {
    if (!this.currentSong) return;
    
    // Example updates, replace with your actual UI updates
    console.log('Updating UI with song details:', this.currentSong.name);
    // document.getElementById('songTitle').textContent = this.currentSong.name;
    // document.getElementById('artistName').textContent = this.currentSong.primaryArtists;
    // document.getElementById('albumArt').src = this.currentSong.image[2].link;
  }
  
  // Handle playback errors
  handleError(error) {
    console.error('Playback error:', error);
    // Implement your error handling UI updates here
    
    // Attempt to play the next song
    this.playNext();
  }
  
  // Get available qualities for current song
  getAvailableQualities() {
    if (!this.downloadUrls) return [];
    return this.downloadUrls.map(item => item.quality);
  }
  
  // Clean up resources
  destroy() {
    this.audio.pause();
    this.audio.src = '';
    this.audio.removeEventListener('ended', this.playNext);
    this.audio.removeEventListener('error', this.handleError);
  }
}

// 10. Example usage with React component
function MusicPlayerComponent() {
  const [player] = useState(() => new MusicPlayer());
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [availableQualities, setAvailableQualities] = useState([]);
  const [currentQuality, setCurrentQuality] = useState('');
  
  // Initialize and cleanup
  useEffect(() => {
    return () => {
      player.destroy();
    };
  }, [player]);
  
  // Example: When an album is clicked and we want to play its songs
  const handleAlbumClick = async (album) => {
    try {
      // First, get the album songs - but this won't have download URLs!
      const albumData = await albumAPI.getAlbumDetails(album.id);
      
      if (!albumData || !albumData.songs || albumData.songs.length === 0) {
        throw new Error('No songs found in this album');
      }
      
      // Find the main artist for the album
      const artist = {
        id: album.artist_map.primary_artists[0]?.id || '',
        name: album.artist_map.primary_artists[0]?.name || album.subtitle
      };
      
      // Get the first song
      const firstSong = albumData.songs[0];
      
      // Play the song - this will handle getting the proper download URLs
      const success = await player.playSong(firstSong, artist);
      
      if (success) {
        setCurrentSong(player.currentSong);
        setIsPlaying(player.isPlaying);
        setAvailableQualities(player.getAvailableQualities());
        setCurrentQuality(player.getPlayingQuality());
        
        // Add remaining songs to the queue
        albumData.songs.slice(1).forEach(song => {
          player.addToQueue(song, artist);
        });
      }
    } catch (error) {
      console.error('Failed to play album:', error);
      alert('Could not play this album. Please try another one.');
    }
  };
  
  // Example: Handle play button click
  const handlePlayPause = () => {
    const playing = player.togglePlayPause();
    setIsPlaying(playing);
  };
  
  // Example: Handle quality change
  const handleQualityChange = (quality) => {
    const success = player.changeQuality(quality);
    if (success) {
      setCurrentQuality(quality);
    }
  };
  
  return (/* Your JSX for music player UI */);
}

// ===================================================================
// STEP-BY-STEP IMPLEMENTATION GUIDE
// ===================================================================

/*
How to implement the download URL solution in your app:

1. ALBUM LISTINGS APPROACH
   ----------------------
   a) Display albums on your homepage using searchAPI.searchAlbums() or chartsAPI.getNewReleases()
   b) When a user clicks an album, get the album details using albumAPI.getAlbumDetails()
   c) For each song in the album, use downloadAPI.getSongDownloadURLs() to get proper download URLs
   
2. SEARCH RESULTS APPROACH
   ----------------------
   a) When users search for songs using searchAPI.searchSongs(), you already have download URLs
   b) Use these directly for playback with downloadAPI.getBestQualityURL()
   
3. ARTIST PAGE APPROACH
   -------------------
   a) Show artist info using artistAPI.getArtistDetails()
   b) For the artist's songs, use artistAPI.getArtistSongs() 
   c) Songs should already have download URLs, but if not, use downloadAPI.getSongDownloadURLs()

4. PLAYLISTS APPROACH
   -----------------
   a) Get playlist details using playlistAPI.getPlaylistDetails()
   b) Songs should have download URLs, but if not, use downloadAPI.getSongDownloadURLs()

5. CACHING STRATEGY (OPTIONAL)
   --------------------------
   a) Cache download URLs for recent songs to reduce API calls
   b) Implement a simple cache like:
   
   const urlCache = new Map();
   
   // Before making API calls, check cache
   const getCachedOrFetchURLs = async (song, artist) => {
     const cacheKey = `${song.id || song.name}`;
     if (urlCache.has(cacheKey)) {
       return urlCache.get(cacheKey);
     }
     
     const result = await downloadAPI.getSongDownloadURLs(song, artist);
     
     if (result) {
       urlCache.set(cacheKey, result);
       // Limit cache size
       if (urlCache.size > 100) {
         const firstKey = urlCache.keys().next().value;
         urlCache.delete(firstKey);
       }
     }
     
     return result;
   };
*/

// This complete implementation gives you a robust solution for getting
// high-quality download URLs for any song in multiple contexts.






A comprehensive download URL API section - This adds a specialized downloadAPI object with multiple fallback methods to reliably get download URLs for songs:
Method 1: Using song name + artist name search (most reliable)
Method 2: Using just song name search
Method 3: Using artist's top songs
Method 4: Checking trending songs (as a last resort)
A complete MusicPlayer class - This class manages:
Getting high-quality download URLs with fallbacks
Playback control (play, pause, seek, volume)
Queue management
Quality selection (switch between 320kbps, 160kbps, etc.)
Error handling with automatic retry
React component example - Shows how to integrate the player in a React app:
State management for player controls
Handling album click to play songs
Managing playback quality
UI updates
Step-by-step implementation guide - Clear instructions for:
Album listings approach
Search results approach
Artist page approach
Playlist approach
Caching strategy to improve performance
The implementation fixes your problem with albums not having download URLs by using the song search API to get the high-quality links when needed.