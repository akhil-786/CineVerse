'use server';

/**
 * @fileOverview Automatically fetches movie/anime metadata (duration, tags, description) when a new video is uploaded.
 *
 * - autoFetchContentMetadata - A function that handles fetching content metadata.
 * - AutoFetchContentMetadataInput - The input type for the autoFetchContentMetadata function.
 * - AutoFetchContentMetadataOutput - The return type for the autoFetchContentMetadata function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoFetchContentMetadataInputSchema = z.object({
  videoUrl: z.string().describe('URL of the video to fetch metadata from.'),
  title: z.string().describe('Title of the content.'),
});
export type AutoFetchContentMetadataInput = z.infer<typeof AutoFetchContentMetadataInputSchema>;

const AutoFetchContentMetadataOutputSchema = z.object({
  duration: z.string().describe('Duration of the video (e.g., "1h 30m").'),
  tags: z.array(z.string()).describe('Keywords or tags associated with the content.'),
  description: z.string().describe('A brief summary of the content.'),
});
export type AutoFetchContentMetadataOutput = z.infer<typeof AutoFetchContentMetadataOutputSchema>;

export async function autoFetchContentMetadata(input: AutoFetchContentMetadataInput): Promise<AutoFetchContentMetadataOutput> {
  return autoFetchContentMetadataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoFetchContentMetadataPrompt',
  input: {schema: AutoFetchContentMetadataInputSchema},
  output: {schema: AutoFetchContentMetadataOutputSchema},
  prompt: `You are an AI assistant that extracts metadata from video content.

  Given the video URL: {{{videoUrl}}} and title: {{{title}}}, extract the following information:

  - duration: The length of the video in hours and minutes (e.g., "1h 30m").
  - tags: Keywords or tags that describe the content of the video.
  - description: A short summary of the video's content.

  Return the extracted information in JSON format. Be concise and accurate.
  `, 
});

const autoFetchContentMetadataFlow = ai.defineFlow(
  {
    name: 'autoFetchContentMetadataFlow',
    inputSchema: AutoFetchContentMetadataInputSchema,
    outputSchema: AutoFetchContentMetadataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
