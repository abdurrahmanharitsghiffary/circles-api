import { getEnv } from "@/utils/env";
import { createClient } from "@deepgram/sdk";

export const deepgram = createClient(getEnv("DEEPGRAM_API_KEY"));
