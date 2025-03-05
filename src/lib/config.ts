export const config = {
  urls: {
    baseUrl: "https://www.jiosaavn.com/api.php",
    docsUrl: "https://strtux-main.vercel.app/docs",
    siteUrl: process.env.BASE_URL || "http://localhost:3500",
  },

  rateLimit: {
    enable: process.env.ENABLE_RATE_LIMIT === "true" || false,
    limitedReqCount: +(process.env.LIMITED_REQ_COUNT || 5),
  },

  endpoint: {
    modules: {
      launch_data: "webapi.getLaunchData",
      browse_modules: "content.getBrowseModules",
    },

    song: {
      id: "song.getDetails",
      link: "webapi.get",
      recommend: "reco.getRecommendedSongs",
    },

    album: {
      id: "album.getDetails",
      link: "webapi.get",
      recommend: "reco.getRecommendedAlbums",
      same_year: "search.topAlbumsoftheYear",
    },

    playlist: {
      id: "playlist.getDetails",
      link: "webapi.get",
      recommend: "reco.getRecommendedPlaylists",
    },

    artist: {
      id: "content.getArtistDetails",
      link: "webapi.get",
      songs: "content.getArtistTopSongs",
      albums: "content.getArtistAlbums",
      top_songs: "content.getArtistTopSongs"
    },

    search: {
      top_search: "content.getTopSearches",
      all: "autocomplete.get",
      songs: "search.getResults",
      albums: "search.getAlbumResults",
      artists: "search.getArtistResults",
      playlists: "search.getPlaylistResults",
      more: "content.getMoreResults",
    },

    radio: {
      featured: "webradio.createFeaturedStation",
      artist: "webradio.createArtistStation",
      entity: "webradio.createEntityStation",
      songs: "webradio.getSongs",
    },

    show: {
      show_details: "show.getDetails",
      episodes: "show.getEpisodes",
      episode_details: "episode.getDetails",
    },

    get: {
      trending: "content.getTrending",
      featured_playlists: "content.getFeaturedPlaylists",
      charts: "content.getCharts",
      top_shows: "content.getTopShows",
      top_artists: "content.getTopArtists",
      top_albums: "content.getTopAlbums",
      mix_details: "playlist.getDetails",
      label_details: "label.getDetails",
      featured_stations: "webradio.getFeaturedStations",
      actor_top_songs: "search.artistOtherTopSongs",
      lyrics: "lyrics.getLyrics",
      footer_details: "content.getFooterDetails",
      mega_menu: "content.getMegaMenu",
    },
  },
};
