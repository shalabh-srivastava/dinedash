import {genkit} from 'genkit';
import {config} from 'dotenv';

config(); // Ensure environment variables are loaded

export const ai = genkit({
  plugins: [
    // No AI provider plugin configured, AI calls will need to be mocked or will fail
    // If you resolve npm issues, you can add a plugin here:
    // e.g., mistralai({apiKey: process.env.MISTRAL_API_KEY}),
  ],
  // No default model specified as no plugin is active
  telemetry: {
    instrumentation: {
      llm: true,
    },
    logger: {
      level: 'debug', // Set to 'info' or 'warn' for less verbose logging
    },
  },
});
