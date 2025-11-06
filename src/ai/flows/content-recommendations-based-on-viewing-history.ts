'use server';

/**
 * @fileOverview A content recommendation AI agent based on viewing history.
 *
 * - contentRecommendationsBasedOnViewingHistory - A function that handles the content recommendation process.
 * - ContentRecommendationsBasedOnViewingHistoryInput - The input type for the contentRecommendationsBasedOnViewingHistory function.
 * - ContentRecommendationsBasedOnViewingHistoryOutput - The return type for the contentRecommendationsBasedOnViewingHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentRecommendationsBasedOnViewingHistoryInputSchema = z.object({
  viewingHistory: z
    .array(z.string())
    .describe('An array of content IDs representing the user\'s viewing history.'),
  contentTags: z
    .record(z.array(z.string()))
    .describe('A record of content IDs and their associated tags.'),
});
export type ContentRecommendationsBasedOnViewingHistoryInput = z.infer<
  typeof ContentRecommendationsBasedOnViewingHistoryInputSchema
>;

const ContentRecommendationsBasedOnViewingHistoryOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('An array of content IDs representing the recommended content.'),
});
export type ContentRecommendationsBasedOnViewingHistoryOutput = z.infer<
  typeof ContentRecommendationsBasedOnViewingHistoryOutputSchema
>;

export async function contentRecommendationsBasedOnViewingHistory(
  input: ContentRecommendationsBasedOnViewingHistoryInput
): Promise<ContentRecommendationsBasedOnViewingHistoryOutput> {
  return contentRecommendationsBasedOnViewingHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentRecommendationsBasedOnViewingHistoryPrompt',
  input: {schema: ContentRecommendationsBasedOnViewingHistoryInputSchema},
  output: {schema: ContentRecommendationsBasedOnViewingHistoryOutputSchema},
  prompt: `You are an expert content recommendation system.

  Based on the user's viewing history and the content's tags, you will recommend similar content.

  Viewing History: {{{viewingHistory}}}
  Content Tags: {{{contentTags}}}

  Recommendations:`,
});

const contentRecommendationsBasedOnViewingHistoryFlow = ai.defineFlow(
  {
    name: 'contentRecommendationsBasedOnViewingHistoryFlow',
    inputSchema: ContentRecommendationsBasedOnViewingHistoryInputSchema,
    outputSchema: ContentRecommendationsBasedOnViewingHistoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
