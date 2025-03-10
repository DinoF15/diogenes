/**
 * Fetches a random quote from the Forismatic API.
 *
 * @returns {Promise<{ quoteText: string; quoteAuthor: string }>} A promise that resolves to an object containing the quote text and author.
 * @throws {Error} If the request to the Forismatic API fails.
 * 
 * Forismatic API: https://forismatic.com/en/api/
 * 
 */
export async function fetchRandomQuote(): Promise<{ quoteText: string; quoteAuthor: string }> {
    const params = new URLSearchParams({
      method: "getQuote",
      format: "json",
      lang: "en",
    });
  
    const res = await fetch(`${process.env.FORISMATIC_API_URL}?${params.toString()}`, {
      method: 'GET'
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch quote");
    }
  
    const data = await res.json();
    return {
      quoteText: data.quoteText,
      quoteAuthor: data.quoteAuthor || "Unknown",
    };
  }
  