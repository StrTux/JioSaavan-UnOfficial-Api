import { describe, it, expect } from 'vitest';
import { app } from '../src';

interface ApiResponse<T = unknown> {
  status: string;
  message?: string;
  data: T;
}

interface SearchResult {
  results: Array<{
    id: string;
    title: string;
    [key: string]: unknown;
  }>;
}

describe('JioSaavan API Tests', () => {
  // Search Tests
  describe('Search Endpoints', () => {
    it('should search all content', async () => {
      const res = await app.request('/search?query=arijit');
      const data = await res.json() as ApiResponse;
      expect(res.status).toBe(200);
      expect(data.status).toBe('Success');
    });

    it('should search songs', async () => {
      const res = await app.request('/search/songs?query=perfect');
      const data = await res.json() as ApiResponse<SearchResult>;
      expect(res.status).toBe(200);
      expect(data.data.results).toBeDefined();
    });

    it('should search albums', async () => {
      const res = await app.request('/search/albums?query=arijit');
      const data = await res.json() as ApiResponse<SearchResult>;
      expect(res.status).toBe(200);
      expect(data.data.results).toBeDefined();
    });
  });

  // Songs Tests
  describe('Song Endpoints', () => {
    it('should get song details', async () => {
      const res = await app.request('/song?id=dZbr6LtY');
      const data = await res.json() as ApiResponse;
      expect(res.status).toBe(200);
      expect(data.data).toBeDefined();
    });

    it('should get song lyrics', async () => {
      const res = await app.request('/lyrics?id=dZbr6LtY');
      const data = await res.json() as ApiResponse;
      expect(res.status).toBe(200);
      expect(data.status).toBe('Success');
    });
  });

  // Albums Tests
  describe('Album Endpoints', () => {
    it('should get album details', async () => {
      const res = await app.request('/album?id=1142502');
      const data = await res.json() as ApiResponse;
      expect(res.status).toBe(200);
      expect(data.data).toBeDefined();
    });
  });

  // Artists Tests
  describe('Artist Endpoints', () => {
    it('should get artist details', async () => {
      const res = await app.request('/artist?id=459320');
      const data = await res.json() as ApiResponse;
      expect(res.status).toBe(200);
      expect(data.data).toBeDefined();
    });

    it('should get artist songs', async () => {
      const res = await app.request('/artist/songs?id=459320');
      const data = await res.json() as ApiResponse<SearchResult>;
      expect(res.status).toBe(200);
      expect(data.data.results).toBeDefined();
    });
  });

  // Playlists Tests
  describe('Playlist Endpoints', () => {
    it('should get playlist details', async () => {
      const res = await app.request('/playlist?id=159145156');
      const data = await res.json() as ApiResponse;
      expect(res.status).toBe(200);
      expect(data.data).toBeDefined();
    });
  });

  // Home & Trending Tests
  describe('Home and Trending Endpoints', () => {
    it('should get home data', async () => {
      const res = await app.request('/modules/home');
      const data = await res.json() as ApiResponse;
      expect(res.status).toBe(200);
      expect(data.data).toBeDefined();
    });

    it('should get trending songs', async () => {
      const res = await app.request('/trending/songs');
      const data = await res.json() as ApiResponse;
      expect(res.status).toBe(200);
      expect(data.data).toBeDefined();
    });
  });

  // Charts Tests
  describe('Charts Endpoints', () => {
    it('should get charts', async () => {
      const res = await app.request('/modules/charts');
      const data = await res.json() as ApiResponse;
      expect(res.status).toBe(200);
      expect(data.data).toBeDefined();
    });
  });

  // Radio Tests
  describe('Radio Endpoints', () => {
    it('should get featured radio stations', async () => {
      const res = await app.request('/radio/featured');
      const data = await res.json() as ApiResponse;
      expect(res.status).toBe(200);
      expect(data.data).toBeDefined();
    });
  });
}); 