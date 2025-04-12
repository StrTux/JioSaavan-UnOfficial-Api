import { config } from "./config";

export const api = async <T>(
  path: string,
  {
    isVersion4 = true,
    query,
    retries = 3,
  }: { isVersion4?: boolean; query?: Record<string, string>; retries?: number } = {}
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
  
  const headers = {
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
  };

  console.log("Making request to:", url);
  console.log("With query params:", Object.fromEntries(params.entries()));
  console.log("With headers:", {
    "Accept": headers.Accept,
    "User-Agent": headers["User-Agent"],
    "Origin": headers.Origin,
    "Referer": headers.Referer,
    "cookie": headers.cookie,
  });

  let lastError: Error | null = null;
  let attemptCount = 0;

  while (attemptCount < retries) {
    try {
      attemptCount++;
      
      const response = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
      });

      if (!response.ok) {
        console.error(`API Error (Attempt ${attemptCount}/${retries}):`, {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
        });
        
        // Check if we should retry based on status code
        if (response.status === 429 || response.status >= 500) {
          if (attemptCount < retries) {
            // Wait a bit longer between each retry (exponential backoff)
            await new Promise(r => setTimeout(r, 1000 * attemptCount));
            continue;
          }
        }
        
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response:", {
        url: response.url,
        data: data
      });
      
      // Validate response data to ensure it's not empty
      if (!data || (Array.isArray(data) && data.length === 0) || 
          (typeof data === 'object' && Object.keys(data).length === 0)) {
        throw new Error('API returned empty response');
      }
      
      return data as T;
    } catch (error) {
      lastError = error as Error;
      console.error(`API Request failed (Attempt ${attemptCount}/${retries}):`, error);
      
      if (attemptCount < retries) {
        // Wait a bit longer between each retry (exponential backoff)
        await new Promise(r => setTimeout(r, 1000 * attemptCount));
      }
    }
  }

  // If we've exhausted all retries, throw the last error
  throw lastError || new Error('Maximum retry attempts reached');
};
