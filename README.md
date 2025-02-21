# 🎵 JioSaavn UnOfficial API

<div align=center>

![][ci] ![][views] ![][stars] ![][forks] ![][issues] ![][license] ![][code-size] ![][commit-activity]

<img src="./public/jiosaavn-2.png" width="200px"/>

### A powerful and feature-rich wrapper for the JioSaavn API powered by Hono.js 🔥

[**📚 Documentation**](https://docs-jiosaavn.netlify.app/)

</div>

## 📝 Attribution

This project is based on the excellent work of:
- [saavn.dev](https://github.com/saavn-dev) - Original API implementation
- [rajput-hemant](https://github.com/rajput-hemant/jiosaavn-api-ts) - TypeScript implementation and enhancements

My contributions include:
- Enhanced documentation and API reference
- Improved error handling and response formats
- Additional endpoint implementations
- UI/UX improvements
- Code optimizations and bug fixes

## ✨ Features

- 🚀 **Ultrafast** - Powered by [Hono.js](https://hono.dev). The router `RegExpRouter` is really fast.
- 🪶 **Lightweight** - Has minimal dependencies.
- 🌍 **Multi-runtime** - Works on `Bun`, `Node.js`, `Vercel` or `Cloudflare Workers`. The same code runs on all platforms.
- 🔥 **High Quality Downloads** - Download songs in multiple qualities (320kbps, 160kbps, 96kbps)
- 🎵 **Comprehensive API** - Access songs, albums, playlists, artists, radio stations, podcasts, lyrics, and recommendations
- 📱 **Modern UI** - Clean and responsive interface with beautiful documentation
- 🔍 **Smart Search** - Powerful search functionality across all content types
- 🌐 **Language Support** - Multi-language support for content and filters
- ❤️ **Open Source** - Free to use and modify under MIT license

## 🛠️ Getting Started

### Prerequisites
- Node.js 16+ or Bun runtime
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/StrTux/JioSaavan-UnOfficial-Api
cd JioSaavan-UnOfficial-Api
```

2. Install dependencies
```bash
npm install   # or yarn, pnpm, bun install
```

3. Start the development server

Choose your preferred runtime:

#### Bun (Recommended)
```bash
bun run dev
```

#### Node.js
```bash
npm run dev:node
```

#### Vercel Dev Server
```bash
npm run dev:vc
```

#### Cloudflare Workers
```bash
npm run dev:cf
```

## 🚀 Deployment Options

### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/StrTux/JioSaavan-UnOfficial-Api)
[![Deploy with Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/StrTux/JioSaavan-UnOfficial-Api)

### Manual Deployment

#### Vercel
```bash
npm run deploy:vercel
```
> **Note**: Recommended region: Mumbai, India (bom1) for optimal performance

#### Cloudflare Workers
```bash
npm run deploy:cf
```

### Docker Deployment

#### Using Docker Compose (Recommended)
```bash
# Start
docker-compose up -d

# Stop
docker-compose down
```

#### Using Docker
```bash
# Build
docker build -t jiosaavn .

# Run
docker run -p 80:3000 jiosaavn

# Stop
docker stop <container-id>
```

## 📚 API Documentation

Full API documentation is available at [docs-jiosaavn.netlify.app](https://docs-jiosaavn.netlify.app/)

Key endpoints include:
- Search API (`/search`)
- Songs API (`/song`)
- Albums API (`/album`)
- Playlists API (`/playlist`)
- Artists API (`/artist`)
- Lyrics API (`/lyrics`)
- Radio API (`/radio`)
- Downloads API (`/download`)

## 💡 Environment Variables

Create a `.env` file in the root directory:
```env
PORT=3000
ENABLE_RATE_LIMIT=true
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Special thanks to:
- [saavn.dev](https://github.com/saavn-dev) team for the original API implementation
- [rajput-hemant](https://github.com/rajput-hemant) for the TypeScript version and improvements
- All contributors who have helped improve this project

<div align=center>

## 🦾 Contributors

<a href="https://github.com/StrTux/JioSaavan-UnOfficial-Api/graphs/contributors" target="blank">
  <img src="https://contrib.rocks/image?repo=StrTux/JioSaavan-UnOfficial-Api&max=500" />
</a>

</div>

[ci]: https://github.com/StrTux/JioSaavan-UnOfficial-Api/actions/workflows/ci.yml/badge.svg
[views]: https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2FStrTux%2FJioSaavan-UnOfficial-Api&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=views&edge_flat=false
[stars]: https://img.shields.io/github/stars/StrTux/JioSaavan-UnOfficial-Api?style=flat
[forks]: https://img.shields.io/github/forks/StrTux/JioSaavan-UnOfficial-Api?style=flat
[issues]: https://img.shields.io/github/issues/StrTux/JioSaavan-UnOfficial-Api?style=flat
[license]: https://img.shields.io/github/license/StrTux/JioSaavan-UnOfficial-Api?style=flat
[code-size]: https://img.shields.io/github/languages/code-size/StrTux/JioSaavan-UnOfficial-Api?style=flat
[commit-activity]: https://img.shields.io/github/commit-activity/m/StrTux/JioSaavan-UnOfficial-Api?style=flat
