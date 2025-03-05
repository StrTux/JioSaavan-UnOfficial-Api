import { config } from "./config";

export const api = async <T>(
  path: string,
  {
    isVersion4 = true,
    query,
  }: { isVersion4?: boolean; query?: Record<string, string> } = {}
) => {
  const params = new URLSearchParams({
    __call: path,
    _format: "json",
    _marker: "0",
    ctx: "web6dot0",
    ...(isVersion4 ? { api_version: "4" } : {}),
    ...query,
  });

  const url = `${config.urls.baseUrl}?${params}`;
  const langs = params.get("language") || "hindi,english";

  console.log("Making request to:", url);
  console.log("With query params:", Object.fromEntries(params.entries()));
  console.log("With headers:", {
    "Accept": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Origin": "https://www.jiosaavn.com",
    "Referer": "https://www.jiosaavn.com/",
    "cookie": `L=${langs}; gdpr_acceptance=true; DL=english; B=0; CT=MTcwOTYzNjE5NQ==; CH=G_1_2_3_4_5; T=134169808; I=134169808`,
  });

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Origin": "https://www.jiosaavn.com",
        "Referer": "https://www.jiosaavn.com/",
        "cookie": `L=${langs}; gdpr_acceptance=true; DL=english; B=0; CT=MTcwOTYzNjE5NQ==; CH=G_1_2_3_4_5; T=134169808; I=134169808`,
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Host": "www.jiosaavn.com",
        "Pragma": "no-cache",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
      },
      credentials: "include",
    });

    if (!response.ok) {
      console.error("API Error:", {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API Response:", {
      url: response.url,
      data: data
    });
    return data as T;
  } catch (error) {
    console.error("API Request failed:", error);
    throw error;
  }
};
