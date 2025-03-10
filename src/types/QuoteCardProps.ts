/**
 * Props for the QuoteCard component.
 *
 * @property {string} quote - The quote text to be displayed.
 * @property {string} context - The context or source of the quote.
 */
export type QuoteCardProps = {
    quote: string;
    author?: string;
    context?: string;
    createdAt?: string;
  };