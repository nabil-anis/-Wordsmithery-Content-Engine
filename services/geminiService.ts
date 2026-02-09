
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
      
      // If it's a simple string wrapped in JSON
      if (typeof parsed === 'string') return parsed.trim();
      
      // If it's an array (typical n8n output structure)
      if (Array.isArray(parsed) && parsed.length > 0) {
        const item = parsed[0];
        if (typeof item === 'string') return item.trim();
        return (item.text || item.content || item.output || JSON.stringify(item)).trim();
      }
      
      // If it's an object, look for common content keys
      if (typeof parsed === 'object' && parsed !== null) {
        return (parsed.text || parsed.content || parsed.output || JSON.stringify(parsed)).trim();
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
