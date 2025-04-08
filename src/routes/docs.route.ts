import { Hono } from "hono";
import { config } from "../lib/config";

const docs = new Hono();

// Handle root route - serve HTML documentation
docs.get("/", async (c) => {
  return c.html(generateDocsHtml());
});

// Handle JSON documentation
docs.get("/json", async (c) => {
  return c.json({
    status: "Success",
    message: "JioSaavn API Documentation",
    data: {
      version: "1.0.0",
      baseUrl: process.env.BASE_URL || "http://localhost:3500",
      endpoints: {
        search: {
          all: "GET /search?q={query}",
          songs: "GET /search/songs?q={query}&page={page}&n={limit}&language={lang}",
          albums: "GET /search/albums?q={query}&page={page}&n={limit}&language={lang}",
          playlists: "GET /search/playlists?q={query}&page={page}&n={limit}&language={lang}",
          artists: "GET /search/artists?q={query}&page={page}&n={limit}&language={lang}",
          top: "GET /search/top"
        },
        songs: {
          details: "GET /song?id={id}",
          link: "GET /song?link={jiosaavn_url}",
          recommend: "GET /song/recommend?id={id}&language={lang}&limit={limit}"
        },
        albums: {
          details: "GET /album?id={id}",
          link: "GET /album?link={jiosaavn_url}",
          recommend: "GET /album/recommend?id={id}"
        },
        playlists: {
          details: "GET /playlist?id={id}",
          link: "GET /playlist?link={jiosaavn_url}",
          recommend: "GET /playlist/recommend?id={id}"
        },
        artists: {
          details: "GET /artist?id={id}",
          link: "GET /artist?link={jiosaavn_url}",
          songs: "GET /artist/songs?id={id}&page={page}&n={limit}",
          albums: "GET /artist/albums?id={id}&page={page}&n={limit}",
          top_songs: "GET /artist/top-songs?artist_id={id}&song_id={song_id}&language={lang}"
        },
        radio: {
          featured: "GET /radio/featured?name={name}",
          artist: "GET /radio/artist?name={name}",
          entity: "GET /radio/entity?id={id}&type={type}",
          songs: "GET /radio/songs?station_id={id}"
        },
        get: {
          trending: "GET /get/trending?type={type}&lang={lang}",
          featured_playlists: "GET /get/featured-playlists?language={lang}&page={page}&n={limit}",
          charts: "GET /get/charts?language={lang}&page={page}&n={limit}",
          top_shows: "GET /get/top-shows?language={lang}&page={page}&n={limit}",
          top_artists: "GET /get/top-artists?language={lang}&page={page}&n={limit}",
          top_albums: "GET /get/top-albums?language={lang}&page={page}&n={limit}",
          featured_stations: "GET /get/featured-stations",
          lyrics: "GET /get/lyrics?id={id}",
          mix: "GET /get/mix?token={token}&link={jiosaavn_url}&page={page}&n={limit}&language={lang}",
          label: "GET /get/label?token={token}&link={jiosaavn_url}&page={page}&n_song={song_limit}&n_album={album_limit}&category={category}&sort={sort}&language={lang}",
          mega_menu: "GET /get/mega-menu?entity={is_entity}&language={lang}"
        }
      },
      parameters: {
        quality: ["12kbps", "48kbps", "96kbps", "160kbps", "320kbps"],
        languages: [
          "hindi", "english", "punjabi", "tamil", "telugu", "marathi", 
          "gujarati", "bengali", "kannada", "bhojpuri", "malayalam", 
          "urdu", "haryanvi", "rajasthani", "odia", "assamese"
        ]
      },
      github: "https://github.com/StrTux/JioSaavan-UnOfficial-Api"
    }
  });
});

function generateDocsHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JioSaavn UnOfficial API Documentation</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', sans-serif;
        }

        :root {
            --primary-color: #6800c7;
            --secondary-color: #9333ea;
            --bg-color: #f8fafc;
            --text-color: #1e293b;
            --border-color: #e2e8f0;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-color);
            line-height: 1.6;
        }

        .navbar {
            background: white;
            padding: 1rem 2rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 100;
        }

        .nav-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary-color);
            text-decoration: none;
        }

        .nav-links a {
            color: var(--text-color);
            text-decoration: none;
            margin-left: 2rem;
            font-weight: 500;
        }

        .nav-links a:hover {
            color: var(--primary-color);
        }

        .main-container {
            max-width: 1200px;
            margin: 80px auto 0;
            padding: 2rem;
            display: grid;
            grid-template-columns: 250px 1fr;
            gap: 2rem;
        }

        .sidebar {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            position: sticky;
            top: 100px;
            height: fit-content;
        }

        .sidebar-title {
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #64748b;
            margin-bottom: 1rem;
        }

        .sidebar-links {
            list-style: none;
        }

        .sidebar-links li {
            margin-bottom: 0.75rem;
        }

        .sidebar-links a {
            color: var(--text-color);
            text-decoration: none;
            font-size: 0.9375rem;
            display: flex;
            align-items: center;
            padding: 0.5rem;
            border-radius: 6px;
            transition: all 0.2s;
        }

        .sidebar-links a:hover {
            background: #f1f5f9;
            color: var(--primary-color);
        }

        .sidebar-links i {
            margin-right: 0.75rem;
            width: 20px;
            text-align: center;
        }

        .content {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .section {
            margin-bottom: 3rem;
        }

        .section:last-child {
            margin-bottom: 0;
        }

        h1 {
            font-size: 2.25rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: var(--primary-color);
        }

        h2 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid var(--border-color);
        }

        .endpoint {
            background: #f8fafc;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .endpoint-header {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
        }

        .method {
            padding: 0.25rem 0.75rem;
            border-radius: 4px;
            font-weight: 600;
            font-size: 0.875rem;
            margin-right: 1rem;
        }

        .get { background: #dbeafe; color: #1e40af; }
        .post { background: #dcfce7; color: #166534; }

        .endpoint-url {
            font-family: 'SFMono-Regular', Consolas, monospace;
            color: #475569;
        }

        .params-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
        }

        .params-table th,
        .params-table td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }

        .params-table th {
            background: #f8fafc;
            font-weight: 600;
        }

        code {
            background: #f1f5f9;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-family: 'SFMono-Regular', Consolas, monospace;
            font-size: 0.875rem;
        }

        .response-example {
            background: #1e293b;
            color: #e2e8f0;
            padding: 1rem;
            border-radius: 6px;
            overflow-x: auto;
        }

        @media (max-width: 768px) {
            .main-container {
                grid-template-columns: 1fr;
            }

            .sidebar {
                position: static;
                margin-bottom: 2rem;
            }

            .nav-links {
                display: none;
            }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-content">
            <a href="/" class="logo">JioSaavn API</a>
            <div class="nav-links">
                <a href="https://github.com/StrTux/JioSaavan-UnOfficial-Api" target="_blank">
                    <i class="fab fa-github"></i> GitHub
                </a>
                <a href="/">Home</a>
            </div>
        </div>
    </nav>

    <div class="main-container">
        <aside class="sidebar">
            <h3 class="sidebar-title">API Reference</h3>
            <ul class="sidebar-links">
                <li><a href="#getting-started"><i class="fas fa-rocket"></i>Getting Started</a></li>
                <li><a href="#authentication"><i class="fas fa-key"></i>Authentication</a></li>
                <li><a href="#search"><i class="fas fa-search"></i>Search API</a></li>
                <li><a href="#songs"><i class="fas fa-music"></i>Songs API</a></li>
                <li><a href="#albums"><i class="fas fa-compact-disc"></i>Albums API</a></li>
                <li><a href="#playlists"><i class="fas fa-list"></i>Playlists API</a></li>
                <li><a href="#artists"><i class="fas fa-user"></i>Artists API</a></li>
                <li><a href="#lyrics"><i class="fas fa-microphone"></i>Lyrics API</a></li>
                <li><a href="#download"><i class="fas fa-download"></i>Download API</a></li>
                <li><a href="#radio"><i class="fas fa-broadcast-tower"></i>Radio API</a></li>
                <li><a href="#trending"><i class="fas fa-chart-line"></i>Trending</a></li>
            </ul>
        </aside>

        <main class="content">
            <section id="getting-started" class="section">
                <h1>JioSaavn API Documentation</h1>
                <p>Welcome to the JioSaavn Unofficial API documentation. This API provides access to JioSaavn's vast music library, including songs, albums, playlists, and more.</p>
                
                <h2>Base URL</h2>
                <code>${config.urls.siteUrl}</code>

                <h2>Rate Limiting</h2>
                <p>To ensure fair usage, the API implements rate limiting. Each IP address is limited to:</p>
                <ul>
                    <li>100 requests per minute</li>
                    <li>1000 requests per hour</li>
                </ul>
                <p>If you exceed these limits, you'll receive a 429 Too Many Requests response.</p>

                <h2>Response Format</h2>
                <p>All API responses follow this standard format:</p>
                <pre class="response-example">
{
    "status": "SUCCESS" | "FAILED",
    "message": "Optional status message",
    "data": { ... }  // The actual response data
}</pre>
            </section>

            <section id="authentication" class="section">
                <h2>Authentication</h2>
                <p>This API is currently open and does not require authentication. However, please respect the rate limits and use the API responsibly.</p>
            </section>

            <section id="search" class="section">
                <h2>Search API</h2>
                
                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="endpoint-url">/search?q={query}</span>
                    </div>
                    <p>Search for songs, albums, artists, or playlists</p>
                    
                    <h3>Parameters</h3>
                    <table class="params-table">
                        <tr>
                            <th>Parameter</th>
                            <th>Type</th>
                            <th>Description</th>
                        </tr>
                        <tr>
                            <td>q</td>
                            <td>string</td>
                            <td>Search query (required)</td>
                        </tr>
                        <tr>
                            <td>type</td>
                            <td>string</td>
                            <td>Filter results by type: all, songs, albums, artists, playlists (optional, defaults to all)</td>
                        </tr>
                        <tr>
                            <td>limit</td>
                            <td>number</td>
                            <td>Number of results to return (optional, defaults to 10, max 50)</td>
                        </tr>
                    </table>

                    <h3>Response Example</h3>
                    <pre class="response-example">
{
    "status": "SUCCESS",
    "data": {
        "songs": [
            {
                "id": "abc123",
                "name": "Song Name",
                "album": "Album Name",
                "year": "2024",
                "duration": "4:30",
                "primaryArtists": "Artist Name",
                "image": "https://...",
                "downloadUrl": "https://..."
            }
        ],
        "albums": [...],
        "artists": [...],
        "playlists": [...]
    }
}</pre>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="endpoint-url">/search/songs?q={query}</span>
                    </div>
                    <p>Search for songs only</p>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="endpoint-url">/search/albums?q={query}</span>
                    </div>
                    <p>Search for albums only</p>
                </div>
            </section>

            <section id="songs" class="section">
                <h2>Songs API</h2>
                
                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="endpoint-url">/song?id={id}</span>
                    </div>
                    <p>Get details of a specific song</p>
                    
                    <h3>Parameters</h3>
                    <table class="params-table">
                        <tr>
                            <th>Parameter</th>
                            <th>Type</th>
                            <th>Description</th>
                        </tr>
                        <tr>
                            <td>id</td>
                            <td>string</td>
                            <td>Song ID (required)</td>
                        </tr>
                    </table>

                    <h3>Response Example</h3>
                    <pre class="response-example">
{
    "status": "SUCCESS",
    "data": {
        "id": "abc123",
        "name": "Song Name",
        "album": {
            "id": "album123",
            "name": "Album Name",
            "url": "https://..."
        },
        "year": "2024",
        "duration": "4:30",
        "language": "hindi",
        "primaryArtists": [
            {
                "id": "artist123",
                "name": "Artist Name",
                "url": "https://..."
            }
        ],
        "featuredArtists": [],
        "downloadUrl": {
            "quality_96": "https://...",
            "quality_160": "https://...",
            "quality_320": "https://..."
        },
        "image": {
            "quality_50x50": "https://...",
            "quality_150x150": "https://...",
            "quality_500x500": "https://..."
        }
    }
}</pre>
                </div>
            </section>

            <section id="albums" class="section">
                <h2>Albums API</h2>
                
                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="endpoint-url">/album?id={id}</span>
                    </div>
                    <p>Get details of a specific album including all songs</p>
                    
                    <h3>Parameters</h3>
                    <table class="params-table">
                        <tr>
                            <th>Parameter</th>
                            <th>Type</th>
                            <th>Description</th>
                        </tr>
                        <tr>
                            <td>id</td>
                            <td>string</td>
                            <td>Album ID (required)</td>
                        </tr>
                    </table>

                    <h3>Response Example</h3>
                    <pre class="response-example">
{
    "status": "SUCCESS",
    "data": {
        "id": "album123",
        "name": "Album Name",
        "year": "2024",
        "primaryArtists": ["Artist 1", "Artist 2"],
        "songCount": 12,
        "image": {
            "quality_50x50": "https://...",
            "quality_150x150": "https://...",
            "quality_500x500": "https://..."
        },
        "songs": [
            {
                "id": "song123",
                "name": "Song Name",
                "duration": "4:30",
                "downloadUrl": {
                    "quality_96": "https://...",
                    "quality_160": "https://...",
                    "quality_320": "https://..."
                }
            }
        ]
    }
}</pre>
                </div>
            </section>

            <section id="playlists" class="section">
                <h2>Playlists API</h2>
                
                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="endpoint-url">/playlist?id={id}</span>
                    </div>
                    <p>Get details of a specific playlist including all songs</p>
                    
                    <h3>Parameters</h3>
                    <table class="params-table">
                        <tr>
                            <th>Parameter</th>
                            <th>Type</th>
                            <th>Description</th>
                        </tr>
                        <tr>
                            <td>id</td>
                            <td>string</td>
                            <td>Playlist ID (required)</td>
                        </tr>
                    </table>

                    <h3>Response Example</h3>
                    <pre class="response-example">
{
    "status": "SUCCESS",
    "data": {
        "id": "playlist123",
        "name": "Playlist Name",
        "description": "Playlist Description",
        "songCount": 25,
        "fanCount": 1000,
        "image": "https://...",
        "songs": [
            {
                "id": "song123",
                "name": "Song Name",
                "album": "Album Name",
                "artists": ["Artist 1", "Artist 2"],
                "duration": "4:30",
                "downloadUrl": {
                    "quality_96": "https://...",
                    "quality_160": "https://...",
                    "quality_320": "https://..."
                }
            }
        ]
    }
}</pre>
                </div>
            </section>

            <section id="artists" class="section">
                <h2>Artists API</h2>
                
                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="endpoint-url">/artist?id={id}</span>
                    </div>
                    <p>Get artist details including top songs and albums</p>
                    
                    <h3>Parameters</h3>
                    <table class="params-table">
                        <tr>
                            <th>Parameter</th>
                            <th>Type</th>
                            <th>Description</th>
                        </tr>
                        <tr>
                            <td>id</td>
                            <td>string</td>
                            <td>Artist ID (required)</td>
                        </tr>
                    </table>

                    <h3>Response Example</h3>
                    <pre class="response-example">
{
    "status": "SUCCESS",
    "data": {
        "id": "artist123",
        "name": "Artist Name",
        "image": "https://...",
        "followerCount": 100000,
        "bio": "Artist biography...",
        "topSongs": [...],
        "topAlbums": [...],
        "featuredIn": [...]
    }
}</pre>
                </div>
            </section>

            <section id="lyrics" class="section">
                <h2>Lyrics API</h2>
                
                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="endpoint-url">/lyrics?id={id}</span>
                    </div>
                    <p>Get lyrics for a specific song</p>
                    
                    <h3>Parameters</h3>
                    <table class="params-table">
                        <tr>
                            <th>Parameter</th>
                            <th>Type</th>
                            <th>Description</th>
                        </tr>
                        <tr>
                            <td>id</td>
                            <td>string</td>
                            <td>Song ID (required)</td>
                        </tr>
                    </table>

                    <h3>Response Example</h3>
                    <pre class="response-example">
{
    "status": "SUCCESS",
    "data": {
        "lyrics": "Song lyrics...",
        "copyright": "Lyrics copyright...",
        "snippet": "Short lyrics preview..."
    }
}</pre>
                </div>
            </section>

            <section id="download" class="section">
                <h2>Download API</h2>
                
                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="endpoint-url">/download?id={id}&quality={quality}</span>
                    </div>
                    <p>Get download links for a song in different qualities</p>
                    
                    <h3>Parameters</h3>
                    <table class="params-table">
                        <tr>
                            <th>Parameter</th>
                            <th>Type</th>
                            <th>Description</th>
                        </tr>
                        <tr>
                            <td>id</td>
                            <td>string</td>
                            <td>Song ID (required)</td>
                        </tr>
                        <tr>
                            <td>quality</td>
                            <td>string</td>
                            <td>Audio quality: 96, 160, 320 (optional, defaults to highest available)</td>
                        </tr>
                    </table>

                    <h3>Response Example</h3>
                    <pre class="response-example">
{
    "status": "SUCCESS",
    "data": {
        "id": "song123",
        "name": "Song Name",
        "album": "Album Name",
        "year": "2024",
        "downloadUrl": "https://...",
        "quality": "320",
        "size": "9.5 MB"
    }
}</pre>
                </div>
            </section>

            <section id="radio" class="section">
                <h2>Radio API</h2>
                
                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="endpoint-url">/radio/songs?id={station_id}</span>
                    </div>
                    <p>Get songs from a radio station</p>
                    
                    <h3>Parameters</h3>
                    <table class="params-table">
                        <tr>
                            <th>Parameter</th>
                            <th>Type</th>
                            <th>Description</th>
                        </tr>
                        <tr>
                            <td>station_id</td>
                            <td>string</td>
                            <td>Radio station ID (required)</td>
                        </tr>
                    </table>
                </div>
            </section>

            <section id="trending" class="section">
                <h2>Trending</h2>
                
                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="endpoint-url">/trending</span>
                    </div>
                    <p>Get trending songs, albums, and playlists</p>
                    
                    <h3>Parameters</h3>
                    <table class="params-table">
                        <tr>
                            <th>Parameter</th>
                            <th>Type</th>
                            <th>Description</th>
                        </tr>
                        <tr>
                            <td>type</td>
                            <td>string</td>
                            <td>Content type: all, songs, albums, playlists (optional, defaults to all)</td>
                        </tr>
                        <tr>
                            <td>lang</td>
                            <td>string</td>
                            <td>Language filter (optional)</td>
                        </tr>
                    </table>
                </div>
            </section>
        </main>
    </div>

    <footer class="w-full text-center py-8 mt-auto">
        <p class="text-gray-600 text-sm">
            © ${new Date().getFullYear()} JioSaavn API. All rights reserved.
        </p>
    </footer>

    <script>
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    </script>
</body>
</html>`;
}

export { docs };
