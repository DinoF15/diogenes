import Image from "next/image";
import { QuoteCardProps } from "../types/QuoteCardProps";
import styles from "../styles/QuoteCard.module.scss";

import diogenes from "../app/diogenes.png";

/**
 * A functional component that displays a quote, its author, timestamp, and Diogenes' humorous context.
 * Diogenes' portrait and his speech bubble are styled to look like a comic strip.
 *
 * @component
 * @param {QuoteCardProps} props - The properties object.
 * @returns {JSX.Element} The rendered QuoteCard component.
 */
export default function QuoteCard({ quote, author, context, createdAt }: QuoteCardProps) {
  return (
    <div className={styles.card}>
      <blockquote className={styles.quote}>&ldquo;{quote}&rdquo;</blockquote>
      <p className={styles.author}>— {author}</p>
      {createdAt && (
        <p className={styles.timestamp}>
          <em>{new Date(createdAt).toLocaleString()}</em>
        </p>
      )}
      <div className={styles.comicSection}>
        <div className={styles.imageWrapper}>
          <Image 
            src={diogenes}
            alt="Portrait of Diogenes" 
            width={100} 
            height={150} 
            className={styles.diogenesImage}
          />
        </div>
        <div className={styles.speechBubble}>
          <p className={styles.context}>
            {context ? context : "No humorous context yet."}
          </p>
        </div>
      </div>
    </div>
  );
}
