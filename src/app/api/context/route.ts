// src/app/api/context/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generateHumorousContext } from "@/lib/openai";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Quote ID is required" }, { status: 400 });
    }

    const quoteRecord = await prisma.quote.findUnique({ where: { id } });
    if (!quoteRecord) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    // Generate humorous context using Azure OpenAI
    const context = await generateHumorousContext(quoteRecord.quoteText);

    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: { aiContext: context },
    });

    return NextResponse.json(updatedQuote);
  } catch (error) {
    console.error("Error in /api/context route:", error);
    return NextResponse.json({ error: "Failed to generate context" }, { status: 500 });
  }
  
}
