# JioSaavn UnOfficial API Documentation

Base URL: `https://your-api-base-url.com`

## Table of Contents
- [Common Parameters](#common-parameters)
- [Search](#search)
  - [Search All](#search-all)
  - [Search Songs](#search-songs)
  - [Search Albums](#search-albums)
  - [Search Artists](#search-artists)
  - [Search Playlists](#search-playlists)
  - [Search Podcasts](#search-podcasts)
  - [Top Searches](#top-searches)
- [Songs](#songs)
  - [Get Song Details](#get-song-details)
  - [Get Song Lyrics](#get-song-lyrics)
  - [Get Download URLs](#get-download-urls)
- [Albums](#albums)
  - [Get Album Details](#get-album-details)
  - [Get Album Recommendations](#get-album-recommendations)
- [Playlists](#playlists)
  - [Get Playlist Details](#get-playlist-details)
  - [Get Playlist Recommendations](#get-playlist-recommendations)
- [Artists](#artists)
  - [Get Artist Details](#get-artist-details)
  - [Get Artist Songs](#get-artist-songs)
  - [Get Artist Albums](#get-artist-albums)
- [Language](#language)
  - [Get Songs by Language](#get-songs-by-language)
  - [Get Albums by Language](#get-albums-by-language)
  - [Get Playlists by Language](#get-playlists-by-language)
- [Genre](#genre)
  - [Get Songs by Genre](#get-songs-by-genre)
  - [Get Albums by Genre](#get-albums-by-genre)
  - [Get Playlists by Genre](#get-playlists-by-genre)
- [Trending](#trending)
  - [Get Trending by Category](#get-trending-by-category)
- [Radio](#radio)
  - [Create Featured Radio](#create-featured-radio)
  - [Create Artist Radio](#create-artist-radio)
  - [Get Radio Songs](#get-radio-songs)
- [Modules](#modules)
  - [Get Home Modules](#get-home-modules)
  - [Get Charts](#get-charts)
  - [Get Featured Playlists](#get-featured-playlists)

## Common Parameters

These parameters are available for most endpoints:

- `raw` (optional): When true, returns the raw JioSaavn API response
- `page` or `p` (optional): Page number for pagination (default: 1)
- `n` (optional): Number of results per page (default varies by endpoint)
- `lang` (optional): Filter by language(s), comma-separated (e.g., 'hindi,english')

## Search

### Search All
```http
GET /search
```

Query Parameters:
- `q` (required): Search term

Example:
```http
GET /search?q=perfect
```

### Search Songs
```http
GET /search/songs
```

Query Parameters:
- `q` (required): Search term
- `page` or `p` (optional): Page number
- `n` (optional): Results per page

Example:
```http
GET /search/songs?q=kesariya&page=1&n=10
```

### Search Albums
```http
GET /search/albums
```

Query Parameters:
- `q` (required): Search term
- `page` or `p` (optional): Page number
- `n` (optional): Results per page

Example:
```http
GET /search/albums?q=arijit&page=1&n=10
```

### Search Artists
```http
GET /search/artists
```

Query Parameters:
- `q` (required): Search term
- `page` or `p` (optional): Page number
- `n` (optional): Results per page

Example:
```http
GET /search/artists?q=arijit&page=1&n=10
```

### Search Playlists
```http
GET /search/playlists
```

Query Parameters:
- `q` (required): Search term
- `page` or `p` (optional): Page number
- `n` (optional): Results per page

Example:
```http
GET /search/playlists?q=workout&page=1&n=10
```

### Search Podcasts
```http
GET /search/podcasts
```

Query Parameters:
- `q` (required): Search term
- `page` or `p` (optional): Page number
- `n` (optional): Results per page

Example:
```http
GET /search/podcasts?q=motivation&page=1&n=10
```

### Top Searches
```http
GET /search/top
```

Example:
```http
GET /search/top
```

## Songs

### Get Song Details
```http
GET /song
```

Query Parameters:
- `id` (required): Song ID

Example:
```http
GET /song?id=dZbr6LtY
```

### Get Song Lyrics
```http
GET /get/lyrics
```

Query Parameters:
- `id` (required): Song ID

Example:
```http
GET /get/lyrics?id=dZbr6LtY
```

### Get Download URLs
```http
GET /download
```

Query Parameters:
- `id` (required): Song ID
- `quality` (optional): Specific quality to return ('96_KBPS', '160_KBPS', '320_KBPS')

Example:
```http
GET /download?id=5WXAlMNt
GET /download?id=5WXAlMNt&quality=320_KBPS
```

## Albums

### Get Album Details
```http
GET /album
```

Query Parameters:
- `id` (required): Album ID

Example:
```http
GET /album?id=1142502
```

### Get Album Recommendations
```http
GET /album/recommend
```

Query Parameters:
- `id` (required): Album ID

Example:
```http
GET /album/recommend?id=1142502
```

## Playlists

### Get Playlist Details
```http
GET /playlist
```

Query Parameters:
- `id` (required): Playlist ID

Example:
```http
GET /playlist?id=159145156
```

### Get Playlist Recommendations
```http
GET /playlist/recommend
```

Query Parameters:
- `id` (required): Playlist ID

Example:
```http
GET /playlist/recommend?id=159145156
```

## Artists

### Get Artist Details
```http
GET /artist
```

Query Parameters:
- `id` (required): Artist ID

Example:
```http
GET /artist?id=459320
```

### Get Artist Songs
```http
GET /artist/songs
```

Query Parameters:
- `id` (required): Artist ID

Example:
```http
GET /artist/songs?id=459320
```

### Get Artist Albums
```http
GET /artist/albums
```

Query Parameters:
- `id` (required): Artist ID

Example:
```http
GET /artist/albums?id=459320
```

## Language

### Get Songs by Language
```http
GET /language/songs
```

Query Parameters:
- `lang` (required): Language code (e.g., 'hindi', 'english')
- `page` or `p` (optional): Page number
- `n` (optional): Results per page

Example:
```http
GET /language/songs?lang=hindi&page=1&n=20
```

### Get Albums by Language
```http
GET /language/albums
```

Query Parameters:
- `lang` (required): Language code
- `page` or `p` (optional): Page number
- `n` (optional): Results per page

Example:
```http
GET /language/albums?lang=english&page=1&n=20
```

### Get Playlists by Language
```http
GET /language/playlists
```

Query Parameters:
- `lang` (required): Language code
- `page` or `p` (optional): Page number
- `n` (optional): Results per page

Example:
```http
GET /language/playlists?lang=punjabi&page=1&n=20
```

## Genre

### Get Songs by Genre
```http
GET /genre/songs
```

Query Parameters:
- `name` (required): Genre name (e.g., 'rock', 'pop')
- `lang` (optional): Language filter
- `page` or `p` (optional): Page number
- `n` (optional): Results per page

Example:
```http
GET /genre/songs?name=rock&lang=english&page=1&n=20
```

### Get Albums by Genre
```http
GET /genre/albums
```

Query Parameters:
- `name` (required): Genre name
- `lang` (optional): Language filter
- `page` or `p` (optional): Page number
- `n` (optional): Results per page

Example:
```http
GET /genre/albums?name=classical&lang=hindi&page=1&n=20
```

### Get Playlists by Genre
```http
GET /genre/playlists
```

Query Parameters:
- `name` (required): Genre name
- `lang` (optional): Language filter
- `page` or `p` (optional): Page number
- `n` (optional): Results per page

Example:
```http
GET /genre/playlists?name=edm&page=1&n=20
```

## Trending

### Get Trending by Category
```http
GET /trending/category/:type
```

Parameters:
- `type` (required): Content type ('song', 'album', 'playlist')

Query Parameters:
- `category` (optional): Sort category ('popularity', 'latest', 'alphabetical')
- `lang` (optional): Language filter
- `page` or `p` (optional): Page number
- `n` (optional): Results per page

Example:
```http
GET /trending/category/song?category=popularity&lang=hindi
GET /trending/category/album?category=latest
```

## Radio

### Create Featured Radio
```http
GET /radio/featured
```

Query Parameters:
- `name` (required): Radio station name
- `lang` (required): Language code

Example:
```http
GET /radio/featured?name=hindi_hits&lang=hindi
```

### Create Artist Radio
```http
GET /radio/artist
```

Query Parameters:
- `name` (required): Artist name
- `lang` (required): Language code

Example:
```http
GET /radio/artist?name=arijit&lang=hindi
```

### Get Radio Songs
```http
GET /radio/songs
```

Query Parameters:
- `id` (required): Radio station ID

Example:
```http
GET /radio/songs?id=123456
```

## Modules

### Get Home Modules
```http
GET /modules/home
```

Example:
```http
GET /modules/home
```

### Get Charts
```http
GET /modules/charts
```

Example:
```http
GET /modules/charts
```

### Get Featured Playlists
```http
GET /modules/playlists
```

Query Parameters:
- `lang` (optional): Language filter
- `page` or `p` (optional): Page number
- `n` (optional): Results per page

Example:
```http
GET /modules/playlists?lang=hindi&page=1&n=10
```

## Response Format

All API endpoints return JSON responses in the following format:

```json
{
  "status": "Success",
  "message": "✅ Operation successful message",
  "data": {
    // Response data here
  }
}
```

## Error Response Format

In case of errors, the API returns:

```json
{
  "status": "Failed",
  "message": "Error message",
  "data": null
}
```

## Rate Limiting

The API implements rate limiting to ensure fair usage:
- 100 requests per minute per IP
- Rate limit headers are included in responses

## Development and Support

For bug reports and feature requests, please open an issue on our GitHub repository.

For more information about contributing, please see our [Contributing Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



