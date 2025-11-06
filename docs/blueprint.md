# **App Name**: CineVerse

## Core Features:

- Content Upload & Management: Admin interface for uploading movie and anime content with metadata, including title, description, thumbnails, and video links. Auto-fetch metadata will use AI tool.
- AI Recommendations: Utilize the Gemini API via Firebase Functions to provide content recommendations based on user viewing history and content tags. The AI acts as a tool to create similar recommendation using viewing history.
- User Authentication: Firebase Authentication integration for user login/signup with Google and email providers. User profile page to manage watchlist and preferences.
- Watchlist Management: Allow users to add and remove content from their personal watchlist, stored in Firestore. Provides a customized viewing experience.
- Content Streaming: Streaming platform for movies and anime, supporting video playback and display of content metadata such as title, description and a Neon glow border around the player.
- Content Discovery: Displaying curated lists of trending content with shimmer loaders. Ability to filter movies and anime by genre, year, and language using the Firestore database.
- User progress: Custom video player that automatically resumes playback progress stored in Firestore database.

## Style Guidelines:

- Primary color: Deep red (#B3002D) to evoke feelings of excitement and cinematic drama.
- Background color: Dark, desaturated purple (#262429) provides a sophisticated backdrop to the red primary.
- Accent color: Desaturated cyan (#2D7DA3) balances the warm colors, calling back to sci-fi themes.
- Body text: 'Inter' (sans-serif) for body text to provide a neutral reading experience.
- Headline text: 'Space Grotesk' (sans-serif) is for a computerized, techy look for the headlines.
- Lucide Icons set for a clean and modern look across the platform.
- Dark glassmorphism theme to add depth and modernity with backdrop-blur-md.
- Framer Motion is for implementing UI motion and smooth fade transitions.