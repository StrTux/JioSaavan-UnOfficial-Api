import { Hono } from "hono";
import { api } from "../lib/api";
import { config } from "../lib/config";
import { parseBool } from "../lib/utils";
import { createDownloadLinks } from "../lib/utils";
import { CustomResponse } from "../types/response";
import { SongRequest } from "../types/song";
import { Quality } from "../types/misc";

export const download = new Hono();

/* -----------------------------------------------------------------------------------------------
 * Get Download URLs Route Handler - /download
 * -----------------------------------------------------------------------------------------------*/

download.get("/", async (c) => {
  const { id = "", quality = "", raw = "" } = c.req.query();

  if (!id) {
    throw new Error("Song ID is required");
  }

  // First verify if song exists and has download URL
  let result: SongRequest;
  try {
    result = await api(config.endpoint.song.id, {
      query: { pids: id },
    });
  } catch (error) {
    throw new Error(
      `Song not found: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }

  if (!result || !result.more_info?.encrypted_media_url) {
    throw new Error("Song not found or download URL not available");
  }

  // Validate quality parameter if provided
  if (quality && !["96_KBPS", "160_KBPS", "320_KBPS"].includes(quality)) {
    throw new Error(
      "Invalid quality. Must be one of: 96_KBPS, 160_KBPS, 320_KBPS"
    );
  }

  let downloadUrls: Quality;
  try {
    downloadUrls = createDownloadLinks(result.more_info.encrypted_media_url);
  } catch (error) {
    throw new Error(
      `Failed to generate download URLs: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }

  if (!Array.isArray(downloadUrls) || !downloadUrls.length) {
    throw new Error("Failed to generate download URLs");
  }

  if (quality) {
    const qualityUrl = downloadUrls.find((url) => url.quality === quality);
    if (!qualityUrl) {
      throw new Error(
        `Quality ${quality} not available for this song. Available qualities: ${downloadUrls.map((u) => u.quality).join(", ")}`
      );
    }
  }

  if (parseBool(raw)) {
    return c.json(downloadUrls);
  }

  const response: CustomResponse<typeof downloadUrls> = {
    status: "Success",
    message: "✅ Download URLs fetched successfully",
    data: quality
      ? downloadUrls.filter((url) => url.quality === quality)
      : downloadUrls,
  };

  return c.json(response);
});
