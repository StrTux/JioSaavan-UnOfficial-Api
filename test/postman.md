# JioSaavn API Postman Test Guide

Base URL: `http://localhost:3000` (or your deployed URL)

## Search APIs

### Search All
```http
GET /search?q=perfect
```

### Search Songs
```http
GET /search/songs?q=kesariya
```

### Search Albums
```http
GET /search/albums?q=arijit
```

### Search Playlists
```http
GET /search/playlists?q=workout
```

### Search Artists
```http
GET /search/artists?q=arijit
```

### Search Podcasts
```http
GET /search/podcasts?q=motivation
```

### Get Top Searches
```http
GET /search/top
```

## Optional Parameters
All search endpoints support these optional parameters:
- `page` or `p` - Page number (default: 1)
- `n` - Results per page
- `raw` - Get raw response (true/false)

Example with all parameters:
```http
GET /search/songs?q=kesariya&page=1&n=10&raw=false
```

## Song APIs

### Get Song Details
```http
GET /song?id=dZbr6LtY
```

### Get Song Lyrics
```http
GET /get/lyrics?id=dZbr6LtY
```

### Get Download URLs
```http
GET /download?id=5WXAlMNt
GET /download?id=5WXAlMNt&quality=320_KBPS
```

## Album APIs

### Get Album Details
```http
GET /album?id=1142502
```

### Get Album Recommendations
```http
GET /album/recommend?id=1142502
```

## Playlist APIs

### Get Playlist Details
```http
GET /playlist?id=159145156
```

### Get Playlist Recommendations
```http
GET /playlist/recommend?id=159145156
```

## Artist APIs

### Get Artist Details
```http
GET /artist?id=459320
```

### Get Artist Songs
```http
GET /artist/songs?id=459320
```

### Get Artist Albums
```http
GET /artist/albums?id=459320
```

## Language APIs

### Get Songs by Language
```http
GET /language/songs?lang=hindi
```

### Get Albums by Language
```http
GET /language/albums?lang=english
```

### Get Playlists by Language
```http
GET /language/playlists?lang=punjabi
```

## Genre APIs

### Get Songs by Genre
```http
GET /genre/songs?name=rock&lang=english
```

### Get Albums by Genre
```http
GET /genre/albums?name=classical&lang=hindi
```

### Get Playlists by Genre
```http
GET /genre/playlists?name=edm
```

## Trending APIs

### Get Trending by Category
```http
GET /trending/category/song?category=popularity&lang=hindi
GET /trending/category/album?category=latest
```

## Radio APIs

### Create Featured Radio
```http
GET /radio/featured?name=hindi_hits&lang=hindi
```

### Create Artist Radio
```http
GET /radio/artist?name=arijit&lang=hindi
```

### Get Radio Songs
```http
GET /radio/songs?id=123456
```

## Module APIs

### Get Home Modules
```http
GET /modules/home
```

### Get Charts
```http
GET /modules/charts
```

### Get Featured Playlists
```http
GET /modules/playlists?lang=hindi
```

## Common Response Format
All APIs return responses in this format:
```json
{
  "status": "Success",
  "message": "✅ Operation successful message",
  "data": {
    // Response data
  }
}
```

## Error Response Format
```json
{
  "status": "Failed",
  "message": "Error message",
  "data": null
}
``` 