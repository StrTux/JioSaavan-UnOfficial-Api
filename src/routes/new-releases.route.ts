import { Hono } from "hono";
import { validLangs } from "../lib/utils";
import * as cheerio from "cheerio";

interface JioSaavnAlbum {
  id: string;
  name: string;
  year?: string;
  language?: string;
  image?: string;
  url?: string;
  songs_count?: number;
  artists?: Array<{
    id?: string;
    name: string;
    url?: string;
  }>;
  playUrl?: string;
  type?: "song" | "album";
}

const newReleases = new Hono();

// Helper function to clean up text
const cleanText = (text: string) => {
  return text
    .replace(/\s+/g, " ")
    .trim();
};

// Helper function to extract title and artists from text
const extractTitleAndArtists = (text: string) => {
  // Remove "From" text and everything after it
  const mainText = text.split(/\(From\s+"/)[0].trim();

  // Try to split by common artist separators
  const parts = mainText.split(/(?:feat\.|ft\.|,|\s+-\s+|\s+by\s+)/i);
  
  // Get the title part
  let title = cleanText(parts[0]);

  // If the title contains artist names (usually when they're appended), try to separate them
  const titleParts = title.split(/(?=[A-Z][a-z])/);
  if (titleParts.length > 1) {
    // The first part that starts with a capital letter after a lowercase letter
    // is likely the start of an artist name
    let artistStartIndex = -1;
    for (let i = 1; i < titleParts.length; i++) {
      if (/[a-z][A-Z]/.test(titleParts[i - 1].slice(-1) + titleParts[i][0])) {
        artistStartIndex = i;
        break;
      }
    }

    if (artistStartIndex !== -1) {
      const artistPart = titleParts.slice(artistStartIndex).join("");
      parts.push(artistPart);
      title = titleParts.slice(0, artistStartIndex).join("");
    }
  }

  // Clean up the title
  title = cleanText(title);

  // Process artist names
  const artistNames = parts.slice(1)
    .join(",")
    .split(/[,&]/)
    .map(name => name.trim())
    .filter(name => {
      // Filter out common non-artist text
      const lowerName = name.toLowerCase();
      return Boolean(name) &&
        !lowerName.includes("from") &&
        !lowerName.includes("feat") &&
        !lowerName.includes("ft.") &&
        !lowerName.includes("by");
    })
    .map(name => {
      // Clean up artist name
      name = cleanText(name);
      // Remove common prefixes/suffixes
      name = name
        .replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.|The)\s+/i, "")
        .replace(/\s+\([^)]+\)/g, "")
        .replace(/\s+[&-]\s+.*$/, "")
        .trim();
      return { name };
    })
    .filter(artist => artist.name.length > 0);

  return { title, artists: artistNames };
};

// Get new releases
newReleases.get("/", async (c) => {
  const { lang = "", limit = "20", offset = "0" } = c.req.query();

  try {
    // Validate language
    const validatedLang = validLangs(lang);
    if (lang && !validatedLang) {
      return c.json({
        status: "Success",
        message: "✅ New releases fetched successfully",
        data: []
      });
    }

    // Fetch the HTML from JioSaavn's new releases page
    const response = await fetch("https://www.jiosaavn.com/new-releases", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Cookie": `L=${validatedLang || "hindi,english"}; gdpr_acceptance=true; DL=english; B=0`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data from JioSaavn: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract releases based on the HTML structure
    let releases: JioSaavnAlbum[] = [];

    // Try different selectors to find album containers
    const selectors = [
      ".o-block__item",
      ".u-margin-bottom@sm",
      ".c-card",
      ".u-margin-bottom-tiny",
      ".o-list-item",
      ".o-flag",
      ".u-margin-bottom",
      "article",
      ".c-card__body",
      ".o-layout__item"
    ];

    for (const selector of selectors) {
      $(selector).each((_, el) => {
        const albumEl = $(el);
        
        // Try different title selectors
        const titleSelectors = ["h4", ".u-centi", ".u-color-js-gray", ".c-card__title", ".o-title"];
        let fullText = "";
        for (const titleSelector of titleSelectors) {
          const text = albumEl.find(titleSelector).text().trim();
          if (text) {
            fullText = text;
            break;
          }
        }

        // Try different artist selectors if we don't have artist text yet
        if (!fullText) {
          const artistSelectors = [".o-subtitle", ".u-deci", ".c-card__subtitle", ".o-description"];
          for (const artistSelector of artistSelectors) {
            const text = albumEl.find(artistSelector).text().trim();
            if (text) {
              fullText = text;
              break;
            }
          }
        }

        // Extract title and artists from the full text
        const { title, artists } = extractTitleAndArtists(fullText);

        // Try different image selectors
        const imageSelectors = ["img", ".o-flag__img img", ".c-card__image img", ".o-image img"];
        let image = "";
        for (const imageSelector of imageSelectors) {
          const src = albumEl.find(imageSelector).attr("src");
          if (src) {
            image = src;
            break;
          }
        }

        // Try different link selectors
        const linkSelectors = ["a[href*='/album/']", "a[href*='/song/']", "a[href*='/new-releases/']", "a"];
        let url = "";
        for (const linkSelector of linkSelectors) {
          const href = albumEl.find(linkSelector).first().attr("href");
          if (href) {
            url = href;
            break;
          }
        }

        // Extract album details
        const id = url.split("/").pop()?.split("_")[0] || "";
        const type = url.includes("/song/") ? "song" : "album";

        // Only add if we have the minimum required data and it's not already in the list
        if (id && title && !releases.some(r => r.id === id)) {
          releases.push({
            id,
            name: title,
            image,
            url: url.startsWith("http") ? url : `https://www.jiosaavn.com${url}`,
            artists,
            language: validatedLang || "hindi",
            playUrl: type === "song" ? `/song/${id}` : undefined,
            type
          });
        }
      });

      // If we found some releases, break the loop
      if (releases.length > 0) {
        break;
      }
    }

    // Filter by language if specified
    if (validatedLang) {
      releases = releases.filter(item => item.language?.toLowerCase() === validatedLang.toLowerCase());
    }

    // Apply limit and offset
    const limitNum = parseInt(limit, 10);
    const offsetNum = parseInt(offset, 10);
    releases = releases.slice(offsetNum, offsetNum + limitNum);

    return c.json({
      status: "Success",
      message: "✅ New releases fetched successfully",
      data: releases
    });
  } catch (error: unknown) {
    console.error("Error fetching new releases:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return c.json({
      status: "Error",
      message: "Failed to fetch new releases",
      error: errorMessage
    }, 500);
  }
});

export { newReleases }; 