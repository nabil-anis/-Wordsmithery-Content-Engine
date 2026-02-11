
export interface GenerateContentParams {
  toneName: string;
  toneDescription: string;
  region: string;
  promotion: string;
  details: string;
}

/**
 * Generates marketing content by calling the configured external webhook endpoint.
 * This replaces direct direct SDK calls to allow for centralized workflow orchestration.
 */
export const generateContent = async (params: GenerateContentParams): Promise<string> => {
  const endpoint = 'https://n8n.srv1311717.hstgr.cloud/webhook/5c2aa3b8-401c-4988-9f2e-2fad357496b4';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...params,
        timestamp: new Date().toISOString(),
        source: 'wordsmithery-ui'
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Generation Engine Error (${response.status}): ${errorBody || response.statusText}`);
    }

    const rawResponse = await response.text();

    // Attempt to handle various response formats from n8n (JSON objects, arrays, or plain text)
    try {
      const parsed = JSON.parse(rawResponse);

      // Recursive helper to find "text" or "content" or "output" in deep structures
      const extractDeepContent = (data: any): string | null => {
        if (!data) return null;

        // If it's a simple string, it might be the content or a JSON string
        if (typeof data === 'string') {
          try {
            const nested = JSON.parse(data);
            if (typeof nested === 'object') return extractDeepContent(nested);
            return data;
          } catch (e) {
            return data;
          }
        }

        // If it's an array, look in the first item
        if (Array.isArray(data) && data.length > 0) {
          return extractDeepContent(data[0]);
        }

        // if it's an object, search for keys
        if (typeof data === 'object') {
          // Special case for the structure provided by user: output -> content -> text
          // or direct content/text keys
          const priorityKeys = ['text', 'content', 'output'];
          for (const key of priorityKeys) {
            if (data[key]) {
              const res = extractDeepContent(data[key]);
              if (res) return res;
            }
          }

          // If no specific keys, return stringified object as fallback
          return JSON.stringify(data);
        }

        return String(data);
      };

      const extracted = extractDeepContent(parsed);

      if (extracted) {
        // One final check: if the extracted string is itself a JSON string containing a "content" field
        // (common in some LLM outputs)
        try {
          const inner = JSON.parse(extracted);
          if (inner && typeof inner === 'object' && inner.content) {
            return inner.content.trim();
          }
        } catch (e) {
          // Not a JSON string with content field, return as is
        }
        return extracted.trim();
      }

      return rawResponse.trim();
    } catch (e) {
      // If it's not valid JSON, treat the raw response as the generated content
      return rawResponse.trim();
    }
  } catch (error) {
    console.error("Wordsmithery API Error:", error);
    throw new Error(error instanceof Error ? error.message : "The generation engine is currently unreachable.");
  }
};
