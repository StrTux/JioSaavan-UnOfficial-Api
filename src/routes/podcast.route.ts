import { Hono } from "hono";
import { api } from "../lib/api";
import { config } from "../lib/config";
import { parseBool, validLangs } from "../lib/utils";
import { CustomResponse } from "../types/response";
import { 
  ShowRequest,
  ShowRespone,
  EpisodeDetailRequest,
  EpisodeDetailResponse
} from "../types/show";
import { showsPayload } from "../payloads/show.payload";
import { episodeDetailPayload } from "../payloads/show.payload";

const {
  // show_details: showDetails,
  // episodes: episodes,
  // episode_details: episodeDetails
} = config.endpoint.show;

const {
  top_shows: topShows
} = config.endpoint.get;

interface TopShowsResponse {
  trendingPodcasts: {
    items: {
      id: string;
      title: string;
      subtitle: string;
      type: string;
      image: string;
      perma_url: string;
      explicit_content: string;
      more_info: {
        square_image: string;
      };
    }[];
    module: {
      source: string;
      title: string;
      subtitle: string;
    };
  }[];
  data: {
    id: string;
    title: string;
    subtitle: string;
    type: string;
    image: string;
    perma_url: string;
    explicit_content: string;
    category?: string;
    release_date?: string;
    description?: string;
    episodes?: unknown[];
    duration?: string;
  }[];
}

const podcast = new Hono();

/* -----------------------------------------------------------------------------------------------
 * Trending Podcasts Route Handler - GET /podcast/trending
 * -----------------------------------------------------------------------------------------------*/
podcast.get("/trending", async (c) => {
  const { lang = "", raw = "" } = c.req.query();

  try {
    const result = await api<TopShowsResponse>(config.endpoint.get.top_shows, {
      query: { languages: validLangs(lang) },
      retries: 3
    });

    if (!result.trendingPodcasts?.length) {
      console.error("No trending podcasts found in response:", result);
      return c.json({
        status: "Failed",
        message: "Failed to fetch trending podcasts",
        data: []
      }, 500);
    }

    if (parseBool(raw)) {
      return c.json(result);
    }

    const response = {
      status: "Success",
      message: "✅ Trending podcasts fetched successfully",
      data: result.trendingPodcasts[0].items.map(item => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        type: item.type,
        image: item.image,
        url: item.perma_url,
        explicit: parseBool(item.explicit_content)
      }))
    };

    return c.json(response);
  } catch (error) {
    console.error("Error fetching trending podcasts:", error);
    return c.json({
      status: "Failed",
      message: "Failed to fetch trending podcasts",
      error: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});

/* -----------------------------------------------------------------------------------------------
 * Featured Podcasts Route Handler - GET /podcast/featured
 * -----------------------------------------------------------------------------------------------*/
podcast.get("/featured", async (c) => {
  const { lang = "", raw = "" } = c.req.query();

  const result = await api<TopShowsResponse>(config.endpoint.get.top_shows, {
    query: { languages: validLangs(lang) }
  });

  if (!result.data?.length) {
    throw new Error("Failed to fetch featured podcasts");
  }

  if (parseBool(raw)) {
    return c.json(result);
  }

  const response = {
    status: "Success",
    message: "✅ Featured podcasts fetched successfully",
    data: result.data.map(item => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle || "",
      type: "show",
      image: item.image,
      url: item.perma_url,
      category: item.category || "",
      explicit: parseBool(item.explicit_content)
    }))
  };

  return c.json(response);
});

/* -----------------------------------------------------------------------------------------------
 * New Podcasts Route Handler - GET /podcast/new
 * -----------------------------------------------------------------------------------------------*/
podcast.get("/new", async (c) => {
  const { lang = "", raw = "" } = c.req.query();

  const result = await api<TopShowsResponse>(config.endpoint.get.top_shows, {
    query: { languages: validLangs(lang), sort: "latest" }
  });

  if (!result.data?.length) {
    throw new Error("Failed to fetch new podcasts");
  }

  if (parseBool(raw)) {
    return c.json(result);
  }

  const response = {
    status: "Success",
    message: "✅ New podcasts fetched successfully",
    data: result.data.map(item => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle || "",
      type: "show",
      image: item.image,
      url: item.perma_url,
      release_date: item.release_date || "",
      explicit: parseBool(item.explicit_content)
    }))
  };

  return c.json(response);
});

