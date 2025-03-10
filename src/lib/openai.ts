/**
 * Generates a humorous and creative backstory for a given quote using Azure OpenAI.
 *
 * @param quote - The quote for which to generate a humorous context.
 * @returns A promise that resolves to a string containing the generated humorous context.
 * @throws Will throw an error if any of the required Azure OpenAI environment variables are missing.
 * @throws Will throw an error if the Azure OpenAI API request fails or returns no completion.
 *
 * Environment Variables:
 * - `AZURE_OPENAI_ENDPOINT`: The endpoint URL for the Azure OpenAI service.
 * - `AZURE_OPENAI_API_KEY`: The API key for authenticating with the Azure OpenAI service.
 * - `AZURE_OPENAI_DEPLOYMENT_NAME`: The deployment name for the Azure OpenAI model (e.g., text-davinci-003).
 * - `AZURE_OPENAI_API_VERSION` (optional): The API version to use (default is "2022-12-01").
 */
export async function generateHumorousContext(quote: string): Promise<string> {
  // Retrieve environment variables for Azure OpenAI integration
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2022-12-01";

  if (!endpoint || !apiKey || !deploymentName) {
    throw new Error("Missing Azure OpenAI environment variables");
  }

  // Build the full URL to the completions endpoint
  const url = `${endpoint}/openai/deployments/${deploymentName}/completions?api-version=${apiVersion}`;

  // Create the prompt for humorous context generation
  const prompt = `Generate a humorous backstory for the following quote:\n\n"${quote}"\n\nHumorous Context: 
  do not be afraid to be controversial in your response, and feel free to be creative and imaginative. The goal is to entertain and surprise the reader.
  `;

  const requestBody = {
    prompt: prompt,
    max_tokens: 100,
    temperature: 0.8,
    top_p: 1,
    n: 1,
    stop: null,
  };


  /**
   * Fetches a resource from the given URL with retry logic for handling rate limits.
   *
   * @param url - The URL to fetch the resource from.
   * @param options - The options to pass to the fetch request.
   * @param retries - The number of retry attempts in case of rate limit errors (default is 3).
   * @param delay - The initial delay between retries in milliseconds (default is 3000).
   * @returns A promise that resolves to an object containing an array of choices with text properties.
   * @throws An error if the request fails after the specified number of retries or if a non-rate limit error occurs.
   */
  async function fetchWithRetry(url: string, options: RequestInit, retries = 3, delay = 3000): Promise<{ choices: { text: string }[] }> {
    for (let attempt = 0; attempt < retries; attempt++) {
      const response = await fetch(url, options);
      if (response.ok) {
        return response.json();
      }

      if (response.status === 429) {
        console.warn(`Rate limit exceeded. Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff (increase wait time)
      } else {
        const errorText = await response.text();
        throw new Error(`Azure OpenAI API error: ${response.status} - ${errorText}`);
      }
    }
    throw new Error("Failed after multiple retries due to rate limits.");
  }

  try {
    // Call the Azure OpenAI completions endpoint with retry logic
    const response = await fetchWithRetry(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    // Ensure the API returned a valid completion
    if (!response.choices || response.choices.length === 0) {
      throw new Error("No completion returned from Azure OpenAI API");
    }

    const generatedText = response.choices[0].text.trim();
    return generatedText;
  } catch (error) {
    console.error("Error generating humorous context:", error);
    throw error;
  }
}
