// src/app/api/quote/route.ts
import { NextResponse } from "next/server";
import { fetchRandomQuote } from "@/lib/forismatic";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { quoteText, quoteAuthor } = await fetchRandomQuote();
    const savedQuote = await prisma.quote.create({
      data: {
        quoteText,
        quoteAuthor,
      },
    });

    // Map the keys to a simplified structure:
    return NextResponse.json({
      id: savedQuote.id,
      quote: savedQuote.quoteText,
      author: savedQuote.quoteAuthor,
      context: savedQuote.aiContext, // Will be null initially
      createdAt: savedQuote.createdAt,
    });
  } catch (error) {
    console.error("Error in quote endpoint:", error);
    return NextResponse.json(
      { error: "Failed to fetch and store quote" },
      { status: 500 }
    );
  }
}
