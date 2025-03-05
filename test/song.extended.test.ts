import { describe, expect, test } from "bun:test";
import { app } from "../src";

describe("Song Extended Tests", () => {
  // Test song metadata
  test("GET /song?id=5WXAlMNt | Verify complete song metadata", async () => {
    const response = await app.request("/song?id=5WXAlMNt");
    expect(response.status).toBe(200);

    const song: any = await response.json();
    expect(song.status).toBe("Success");
    expect(song.data.songs[0]).toHaveProperty("id");
    expect(song.data.songs[0]).toHaveProperty("name");
    expect(song.data.songs[0]).toHaveProperty("album");
    expect(song.data.songs[0]).toHaveProperty("year");
    expect(song.data.songs[0]).toHaveProperty("release_date");
    expect(song.data.songs[0]).toHaveProperty("duration");
    expect(song.data.songs[0]).toHaveProperty("label");
    expect(song.data.songs[0]).toHaveProperty("artist_map");
    expect(song.data.songs[0].artist_map).toHaveProperty("primary_artists");
    expect(song.data.songs[0]).toHaveProperty("explicit");
    expect(song.data.songs[0]).toHaveProperty("has_lyrics");
    expect(song.data.songs[0]).toHaveProperty("copyright_text");
  });

  // Test multiple song IDs
  test("GET /song?id=5WXAlMNt,9BjJPi0Y,IhKbmgyP | Multiple songs fetch", async () => {
    const response = await app.request("/song?id=5WXAlMNt,9BjJPi0Y,IhKbmgyP");
    expect(response.status).toBe(200);

    const songs: any = await response.json();
    expect(songs.status).toBe("Success");
    expect(songs.data.songs).toBeArray();
    expect(songs.data.songs.length).toBe(3);
    songs.data.songs.forEach((song: any) => {
      expect(song).toHaveProperty("id");
      expect(song).toHaveProperty("name");
    });
  });

  // Test invalid URL format
  test("GET /song?link=invalid-url | Invalid song URL", async () => {
    const response = await app.request("/song?link=invalid-url");
    expect(response.status).toBe(400);

    const result: any = await response.json();
    expect(result.status).toBe("Failed");
    expect(result.message).toBeTruthy();
  });

  // Test non-JioSaavn URL
  test("GET /song?link=https://example.com/song | Non-JioSaavn URL", async () => {
    const response = await app.request("/song?link=https://example.com/song");
    expect(response.status).toBe(400);

    const result: any = await response.json();
    expect(result.status).toBe("Failed");
    expect(result.message).toBeTruthy();
  });

  // Test recommendations with limit
  test("GET /song/recommend?id=5WXAlMNt&limit=5 | Limited recommendations", async () => {
    const response = await app.request("/song/recommend?id=5WXAlMNt&limit=5");
    expect(response.status).toBe(200);

    const recos: any = await response.json();
    expect(recos.status).toBe("Success");
    expect(recos.data).toBeArray();
    expect(recos.data.length).toBeLessThanOrEqual(5);
  });

  // Test song language
  test("GET /song?id=5WXAlMNt | Verify song language", async () => {
    const response = await app.request("/song?id=5WXAlMNt");
    expect(response.status).toBe(200);

    const song: any = await response.json();
    expect(song.data.songs[0]).toHaveProperty("language");
    expect(typeof song.data.songs[0].language).toBe("string");
  });

  // Test song download URLs
  test("GET /song?id=5WXAlMNt | Verify download URLs", async () => {
    const response = await app.request("/song?id=5WXAlMNt");
    expect(response.status).toBe(200);

    const song: any = await response.json();
    expect(song.data.songs[0]).toHaveProperty("download_url");
    const downloadUrls = song.data.songs[0].download_url;
    expect(downloadUrls).toBeArray();
    downloadUrls.forEach((url: any) => {
      expect(url).toHaveProperty("quality");
      expect(url).toHaveProperty("link");
    });
  });

  // Test song image URLs
  test("GET /song?id=5WXAlMNt | Verify image URLs", async () => {
    const response = await app.request("/song?id=5WXAlMNt");
    expect(response.status).toBe(200);

    const song: any = await response.json();
    expect(song.data.songs[0]).toHaveProperty("image");
    const images = song.data.songs[0].image;
    expect(images).toBeArray();
    images.forEach((img: any) => {
      expect(img).toHaveProperty("quality");
      expect(img).toHaveProperty("link");
    });
  });

  // Test empty song IDs
  test("GET /song?id= | Empty song ID", async () => {
    const response = await app.request("/song?id=");
    expect(response.status).toBe(400);

    const result: any = await response.json();
    expect(result.status).toBe("Failed");
    expect(result.message).toBeTruthy();
  });

  // Test malformed song IDs
  test("GET /song?id=abc,123,!@# | Malformed song IDs", async () => {
    const response = await app.request("/song?id=abc,123,!@#");
    expect(response.status).toBe(400);

    const result: any = await response.json();
    expect(result.status).toBe("Failed");
    expect(result.message).toBeTruthy();
  });
}); 