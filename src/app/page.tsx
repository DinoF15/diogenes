'use client';

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuoteCard from "@/components/QuoteCard";
import styles from "../styles/Home.module.scss";
import { QuoteData } from "@/types/QuoteData";

export default function Home() {
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [loadingContext, setLoadingContext] = useState(false);

  const fetchQuote = async () => {
    setLoadingQuote(true);
    try {
      const res = await fetch("/api/quote");
      const data: QuoteData = await res.json();
      setQuoteData(data);
    } catch (error) {
      console.error("Error fetching quote:", error);
    } finally {
      setLoadingQuote(false);
    }
  };

  const generateContext = async () => {
    if (!quoteData) return;
    setLoadingContext(true);
    try {
      const res = await fetch("/api/context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: quoteData.id }),
      });
      const data = await res.json();
      // Update the quote record with the new aiContext
      setQuoteData((prev) =>
        prev ? { ...prev, context: data.aiContext } : prev
      );
    } catch (error) {
      console.error("Error generating context:", error);
    } finally {
      setLoadingContext(false);
    }
  };

  // When the component mounts, fetch a quote.
  useEffect(() => {
    fetchQuote();
  }, []);

  // Once a quote is fetched, automatically generate its context if it's empty.
  useEffect(() => {
    if (quoteData && !quoteData.context) {
      generateContext();
    }
  }, [quoteData]);

  return (
    <div className={styles.homeContainer}>
      <Header />
      <main className={styles.mainContent}>
        {quoteData ? (
          <QuoteCard 
            quote={quoteData.quote} 
            author={quoteData.author} 
            context={quoteData.context || ""} 
            createdAt={quoteData.createdAt}
          />
        ) : (
          <p>Loading quote...</p>
        )}
        <div className={styles.buttonContainer}>
          <button 
            onClick={fetchQuote} 
            className={`${styles.button} ${styles.buttonBlue}`}
            disabled={loadingQuote}
          >
            {loadingQuote ? "Fetching..." : "New Quote"}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