/* -----------------------------------------------------------------------------------------------
 * Podcast Categories Route Handler - GET /podcast/category/:category
 * -----------------------------------------------------------------------------------------------*/
podcast.get("/category/:category", async (c) => {
  const category = c.req.param("category");
  const { lang = "", raw = "" } = c.req.query();

  const result = await api<TopShowsResponse>(config.endpoint.get.top_shows, {
    query: { 
      languages: validLangs(lang),
      category: category
    }
  });

  if (!result.data?.length) {
    throw new Error(`Failed to fetch podcasts for category: ${category}`);
  }

  if (parseBool(raw)) {
    return c.json(result);
  }

  const response = {
    status: "Success",
    message: `✅ ${category} podcasts fetched successfully`,
    data: result.data.map(item => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle || "",
      type: "show",
      image: item.image,
      url: item.perma_url,
      explicit: parseBool(item.explicit_content)
    }))
  };

  return c.json(response);
});

/* -----------------------------------------------------------------------------------------------
 * Podcast Details Route Handler - GET /podcast?id={id}
 * -----------------------------------------------------------------------------------------------*/
podcast.get("/", async (c) => {
  const { id = "", raw = "" } = c.req.query();

  if (!id) {
    const errorResponse = {
      status: "Failed",
      message: "Podcast ID is required"
    };
    return c.json(errorResponse, 400);
  }

  try {
    const result = await api<TopShowsResponse>(config.endpoint.get.top_shows, {
      query: { id }
    });

    // Check if the response has valid data
    if (!result.data?.length || !result.data[0]?.id || result.data[0].id !== id) {
      const error = {
        status: "Failed",
        message: "Invalid podcast ID"
      };
      return c.json(error, 400);
    }

    if (parseBool(raw)) {
      return c.json(result);
    }

    const podcast = result.data[0];
    const response = {
      status: "Success",
      message: "✅ Podcast details fetched successfully",
      data: {
        id: podcast.id,
        title: podcast.title,
        subtitle: podcast.subtitle || "",
        description: podcast.description || "",
        type: "show",
        image: podcast.image,
        url: podcast.perma_url,
        explicit: parseBool(podcast.explicit_content),
        episodes: podcast.episodes || []
      }
    };

    return c.json(response);
  } catch (error) {
    const response = {
      status: "Failed",
      message: "Invalid podcast ID"
    };
    return c.json(response, 400);
  }
});

/* -----------------------------------------------------------------------------------------------
 * Podcast Episodes Route Handler - GET /podcast/episodes?id={id}
 * -----------------------------------------------------------------------------------------------*/
podcast.get("/episodes", async (c) => {
  const { id = "", raw = "" } = c.req.query();

  if (!id) {
    const error = {
      status: "Failed",
      message: "Podcast ID is required"
    };
    return c.json(error, 400);
  }

  const result = await api<TopShowsResponse>(config.endpoint.get.top_shows, {
    query: { id, type: "episodes" }
  });

  if (!result.data?.length) {
    const error = {
      status: "Failed",
      message: "Invalid podcast ID or no episodes found"
    };
    return c.json(error, 400);
  }

  if (parseBool(raw)) {
    return c.json(result);
  }

  const response = {
    status: "Success",
    message: "✅ Podcast episodes fetched successfully",
    data: result.data.map(episode => ({
      id: episode.id,
      title: episode.title,
      subtitle: episode.subtitle || "",
      type: "episode",
      image: episode.image,
      url: episode.perma_url,
      explicit: parseBool(episode.explicit_content),
      duration: episode.duration || "",
      release_date: episode.release_date || ""
    }))
  };

  return c.json(response);
});

export { podcast }; 